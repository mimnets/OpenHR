import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Guards the tenant boundary at the migration level.
 *
 * In August 2026, migration 0014 widened the SELECT policies on `leaves` and
 * `attendance` to grant cross-organization reporting visibility. The rule it
 * produced read:
 *
 *   is_super_admin() or auth_role() in ('ADMIN','HR') or organization_id = auth_org_id()
 *
 * Because ADMIN and HR are per-organization roles, that middle alternative
 * matched every row in the database, and 168 accounts across 163 organizations
 * could read each other's leave and attendance records for months.
 *
 * The shape of the mistake is what matters: a policy is a chain of OR
 * alternatives, and it only takes ONE alternative without a tenant predicate to
 * open the whole table. This test replays every migration in order to work out
 * the policies actually in force, then checks each alternative individually.
 */

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'supabase/migrations');

/** Tables holding per-organization data. Every alternative must be tenant-bound. */
const TENANT_TABLES = [
  'leaves',
  'attendance',
  'profiles',
  'teams',
  'shifts',
  'announcements',
  'settings',
  'organizations',
  'audit_logs',
] as const;

/**
 * Tokens that bind an alternative to one tenant or to the platform operator.
 * `id =` covers `organizations`, whose own primary key is the tenant key.
 */
const TENANT_PREDICATES = [
  'organization_id',
  'auth_org_id',
  'is_super_admin',
  'auth.uid',
  'id = public.auth_org_id',
  'id = auth_org_id',
];

interface Policy {
  table: string;
  name: string;
  cmd: string;
  using: string;
  source: string;
}

/** Reads a parenthesised group starting at `open`, respecting nesting and quotes. */
function readBalancedGroup(sql: string, open: number): string {
  let depth = 0;
  let inSingle = false;
  for (let i = open; i < sql.length; i++) {
    const ch = sql[i];
    if (ch === "'" && sql[i - 1] !== '\\') inSingle = !inSingle;
    if (inSingle) continue;
    if (ch === '(') depth++;
    else if (ch === ')') {
      depth--;
      if (depth === 0) return sql.slice(open + 1, i);
    }
  }
  return sql.slice(open + 1);
}

/** Strips `-- line comments` so commented-out SQL is never parsed as real. */
function stripComments(sql: string): string {
  return sql.replace(/--[^\n]*/g, '');
}

/**
 * Replays every migration in filename order and returns the surviving policies.
 * Later CREATEs replace earlier ones; DROPs remove them. This is what the
 * database ends up with, not what any single file says.
 */
function resolveFinalPolicies(): Map<string, Policy> {
  const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql')).sort();
  const policies = new Map<string, Policy>();

  for (const file of files) {
    const sql = stripComments(fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8'));

    // drop policy [if exists] "name" on [public.]table
    const dropRe = /drop\s+policy\s+(?:if\s+exists\s+)?"([^"]+)"\s+on\s+(?:public\.)?"?(\w+)"?/gi;
    for (const m of sql.matchAll(dropRe)) {
      policies.delete(`${m[2].toLowerCase()}.${m[1]}`);
    }

    // create policy "name" on [public.]table for CMD ... using ( ... )
    const createRe = /create\s+policy\s+"([^"]+)"\s+on\s+(?:public\.)?"?(\w+)"?\s+for\s+(\w+)/gi;
    for (const m of sql.matchAll(createRe)) {
      const [, name, table, cmd] = m;
      const tail = sql.slice(m.index! + m[0].length);

      // `using` carries the read/visibility predicate. INSERT-only policies use
      // `with check` instead and have no `using` clause at all.
      const usingMatch = /\busing\s*\(/i.exec(tail);
      let using = '';
      if (usingMatch) {
        const open = usingMatch.index + usingMatch[0].length - 1;
        using = readBalancedGroup(tail, open);
      }

      policies.set(`${table.toLowerCase()}.${name}`, {
        table: table.toLowerCase(),
        name,
        cmd: cmd.toUpperCase(),
        using: using.replace(/\s+/g, ' ').trim(),
        source: file,
      });
    }
  }

  return policies;
}

/** Splits a policy expression into its top-level OR alternatives. */
function topLevelOrBranches(expr: string): string[] {
  const branches: string[] = [];
  let depth = 0;
  let inSingle = false;
  let start = 0;

  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === "'" && expr[i - 1] !== '\\') inSingle = !inSingle;
    if (inSingle) continue;
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    else if (depth === 0 && /\s/.test(ch)) {
      if (/^\s+or\s/i.test(expr.slice(i, i + 4))) {
        branches.push(expr.slice(start, i));
        start = i + 4;
        i += 3;
      }
    }
  }
  branches.push(expr.slice(start));
  return branches.map(b => b.trim()).filter(Boolean);
}

const isTenantBound = (branch: string) =>
  TENANT_PREDICATES.some(p => branch.toLowerCase().includes(p.toLowerCase()));

describe('tenant isolation in RLS policies', () => {
  const policies = resolveFinalPolicies();

  it('parses the migration set', () => {
    expect(policies.size).toBeGreaterThan(20);
  });

  it.each(TENANT_TABLES)('every policy alternative on %s is tenant-bound', (table) => {
    const forTable = [...policies.values()].filter(p => p.table === table && p.using);
    expect(forTable.length).toBeGreaterThan(0);

    const leaks: string[] = [];
    for (const policy of forTable) {
      for (const branch of topLevelOrBranches(policy.using)) {
        if (!isTenantBound(branch)) {
          leaks.push(
            `${policy.table}.${policy.name} (${policy.cmd}, last set in ${policy.source}) ` +
            `has an alternative with no organization predicate: "${branch}"`,
          );
        }
      }
    }

    // A role check alone is never enough: ADMIN and HR exist in every
    // organization, so `auth_role() in ('ADMIN','HR')` matches the whole table.
    expect(leaks).toEqual([]);
  });

  it('rejects the exact 0014 regression', () => {
    const branches = topLevelOrBranches(
      "public.is_super_admin() or public.auth_role() in ('ADMIN', 'HR') or organization_id = public.auth_org_id()",
    );
    expect(branches).toHaveLength(3);
    expect(branches.filter(b => !isTenantBound(b))).toEqual([
      "public.auth_role() in ('ADMIN', 'HR')",
    ]);
  });

  it('audit_logs cannot be written through the API', () => {
    const writes = [...policies.values()].filter(
      p => p.table === 'audit_logs' && ['INSERT', 'UPDATE', 'DELETE', 'ALL'].includes(p.cmd),
    );
    // History is written by a security-definer trigger. With RLS enabled and no
    // permissive write policy, nobody can rewrite it — not even an org's admins.
    expect(writes).toEqual([]);
  });
});

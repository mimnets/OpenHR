import { supabase, isSupabaseConfigured } from './supabase';

// Reads the database audit trail written by the fn_audit_row trigger.
//
// Row-level security decides scope, not this file: SUPER_ADMIN sees every
// organization, an organization's ADMIN/HR sees only its own. There is no write
// path here on purpose — audit_logs has no insert, update or delete policy, so
// history cannot be altered through the API by anyone.

export type AuditAction = 'INSERT' | 'UPDATE' | 'DELETE';

export interface AuditEntry {
  id: string;
  occurredAt: string;
  actorId: string | null;
  actorName: string;
  actorRole: string;
  organizationId: string | null;
  organizationName: string;
  tableName: string;
  recordId: string;
  action: AuditAction;
  changedFields: string[];
  oldData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
}

export interface AuditFilters {
  organizationId?: string;
  tableName?: string;
  action?: AuditAction;
  actorId?: string;
  /** ISO date; entries on or after this instant. */
  since?: string;
  search?: string;
  limit?: number;
}

/** Tables carrying a trigger. Keep in step with migration 0026. */
export const AUDITED_TABLES = [
  'leaves',
  'attendance',
  'profiles',
  'organizations',
  'settings',
] as const;

export const auditService = {
  async getAuditLog(filters: AuditFilters = {}): Promise<AuditEntry[]> {
    if (!isSupabaseConfigured()) return [];

    const limit = filters.limit ?? 200;

    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('occurred_at', { ascending: false })
      .limit(limit);

    if (filters.organizationId) query = query.eq('organization_id', filters.organizationId);
    if (filters.tableName)      query = query.eq('table_name', filters.tableName);
    if (filters.action)         query = query.eq('action', filters.action);
    if (filters.actorId)        query = query.eq('actor_id', filters.actorId);
    if (filters.since)          query = query.gte('occurred_at', filters.since);

    const { data, error } = await query;
    if (error) {
      console.error('[AuditService] Failed to load audit log:', error.message);
      throw new Error('Could not load the audit log.');
    }

    const rows = data ?? [];
    if (rows.length === 0) return [];

    // Resolve actor and organization names in two batched lookups rather than
    // one join, because RLS on profiles is evaluated per row and a join here
    // would silently drop entries whose actor the caller cannot read.
    const actorIds = [...new Set(rows.map(r => r.actor_id).filter(Boolean))] as string[];
    const orgIds   = [...new Set(rows.map(r => r.organization_id).filter(Boolean))] as string[];

    const [actorRes, orgRes] = await Promise.all([
      actorIds.length
        ? supabase.from('profiles').select('id, name, email').in('id', actorIds)
        : Promise.resolve({ data: [] as any[] }),
      orgIds.length
        ? supabase.from('organizations').select('id, name').in('id', orgIds)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const actorMap = new Map((actorRes.data ?? []).map((p: any) => [p.id, p.name || p.email]));
    const orgMap   = new Map((orgRes.data ?? []).map((o: any) => [o.id, o.name]));

    const entries: AuditEntry[] = rows.map((r: any) => ({
      id: r.id,
      occurredAt: r.occurred_at,
      actorId: r.actor_id,
      // A null actor means the write came from a cron job or an edge function
      // running with the service role — real, and worth naming plainly.
      actorName: r.actor_id
        ? (actorMap.get(r.actor_id) ?? 'Deleted user')
        : 'System / automated job',
      actorRole: r.actor_role || 'UNKNOWN',
      organizationId: r.organization_id,
      organizationName: r.organization_id ? (orgMap.get(r.organization_id) ?? 'Unknown') : '—',
      tableName: r.table_name,
      recordId: r.record_id,
      action: r.action,
      changedFields: r.changed_fields ?? [],
      oldData: r.old_data,
      newData: r.new_data,
    }));

    if (!filters.search?.trim()) return entries;

    // Client-side text match across the fields a person would actually search.
    const needle = filters.search.trim().toLowerCase();
    return entries.filter(e =>
      e.actorName.toLowerCase().includes(needle) ||
      e.organizationName.toLowerCase().includes(needle) ||
      e.tableName.toLowerCase().includes(needle) ||
      e.recordId.toLowerCase().includes(needle) ||
      e.changedFields.some(f => f.toLowerCase().includes(needle)) ||
      JSON.stringify(e.newData ?? {}).toLowerCase().includes(needle),
    );
  },

  /** Full history for one record, oldest first — the "what happened to this leave" view. */
  async getRecordHistory(tableName: string, recordId: string): Promise<AuditEntry[]> {
    const entries = await auditService.getAuditLog({ tableName, limit: 500 });
    return entries.filter(e => e.recordId === recordId).reverse();
  },
};

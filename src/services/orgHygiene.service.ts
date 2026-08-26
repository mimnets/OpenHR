import { supabase, isSupabaseConfigured } from './supabase';
import { superAdminService } from './superadmin.service';

// Scores organizations against the signals that distinguish a real customer
// from the residue of an unprotected signup form.
//
// Nothing here deletes anything or decides anything on its own. It produces
// evidence and a suggested reading; a person chooses. That matters because the
// signals are heuristics — a genuine small company that signed up on Friday
// looks identical to a bot until it starts using the product.

export type RiskLevel = 'HEALTHY' | 'LOW' | 'MEDIUM' | 'HIGH';

export interface HygieneFlag {
  code: string;
  label: string;
  /** Why this matters, in the reviewer's terms. */
  detail: string;
  weight: number;
}

export interface OrgHygiene {
  id: string;
  name: string;
  created: string;
  country: string | null;
  subscription: string | null;
  trialEnd: string | null;
  isDemo: boolean;
  userCount: number;
  unverifiedCount: number;
  attendanceCount: number;
  leaveCount: number;
  settingsCount: number;
  adminEmail: string | null;
  lastActivity: string | null;
  flags: HygieneFlag[];
  score: number;
  risk: RiskLevel;
  /** True when the org holds real work — deleting it destroys customer data. */
  hasRealData: boolean;
}

// Free/disposable mailbox providers. Not proof of abuse on its own — plenty of
// legitimate sole traders use a free address — which is why it carries a low
// weight and only becomes meaningful stacked with silence.
const FREEMAIL = new Set([
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com',
  'aol.com', 'icloud.com', 'proton.me', 'protonmail.com', 'gmx.com',
  'yandex.com', 'mail.com', 'zoho.com',
]);

// Throwaway inbox services. These are a much stronger signal.
const DISPOSABLE = new Set([
  'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.com',
  'temp-mail.org', 'throwawaymail.com', 'yopmail.com', 'trashmail.com',
  'sharklasers.com', 'getnada.com', 'maildrop.cc', 'dispostable.com',
  'fakeinbox.com', 'mailnesia.com', 'emailondeck.com', 'example.com',
  'example.invalid', 'test.com',
]);

const PLACEHOLDER_NAME = /^(test|testing|abc|abcd|asd|asdf|qwe|qwerty|xyz|demo|sample|foo|bar|new org|my org|company|organization|untitled|none|na|n\/a)\b/i;

const daysSince = (iso: string | null): number | null => {
  if (!iso) return null;
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
};

const domainOf = (email: string | null): string | null =>
  email && email.includes('@') ? email.split('@').pop()!.toLowerCase().trim() : null;

function assess(row: any): OrgHygiene {
  const name = (row.org_name ?? '').trim();
  const adminEmail: string | null = row.admin_email ?? null;
  const domain = domainOf(adminEmail);

  const userCount       = row.user_count ?? 0;
  const unverifiedCount = row.unverified_count ?? 0;
  const attendanceCount = row.attendance_count ?? 0;
  const leaveCount      = row.leave_count ?? 0;
  const settingsCount   = row.settings_count ?? 0;
  const lastActivity    = row.last_activity ?? null;
  const isDemo          = Boolean(row.org_is_demo);

  const hasRealData = attendanceCount > 0 || leaveCount > 0 || userCount > 1;
  const ageDays     = daysSince(row.org_created) ?? 0;
  const flags: HygieneFlag[] = [];

  // The demo org is seeded deliberately and must never be scored as junk.
  if (isDemo) {
    return {
      id: row.org_id, name, created: row.org_created, country: row.org_country,
      subscription: row.org_subscription, trialEnd: row.org_trial_end, isDemo,
      userCount, unverifiedCount, attendanceCount, leaveCount, settingsCount,
      adminEmail, lastActivity, flags: [], score: 0, risk: 'HEALTHY',
      hasRealData: true,
    };
  }

  if (attendanceCount === 0 && leaveCount === 0) {
    flags.push({
      code: 'NO_ACTIVITY', label: 'Never used', weight: 3,
      detail: 'No attendance and no leave records have ever been created.',
    });
  }

  if (userCount <= 1) {
    flags.push({
      code: 'SOLO', label: 'One account only', weight: 2,
      detail: 'Only the founding admin exists — no employees were ever added.',
    });
  }

  if (unverifiedCount > 0 && unverifiedCount === userCount) {
    flags.push({
      code: 'UNVERIFIED', label: 'Email never confirmed', weight: 3,
      detail: 'Nobody in this organization has confirmed their email address.',
    });
  }

  if (settingsCount === 0) {
    flags.push({
      code: 'UNCONFIGURED', label: 'Never set up', weight: 1,
      detail: 'No settings were saved — the setup flow was not completed.',
    });
  }

  if (domain && DISPOSABLE.has(domain)) {
    flags.push({
      code: 'DISPOSABLE_EMAIL', label: 'Throwaway email', weight: 3,
      detail: `Registered with ${domain}, a disposable inbox service.`,
    });
  } else if (domain && FREEMAIL.has(domain) && attendanceCount === 0) {
    flags.push({
      code: 'FREEMAIL', label: 'Personal email', weight: 1,
      detail: `Registered with a free provider (${domain}) and never used. Weak on its own.`,
    });
  }

  if (name.length < 3 || PLACEHOLDER_NAME.test(name) || /^[\d\s\W]+$/.test(name)) {
    flags.push({
      code: 'PLACEHOLDER_NAME', label: 'Placeholder name', weight: 2,
      detail: `"${name || '(blank)'}" reads as filler rather than a company name.`,
    });
  }

  const trialAge = daysSince(row.org_trial_end);
  if (trialAge !== null && trialAge > 30 && attendanceCount === 0) {
    flags.push({
      code: 'STALE_TRIAL', label: 'Trial long expired', weight: 2,
      detail: `Trial ended ${trialAge} days ago and the account was never used.`,
    });
  }

  const idleDays = daysSince(lastActivity);
  if (idleDays !== null && idleDays > 90) {
    flags.push({
      code: 'DORMANT', label: 'Dormant', weight: 1,
      detail: `Last activity was ${idleDays} days ago.`,
    });
  }

  // A brand-new signup has not had a chance to do anything yet. Withhold
  // judgement rather than flagging every legitimate customer on day one.
  const tooYoungToJudge = ageDays < 7;

  const score = tooYoungToJudge ? 0 : flags.reduce((sum, f) => sum + f.weight, 0);

  let risk: RiskLevel = 'HEALTHY';
  if (tooYoungToJudge) risk = 'HEALTHY';
  else if (score >= 8) risk = 'HIGH';
  else if (score >= 5) risk = 'MEDIUM';
  else if (score >= 2) risk = 'LOW';

  if (tooYoungToJudge && flags.length) {
    flags.unshift({
      code: 'TOO_NEW', label: 'Signed up this week', weight: 0,
      detail: 'Under 7 days old — not scored yet, since a real customer looks like this on day one.',
    });
  }

  return {
    id: row.org_id, name, created: row.org_created, country: row.org_country,
    subscription: row.org_subscription, trialEnd: row.org_trial_end, isDemo,
    userCount, unverifiedCount, attendanceCount, leaveCount, settingsCount,
    adminEmail, lastActivity, flags, score, risk, hasRealData,
  };
}

export const orgHygieneService = {
  async getReport(): Promise<OrgHygiene[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase.rpc('org_hygiene_report');
    if (error) {
      console.error('[OrgHygiene] Report failed:', error.message);
      throw new Error(
        error.code === '42501'
          ? 'Only a super admin can run the organization review.'
          : 'Could not load the organization review.',
      );
    }

    return (data ?? []).map(assess);
  },

  /**
   * Permanently deletes an organization and everything belonging to it.
   * Irreversible: the edge function cascades every child row and then removes
   * the auth users. Every deletion is captured by the audit trigger first.
   */
  async deleteOrganization(id: string): Promise<{ success: boolean; message: string }> {
    return superAdminService.deleteOrganization(id);
  },
};

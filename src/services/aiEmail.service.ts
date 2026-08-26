import { supabase, isSupabaseConfigured } from './supabase';

// Super-admin surface for the lifecycle email automation.
//
// Templates are the only thing editable from the dashboard. The send ledger is
// read-only by policy — it is the record of what actually went out, and a
// delivery record you can edit is not a record.

export type EmailProvider = 'openrouter' | 'deepseek' | 'openai' | 'anthropic';
export type EmailAudience =
  | 'UNCONFIRMED_ADMIN'
  | 'NO_EMPLOYEES'
  | 'NO_ATTENDANCE'
  | 'TRIAL_ENDING'
  | 'TRIAL_EXPIRED'
  | 'WELCOME'
  | 'SETUP_INCOMPLETE'
  | 'DORMANT'
  | 'ACTIVE_ENGAGED';

export interface EmailTemplate {
  id: string;
  key: string;
  name: string;
  description: string | null;
  audience: EmailAudience;
  subjectTemplate: string;
  bodyTemplate: string;
  aiEnabled: boolean;
  aiPrompt: string | null;
  provider: EmailProvider;
  model: string;
  sendAfterDays: number[];
  dailyCap: number;
  isActive: boolean;
  updated: string;
}

export interface EmailSend {
  id: string;
  templateKey: string;
  stage: number;
  recipientEmail: string;
  organizationId: string | null;
  status: 'SENT' | 'FAILED' | 'SKIPPED' | 'PREVIEW';
  provider: string | null;
  model: string | null;
  subject: string | null;
  aiUsed: boolean;
  error: string | null;
  created: string;
}

export interface EmailSuppression {
  email: string;
  reason: 'HARD_BOUNCE' | 'UNSUBSCRIBED' | 'COMPLAINT' | 'MANUAL';
  note: string | null;
  created: string;
}

export interface PreviewResult {
  subject: string;
  html: string;
  /** The message inside the branded frame — what actually lands in an inbox. */
  framedHtml?: string;
  aiUsed: boolean;
  aiError: string | null;
  sent: boolean;
  sentTo: string | null;
  provider: string;
  model: string;
  availableProviders: EmailProvider[];
  sampleVars: Record<string, string>;
}

export const AUDIENCE_LABEL: Record<EmailAudience, string> = {
  UNCONFIRMED_ADMIN: 'Admins who never confirmed their email',
  NO_EMPLOYEES:      'Organizations with no employees added',
  NO_ATTENDANCE:     'Organizations that have never checked in',
  SETUP_INCOMPLETE:  'Organizations that never finished setup',
  TRIAL_ENDING:      'Organizations whose trial is ending soon',
  TRIAL_EXPIRED:     'Organizations whose trial has already lapsed',
  WELCOME:           'Organizations that are set up and running',
  DORMANT:           'Organizations that were active and went quiet',
  ACTIVE_ENGAGED:    'Healthy, active organizations (product news)',
};

/** What the stage numbers mean for each audience — they are not all "days since signup". */
export const AUDIENCE_TIMING: Record<EmailAudience, string> = {
  UNCONFIRMED_ADMIN: 'Days since they registered',
  NO_EMPLOYEES:      'Days since the organization was created',
  NO_ATTENDANCE:     'Days since the organization was created',
  SETUP_INCOMPLETE:  'Days since the organization was created',
  TRIAL_ENDING:      'Days REMAINING before the trial ends',
  TRIAL_EXPIRED:     'Days since the trial lapsed',
  WELCOME:           'Days since the organization was created',
  DORMANT:           'Days since their last check-in',
  ACTIVE_ENGAGED:    'Days since the organization was created',
};

const mapTemplate = (r: any): EmailTemplate => ({
  id: r.id,
  key: r.key,
  name: r.name,
  description: r.description,
  audience: r.audience,
  subjectTemplate: r.subject_template,
  bodyTemplate: r.body_template,
  aiEnabled: r.ai_enabled,
  aiPrompt: r.ai_prompt,
  provider: r.provider,
  model: r.model,
  sendAfterDays: r.send_after_days ?? [],
  dailyCap: r.daily_cap,
  isActive: r.is_active,
  updated: r.updated,
});

export interface ReportResult {
  question: string;
  /** The generated SQL, surfaced so it can be read before it is trusted. */
  sql: string;
  explanation: string;
  rows: Record<string, unknown>[];
  rowCount: number;
  truncated?: boolean;
  queryError: string | null;
  summary: string | null;
  provider: string;
  model: string;
  availableProviders?: EmailProvider[];
}

export const aiEmailService = {
  /**
   * Asks a question about the customer base in plain English.
   *
   * The generated SQL runs with the caller's own database privileges and is
   * capped at 200 rows, so it can never return more than the super admin could
   * already read. The SQL comes back with the answer on purpose — a generated
   * query you cannot inspect is a query you cannot check.
   */
  async askReport(question: string, provider?: EmailProvider, model?: string): Promise<ReportResult> {
    const { data, error } = await supabase.functions.invoke('ai-admin-report', {
      body: { question, provider, model },
    });
    if (error) {
      let message = error.message;
      try {
        const body = await (error as any).context?.json?.();
        if (body?.message) message = body.message;
      } catch { /* keep the original */ }
      throw new Error(message);
    }
    return data as ReportResult;
  },

  async getTemplates(): Promise<EmailTemplate[]> {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase
      .from('email_templates').select('*').order('key');
    if (error) {
      console.error('[AIEmail] Failed to load templates:', error.message);
      throw new Error('Could not load the email templates.');
    }
    return (data ?? []).map(mapTemplate);
  },

  async updateTemplate(id: string, patch: Partial<EmailTemplate>): Promise<void> {
    const row: Record<string, unknown> = { updated: new Date().toISOString() };
    if (patch.subjectTemplate !== undefined) row.subject_template = patch.subjectTemplate;
    if (patch.bodyTemplate    !== undefined) row.body_template    = patch.bodyTemplate;
    if (patch.aiEnabled       !== undefined) row.ai_enabled       = patch.aiEnabled;
    if (patch.aiPrompt        !== undefined) row.ai_prompt        = patch.aiPrompt;
    if (patch.provider        !== undefined) row.provider         = patch.provider;
    if (patch.model           !== undefined) row.model            = patch.model;
    if (patch.sendAfterDays   !== undefined) row.send_after_days  = patch.sendAfterDays;
    if (patch.dailyCap        !== undefined) row.daily_cap        = patch.dailyCap;
    if (patch.isActive        !== undefined) row.is_active        = patch.isActive;

    const { data, error } = await supabase
      .from('email_templates').update(row).eq('id', id).select('id');
    if (error) throw new Error(error.message);
    // A policy refusal returns success with zero rows, so check explicitly.
    if (!data || data.length === 0) {
      throw new Error('That change was not saved. Only a super admin can edit templates.');
    }
  },

  /**
   * Creates a template. It arrives inactive regardless of what is passed —
   * a new template should never start sending the moment it is saved.
   */
  async createTemplate(t: {
    key: string;
    name: string;
    description?: string;
    audience: EmailAudience;
    subjectTemplate: string;
    bodyTemplate: string;
    aiPrompt?: string;
    aiEnabled?: boolean;
    provider?: EmailProvider;
    model?: string;
    sendAfterDays?: number[];
    dailyCap?: number;
  }): Promise<EmailTemplate> {
    const key = t.key.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    if (!/^[a-z][a-z0-9_]{2,49}$/.test(key)) {
      throw new Error('The template ID must start with a letter and use only lowercase letters, numbers and underscores.');
    }

    const { data, error } = await supabase.from('email_templates').insert({
      key,
      name: t.name.trim(),
      description: t.description?.trim() || null,
      audience: t.audience,
      subject_template: t.subjectTemplate,
      body_template: t.bodyTemplate,
      ai_prompt: t.aiPrompt ?? null,
      ai_enabled: t.aiEnabled ?? true,
      provider: t.provider ?? 'openrouter',
      model: t.model ?? 'google/gemma-4-31b-it:free',
      send_after_days: t.sendAfterDays?.length ? t.sendAfterDays : [1],
      daily_cap: t.dailyCap ?? 50,
      is_active: false,
    }).select('*').single();

    if (error) {
      if (error.code === '23505') throw new Error(`A template with the ID "${key}" already exists.`);
      throw new Error(error.message);
    }
    return mapTemplate(data);
  },

  /** Removes a template. The record of what it already sent is kept. */
  async deleteTemplate(id: string): Promise<void> {
    const { data, error } = await supabase
      .from('email_templates').delete().eq('id', id).select('id');
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) {
      throw new Error('That template was not deleted. Only a super admin can remove templates.');
    }
  },

  /** Generates a preview. mode 'test-send' emails it to the caller only. */
  async preview(templateKey: string, mode: 'preview' | 'test-send' = 'preview'): Promise<PreviewResult> {
    const { data, error } = await supabase.functions.invoke('ai-email-preview', {
      body: { templateKey, mode },
    });
    if (error) {
      let message = error.message;
      try {
        const body = await (error as any).context?.json?.();
        if (body?.message) message = body.message;
      } catch { /* keep the original message */ }
      throw new Error(message);
    }
    return data as PreviewResult;
  },

  async getSends(limit = 100): Promise<EmailSend[]> {
    const { data, error } = await supabase
      .from('email_sends').select('*').order('created', { ascending: false }).limit(limit);
    if (error) throw new Error('Could not load the send history.');
    return (data ?? []).map((r: any) => ({
      id: r.id,
      templateKey: r.template_key,
      stage: r.stage,
      recipientEmail: r.recipient_email,
      organizationId: r.organization_id,
      status: r.status,
      provider: r.provider,
      model: r.model,
      subject: r.subject,
      aiUsed: r.ai_used,
      error: r.error,
      created: r.created,
    }));
  },

  async getSuppressions(): Promise<EmailSuppression[]> {
    const { data, error } = await supabase
      .from('email_suppressions').select('*').order('created', { ascending: false });
    if (error) throw new Error('Could not load the suppression list.');
    return (data ?? []) as EmailSuppression[];
  },

  async addSuppression(email: string, reason: EmailSuppression['reason'], note?: string): Promise<void> {
    const { error } = await supabase.from('email_suppressions')
      .upsert({ email: email.trim().toLowerCase(), reason, note: note ?? null }, { onConflict: 'email' });
    if (error) throw new Error(error.message);
  },

  async removeSuppression(email: string): Promise<void> {
    const { error } = await supabase.from('email_suppressions').delete().eq('email', email);
    if (error) throw new Error(error.message);
  },
};

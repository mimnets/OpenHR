import React, { useState, useEffect } from 'react';
import {
  Sparkles, RefreshCw, Save, Eye, Send, AlertTriangle, Loader2,
  Power, Ban, Plus, Trash2, MessageSquare, Database, Mail, FilePlus2,
} from 'lucide-react';
import {
  aiEmailService, EmailTemplate, EmailSend, EmailSuppression,
  EmailProvider, EmailAudience, AUDIENCE_LABEL, AUDIENCE_TIMING, PreviewResult, ReportResult,
  OpenRouterModel,
} from '../../services/aiEmail.service';
import BulkEmailManager from './BulkEmailManager';
import ModelPicker from './ModelPicker';
import EmailComposer from './EmailComposer';
import { useToast } from '../../context/ToastContext';

type Tab = 'templates' | 'ask' | 'history' | 'suppressions' | 'bulk';

const statusStyle = (s: EmailSend['status']) => {
  switch (s) {
    case 'SENT':    return 'bg-emerald-100 text-emerald-700';
    case 'FAILED':  return 'bg-rose-100 text-rose-700';
    case 'PREVIEW': return 'bg-indigo-100 text-indigo-700';
    default:        return 'bg-slate-100 text-slate-600';
  }
};

const inputCls =
  'w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-4 focus:ring-primary-light transition-all';

const AIEmail: React.FC = () => {
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>('templates');

  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EmailTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const [sends, setSends] = useState<EmailSend[]>([]);
  const [suppressions, setSuppressions] = useState<EmailSuppression[]>([]);
  const [newSuppression, setNewSuppression] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // OpenRouter catalogue, so a rate-limited model can be swapped for a live one.
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [modelsError, setModelsError] = useState<string | null>(null);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  // Ask panel. Its model is its own, not the selected template's: asking a
  // question about the customer base has nothing to do with which model writes
  // the onboarding email. The choice is remembered because free models get
  // rate-limited often enough that re-picking on every reload would grate.
  const [askProvider, setAskProvider] = useState<EmailProvider>(
    () => (localStorage.getItem('openhr.ask.provider') as EmailProvider) || 'openrouter');
  const [askModel, setAskModel] = useState(
    () => localStorage.getItem('openhr.ask.model') || 'google/gemma-4-31b-it:free');
  const [question, setQuestion] = useState('');
  const [report, setReport] = useState<ReportResult | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [askError, setAskError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const t = await aiEmailService.getTemplates();
      setTemplates(t);
      if (t.length && !selectedId) { setSelectedId(t[0].id); setDraft(t[0]); }
    } catch (e: any) {
      setError(e?.message || 'Could not load the email automation settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadModels = async () => {
    setIsLoadingModels(true);
    setModelsError(null);
    try {
      setModels(await aiEmailService.listOpenRouterModels());
    } catch (e: any) {
      // Not fatal: the field falls back to a free-text slug so a broken
      // catalogue never blocks editing a template.
      setModels([]);
      setModelsError(e?.message || 'Could not reach OpenRouter for the model list.');
    } finally {
      setIsLoadingModels(false);
    }
  };

  useEffect(() => { load(); loadModels(); }, []);

  useEffect(() => {
    localStorage.setItem('openhr.ask.provider', askProvider);
    localStorage.setItem('openhr.ask.model', askModel);
  }, [askProvider, askModel]);

  useEffect(() => {
    if (tab === 'history') aiEmailService.getSends().then(setSends).catch(() => showToast('Could not load history', 'error'));
    if (tab === 'suppressions') aiEmailService.getSuppressions().then(setSuppressions).catch(() => showToast('Could not load suppressions', 'error'));
  }, [tab]);

  const select = (t: EmailTemplate) => {
    setIsCreating(false);
    setSelectedId(t.id);
    setDraft(t);
    setPreview(null);
    setPreviewError(null);
  };

  const startNewTemplate = () => {
    setIsCreating(true);
    setSelectedId(null);
    setPreview(null);
    setPreviewError(null);
    setDraft({
      id: '',
      key: '',
      name: '',
      description: '',
      audience: 'NO_EMPLOYEES',
      subjectTemplate: 'A message about {{org_name}}',
      bodyTemplate: '<p>Hi {{admin_name}},</p><p>Write the plain version here. This is what sends if the model is unavailable.</p><p><a href="{{app_url}}" data-btn="teal">Open your dashboard</a></p>',
      aiEnabled: true,
      aiPrompt: '',
      provider: 'openrouter',
      model: 'google/gemma-4-31b-it:free',
      sendAfterDays: [1],
      dailyCap: 50,
      isActive: false,
      updated: new Date().toISOString(),
    });
  };

  const save = async () => {
    if (!draft) return;
    setIsSaving(true);
    try {
      if (isCreating) {
        if (!draft.name.trim()) throw new Error('Give the template a name.');
        const created = await aiEmailService.createTemplate({
          key: draft.key.trim() || draft.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40),
          name: draft.name,
          description: draft.description ?? undefined,
          audience: draft.audience,
          subjectTemplate: draft.subjectTemplate,
          bodyTemplate: draft.bodyTemplate,
          aiPrompt: draft.aiPrompt ?? undefined,
          aiEnabled: draft.aiEnabled,
          provider: draft.provider,
          model: draft.model,
          sendAfterDays: draft.sendAfterDays,
          dailyCap: draft.dailyCap,
        });
        showToast('Template created. It is off until you turn it on.', 'success');
        setIsCreating(false);
        setSelectedId(created.id);
        setTemplates(await aiEmailService.getTemplates());
        setDraft(created);
      } else {
        await aiEmailService.updateTemplate(draft.id, draft);
        showToast('Template saved.', 'success');
        const t = await aiEmailService.getTemplates();
        setTemplates(t);
        setDraft(t.find(x => x.id === draft.id) ?? draft);
      }
    } catch (e: any) {
      showToast(e?.message || 'Save failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const removeTemplate = async (t: EmailTemplate) => {
    if (!window.confirm(`Delete "${t.name}"? Messages it already sent stay in the history.`)) return;
    try {
      await aiEmailService.deleteTemplate(t.id);
      showToast('Template deleted.', 'success');
      const list = await aiEmailService.getTemplates();
      setTemplates(list);
      if (draft?.id === t.id) { setDraft(list[0] ?? null); setSelectedId(list[0]?.id ?? null); }
    } catch (e: any) {
      showToast(e?.message || 'Could not delete', 'error');
    }
  };

  const runPreview = async (mode: 'preview' | 'test-send') => {
    if (!draft) return;
    setIsPreviewing(true);
    setPreviewError(null);
    setPreview(null);
    try {
      // Preview whatever is on screen, not what is in the database, so a model
      // can be swapped and re-checked before the template is saved.
      const r = await aiEmailService.preview(draft.key, mode, {
        provider: draft.provider,
        model: draft.model,
      });
      setPreview(r);
      if (r.sent) showToast(`Test sent to ${r.sentTo}`, 'success');
    } catch (e: any) {
      setPreviewError(e?.message || 'Preview failed');
    } finally {
      setIsPreviewing(false);
    }
  };

  const toggleActive = async (t: EmailTemplate) => {
    try {
      await aiEmailService.updateTemplate(t.id, { isActive: !t.isActive });
      showToast(t.isActive ? `${t.name} paused.` : `${t.name} is now live and will send on the next run.`, 'success');
      const list = await aiEmailService.getTemplates();
      setTemplates(list);
      if (draft?.id === t.id) setDraft(list.find(x => x.id === t.id) ?? draft);
    } catch (e: any) {
      showToast(e?.message || 'Could not change status', 'error');
    }
  };

  const activeCount = templates.filter(t => t.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-primary" />
            <h3 className="text-xl font-semibold text-slate-900">Email</h3>
          </div>
          <p className="text-xs font-bold text-slate-400 mt-1">
            Automated onboarding email, one-off campaigns, and answers about who to send to
          </p>
        </div>
        <button
          onClick={load}
          disabled={isLoading}
          className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400 hover:text-primary transition-colors disabled:opacity-50"
          aria-label="Refresh"
        >
          <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Standing warning while anything is live */}
      {activeCount > 0 && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-bold text-amber-800">
            {activeCount} template{activeCount === 1 ? ' is' : 's are'} live. The daily job will send to real
            customers. Every message carries a one-click unsubscribe, and nobody receives the same stage twice.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {([['templates', 'Templates'], ['ask', 'Ask AI'], ['history', 'Sent'], ['suppressions', 'Do not email'], ['bulk', 'Bulk email']] as const).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`py-2 px-4 rounded-lg font-bold text-xs transition-all ${
              tab === k ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-start gap-3 p-5 bg-rose-50 border border-rose-100 rounded-2xl">
          <AlertTriangle size={18} className="text-rose-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-bold text-rose-700">{error}</p>
        </div>
      )}

      {isLoading && <p className="text-center py-12 text-xs font-bold text-slate-400 uppercase tracking-widest">Loading…</p>}

      {/* ── Templates ── */}
      {tab === 'templates' && !isLoading && !error && (
        <div className="grid lg:grid-cols-[18rem_1fr] gap-5">
          {/* List */}
          <div className="space-y-2">
            <button
              onClick={startNewTemplate}
              className={`w-full py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${
                isCreating ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FilePlus2 size={14} /> New template
            </button>
            {templates.map(t => (
              <div
                key={t.id}
                className={`bg-white rounded-xl border p-4 shadow-sm ${
                  selectedId === t.id ? 'border-primary ring-2 ring-primary-light' : 'border-slate-100'
                }`}
              >
                <button onClick={() => select(t)} className="w-full text-left">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-800 text-sm">{t.name}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide ${
                      t.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {t.isActive ? 'Live' : 'Paused'}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 mt-1">{AUDIENCE_LABEL[t.audience]}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                    Days {t.sendAfterDays.join(', ')} · cap {t.dailyCap}/day
                  </p>
                </button>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => toggleActive(t)}
                    className={`flex-1 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors ${
                      t.isActive
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    <Power size={12} /> {t.isActive ? 'Pause' : 'Turn on'}
                  </button>
                  <button
                    onClick={() => removeTemplate(t)}
                    disabled={t.isActive}
                    title={t.isActive ? 'Pause it before deleting' : 'Delete this template'}
                    className="px-3 py-2 rounded-lg bg-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:bg-slate-100"
                    aria-label={`Delete ${t.name}`}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Editor */}
          {draft && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                {isCreating ? (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">New template</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Name</label>
                        <input
                          className={inputCls}
                          value={draft.name}
                          onChange={e => setDraft({ ...draft, name: e.target.value })}
                          placeholder="Welcome back"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          ID (optional)
                        </label>
                        <input
                          className={inputCls}
                          value={draft.key}
                          onChange={e => setDraft({ ...draft, key: e.target.value })}
                          placeholder="derived from the name"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Who it goes to</label>
                      <select
                        className={inputCls}
                        value={draft.audience}
                        onChange={e => setDraft({ ...draft, audience: e.target.value as EmailAudience })}
                      >
                        {(Object.keys(AUDIENCE_LABEL) as EmailAudience[]).map(a => (
                          <option key={a} value={a}>{AUDIENCE_LABEL[a]}</option>
                        ))}
                      </select>
                      <p className="text-[10px] font-bold text-slate-400">
                        Audiences are worked out by the daily job. Pick the group this message is for.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Description</label>
                      <input
                        className={inputCls}
                        value={draft.description ?? ''}
                        onChange={e => setDraft({ ...draft, description: e.target.value })}
                        placeholder="A note to yourself about when this is used"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-semibold text-slate-900">{draft.name}</h4>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">{draft.description}</p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    What the model should write
                  </label>
                  <textarea
                    rows={5}
                    className={`${inputCls} resize-y font-medium`}
                    value={draft.aiPrompt ?? ''}
                    onChange={e => setDraft({ ...draft, aiPrompt: e.target.value })}
                    placeholder="Tone, length, what to mention, what to avoid…"
                  />
                  <p className="text-[10px] font-bold text-slate-400">
                    The model is already told never to invent features, prices or links. This is where you set tone and emphasis.
                  </p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.aiEnabled}
                    onChange={e => setDraft({ ...draft, aiEnabled: e.target.checked })}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-xs font-bold text-slate-600">
                    Use AI. When off — or whenever generation fails — the plain version below is sent instead.
                  </span>
                </label>

                <div className="grid sm:grid-cols-2 gap-4">
                  <ModelPicker
                    provider={draft.provider}
                    model={draft.model}
                    onChange={next => setDraft({ ...draft, ...next })}
                    models={models}
                    modelsError={modelsError}
                    isLoadingModels={isLoadingModels}
                    onRefresh={loadModels}
                  />
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Send on days — {AUDIENCE_TIMING[draft.audience].toLowerCase()}
                    </label>
                    <input
                      className={inputCls}
                      value={draft.sendAfterDays.join(', ')}
                      onChange={e => setDraft({
                        ...draft,
                        sendAfterDays: e.target.value.split(',')
                          .map(s => parseInt(s.trim(), 10)).filter(n => Number.isFinite(n) && n >= 0),
                      })}
                      placeholder="1, 3, 7"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Most per day</label>
                    <input
                      type="number" min={1} max={500}
                      className={inputCls}
                      value={draft.dailyCap}
                      onChange={e => setDraft({ ...draft, dailyCap: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Plain subject (fallback)
                  </label>
                  <input
                    className={inputCls}
                    value={draft.subjectTemplate}
                    onChange={e => setDraft({ ...draft, subjectTemplate: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Plain body (the fallback)
                  </label>
                  <EmailComposer
                    value={draft.bodyTemplate}
                    onChange={h => setDraft({ ...draft, bodyTemplate: h })}
                    placeholders={['{{admin_name}}', '{{org_name}}', '{{app_url}}', '{{trial_end}}']}
                  />
                  <p className="text-[10px] font-bold text-slate-400">
                    Write the message only. The header, footer, spacing and unsubscribe link are added
                    automatically when it sends, so every email looks the same.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    onClick={save}
                    disabled={isSaving}
                    className="px-5 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-primary-hover transition-colors disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
                  </button>
                  <button
                    onClick={() => runPreview('preview')}
                    disabled={isPreviewing || isCreating}
                    className="px-5 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-200 transition-colors disabled:opacity-50"
                  >
                    {isPreviewing ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />} Preview
                  </button>
                  <button
                    onClick={() => runPreview('test-send')}
                    disabled={isPreviewing || isCreating}
                    className="px-5 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-200 transition-colors disabled:opacity-50"
                  >
                    <Send size={14} /> Send test to me
                  </button>
                </div>
              </div>

              {previewError && (
                <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                  <AlertTriangle size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-rose-700">{previewError}</p>
                </div>
              )}

              {preview && (
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-slate-900 text-sm">Preview</h4>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide ${
                      preview.aiUsed ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {preview.aiUsed ? `Written by ${preview.model}` : 'Plain version'}
                    </span>
                    {preview.availableProviders?.length > 0 && (
                      <span className="text-[10px] font-bold text-slate-400">
                        keys configured: {preview.availableProviders.join(', ')}
                      </span>
                    )}
                  </div>

                  {preview.aiError && (
                    <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <AlertTriangle size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold text-amber-800">{preview.aiError}</p>
                        {/* Free models queue behind everyone else on OpenRouter, so
                            a 429 means "try another one", not "something is broken". */}
                        {/429|rate.?limit/i.test(preview.aiError) && (
                          <p className="text-[10px] font-bold text-amber-700">
                            That model is busy upstream, not misconfigured. Pick another from the
                            Model list above and preview again — the template is unchanged until you save.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject</p>
                      <p className="text-sm font-semibold text-slate-800">{preview.subject}</p>
                    </div>
                    {preview.framedHtml ? (
                      // Rendered in an iframe so the email's own styles cannot
                      // leak into the dashboard, and so what is shown is exactly
                      // the document that gets sent.
                      <iframe
                        title="Email preview"
                        srcDoc={preview.framedHtml}
                        className="w-full h-[32rem] border-0 bg-white"
                      />
                    ) : (
                      <div
                        className="p-4 text-sm text-slate-700 max-w-none [&_a]:text-primary [&_p]:mb-2"
                        dangerouslySetInnerHTML={{ __html: preview.html }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Ask AI */}
      {tab === 'ask' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <Database size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-slate-500">
                Ask about your organizations, people and past sends in plain English. The question is turned
                into a read-only query that runs with your own permissions and returns at most 200 rows.
                The query is shown with the answer so you can check it.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                'Which organizations never confirmed their admin email?',
                'Organizations with employees but no attendance, oldest first',
                'Trials ending in the next 7 days',
                'Which addresses are on the suppression list and why?',
              ].map(q => (
                <button
                  key={q}
                  onClick={() => setQuestion(q)}
                  className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-[11px] hover:bg-slate-200 transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <ModelPicker
                provider={askProvider}
                model={askModel}
                onChange={next => { setAskProvider(next.provider); setAskModel(next.model); }}
                models={models}
                modelsError={modelsError}
                isLoadingModels={isLoadingModels}
                onRefresh={loadModels}
              />
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                if (!question.trim() || isAsking) return;
                setIsAsking(true); setAskError(null); setReport(null);
                aiEmailService.askReport(question.trim(), askProvider, askModel)
                  .then(setReport)
                  .catch((err: any) => setAskError(err?.message || 'The report failed'))
                  .finally(() => setIsAsking(false));
              }}
              className="flex gap-2"
            >
              <input
                className={inputCls}
                placeholder="e.g. organizations that registered this month and never added an employee"
                value={question}
                onChange={e => setQuestion(e.target.value)}
              />
              <button
                type="submit"
                disabled={isAsking || !question.trim()}
                className="px-5 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-primary-hover transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {isAsking ? <Loader2 size={14} className="animate-spin" /> : <MessageSquare size={14} />} Ask
              </button>
            </form>
          </div>

          {askError && (
            <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl">
              <AlertTriangle size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-rose-700">{askError}</p>
                {/* Same story as the email preview: a busy free model is normal. */}
                {/429|rate.?limit/i.test(askError) && (
                  <p className="text-[11px] font-bold text-rose-600">
                    That model is queued behind other free users upstream, not misconfigured.
                    Pick another from the Model list above and ask again.
                  </p>
                )}
              </div>
            </div>
          )}

          {report && (
            <div className="space-y-4">
              {report.summary && (
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Answer</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{report.summary}</p>
                </div>
              )}

              <details className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <summary className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer">
                  Query used{report.explanation ? ' — ' + report.explanation : ''}
                </summary>
                <pre className="mt-3 text-[11px] bg-slate-50 rounded-xl p-4 overflow-x-auto text-slate-600 whitespace-pre-wrap">{report.sql}</pre>
              </details>

              {report.queryError && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                  <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-800">The query was refused</p>
                    <p className="text-[11px] font-bold text-amber-700 mt-1">{report.queryError}</p>
                  </div>
                </div>
              )}

              {report.rows.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {report.rowCount} row{report.rowCount === 1 ? '' : 's'}
                    </p>
                    {report.truncated && (
                      <p className="text-[10px] font-bold text-amber-600">Capped at 200 — narrow the question for the full set</p>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50">
                        <tr>
                          {Object.keys(report.rows[0]).map(h => (
                            <th key={h} className="text-left px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                              {h.replace(/_/g, ' ')}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {report.rows.map((r, i) => (
                          <tr key={i} className="border-t border-slate-50">
                            {Object.values(r).map((v, j) => (
                              <td key={j} className="px-4 py-2 text-slate-700 whitespace-nowrap max-w-xs truncate">
                                {v === null || v === undefined ? '—' : String(v)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Sent ── */}
      {tab === 'history' && (
        <div className="space-y-2">
          {sends.length === 0 && (
            <p className="text-center py-12 text-xs font-bold text-slate-400">
              Nothing sent yet. Turning a template on lets the daily job send on its next run.
            </p>
          )}
          {sends.map(s => (
            <div key={s.id} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide ${statusStyle(s.status)}`}>
                  {s.status}
                </span>
                <span className="font-semibold text-slate-800 text-sm truncate">{s.recipientEmail}</span>
                <span className="text-[10px] font-bold text-slate-400">{s.templateKey} · day {s.stage}</span>
                {s.aiUsed && <span className="text-[10px] font-bold text-indigo-600">AI</span>}
              </div>
              <p className="text-[11px] font-bold text-slate-500 mt-1 truncate">{s.subject}</p>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">{new Date(s.created).toLocaleString()}</p>
              {s.error && <p className="text-[10px] font-bold text-rose-600 mt-1">{s.error}</p>}
            </div>
          ))}
        </div>
      )}

      {/* ── Suppressions ── */}
      {tab === 'suppressions' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
            <p className="text-xs font-bold text-slate-500">
              Nobody on this list receives automated email. Unsubscribes land here automatically.
            </p>
            <div className="flex gap-2">
              <input
                className={inputCls}
                placeholder="name@company.com"
                value={newSuppression}
                onChange={e => setNewSuppression(e.target.value)}
              />
              <button
                onClick={async () => {
                  if (!newSuppression.trim()) return;
                  try {
                    await aiEmailService.addSuppression(newSuppression, 'MANUAL');
                    setNewSuppression('');
                    setSuppressions(await aiEmailService.getSuppressions());
                    showToast('Added.', 'success');
                  } catch (e: any) { showToast(e?.message || 'Could not add', 'error'); }
                }}
                className="px-5 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-primary-hover transition-colors whitespace-nowrap"
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          {suppressions.length === 0 && (
            <p className="text-center py-8 text-xs font-bold text-slate-400">Nobody is suppressed.</p>
          )}
          {suppressions.map(s => (
            <div key={s.email} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Ban size={13} className="text-slate-400 flex-shrink-0" />
                  <span className="font-semibold text-slate-800 text-sm truncate">{s.email}</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-wide">
                    {s.reason.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">{new Date(s.created).toLocaleString()}</p>
              </div>
              <button
                onClick={async () => {
                  try {
                    await aiEmailService.removeSuppression(s.email);
                    setSuppressions(await aiEmailService.getSuppressions());
                    showToast('Removed.', 'success');
                  } catch (e: any) { showToast(e?.message || 'Could not remove', 'error'); }
                }}
                className="p-2 text-slate-300 hover:text-rose-500 transition-colors flex-shrink-0"
                aria-label={`Remove ${s.email}`}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Bulk email, moved in from its own top-level tab */}
      {tab === 'bulk' && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <Mail size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-slate-500">
              One-off campaigns you write and send yourself. The automated templates are separate:
              those send on a schedule and stop on unsubscribe.
            </p>
          </div>
          <BulkEmailManager onMessage={m => showToast(m.text, m.type)} />
        </div>
      )}
    </div>
  );
};

export default AIEmail;

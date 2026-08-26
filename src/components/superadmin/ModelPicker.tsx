import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { EmailProvider, OpenRouterModel } from '../../services/aiEmail.service';

const PROVIDERS: EmailProvider[] = ['openrouter', 'deepseek', 'openai', 'anthropic'];

const inputCls =
  'w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-4 focus:ring-primary-light transition-all';

interface Props {
  provider: EmailProvider;
  model: string;
  onChange: (next: { provider: EmailProvider; model: string }) => void;
  /** The live OpenRouter catalogue, loaded once by the parent and shared. */
  models: OpenRouterModel[];
  modelsError: string | null;
  isLoadingModels: boolean;
  onRefresh: () => void;
}

/**
 * Provider and model, as two cells meant to sit inside a two-column grid.
 *
 * Only OpenRouter gets a picker: it is the one provider whose catalogue is
 * public and unauthenticated, so it can be read live. The others keep a plain
 * slug field because listing their models would mean shipping a hardcoded list
 * that goes stale exactly the way the OpenRouter one used to.
 */
const ModelPicker: React.FC<Props> = ({
  provider, model, onChange, models, modelsError, isLoadingModels, onRefresh,
}) => {
  const [freeOnly, setFreeOnly] = useState(true);
  const [manual, setManual] = useState(false);

  const visible = freeOnly ? models.filter(m => m.isFree) : models;
  const free = visible.filter(m => m.isFree);
  const paid = visible.filter(m => !m.isFree);
  const selected = models.find(m => m.id === model) ?? null;

  const usePicker = provider === 'openrouter' && !manual && models.length > 0;

  return (
    <>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Provider</label>
        <select
          className={inputCls}
          value={provider}
          onChange={e => onChange({ provider: e.target.value as EmailProvider, model })}
        >
          {PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2 min-h-[18px]">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Model</label>
          {provider === 'openrouter' && (
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1 cursor-pointer" title="Show only models that cost nothing to run">
                <input
                  type="checkbox"
                  checked={freeOnly}
                  onChange={e => setFreeOnly(e.target.checked)}
                  className="w-3 h-3 accent-primary"
                />
                <span className="text-[10px] font-bold text-slate-500">Free only</span>
              </label>
              <button
                type="button"
                onClick={onRefresh}
                disabled={isLoadingModels}
                title="Refresh the list from OpenRouter"
                className="text-slate-400 hover:text-primary transition-colors disabled:opacity-40"
              >
                <RefreshCw size={11} className={isLoadingModels ? 'animate-spin' : ''} />
              </button>
            </div>
          )}
        </div>

        {usePicker ? (
          <select
            className={inputCls}
            value={model}
            onChange={e => onChange({ provider, model: e.target.value })}
          >
            {/* A slug that is filtered out or withdrawn must still appear, or the
                select would show a different model than the one actually set. */}
            {!visible.some(m => m.id === model) && (
              <option value={model}>
                {model}
                {models.some(m => m.id === model) ? ' — hidden by the free filter' : ' — no longer listed'}
              </option>
            )}
            <optgroup label={`Free (${free.length})`}>
              {free.map(m => (
                <option key={m.id} value={m.id}>
                  {m.id}{m.supportsJson ? '' : ' — no JSON mode'}
                </option>
              ))}
            </optgroup>
            {!freeOnly && (
              <optgroup label={`Paid (${paid.length})`}>
                {paid.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.id}{m.supportsJson ? '' : ' — no JSON mode'}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        ) : (
          <input
            className={inputCls}
            value={model}
            onChange={e => onChange({ provider, model: e.target.value })}
            placeholder="provider/model-slug"
          />
        )}

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {modelsError ? (
            <span className="text-[10px] font-bold text-amber-600">{modelsError}</span>
          ) : selected ? (
            <span className="text-[10px] font-bold text-slate-400">
              {selected.isFree ? 'Free' : 'Paid'} · {Math.round(selected.contextLength / 1000)}k context
              {selected.supportsJson ? '' : ' · no JSON mode, may fail more often'}
            </span>
          ) : null}
          {provider === 'openrouter' && models.length > 0 && (
            <button
              type="button"
              onClick={() => setManual(!manual)}
              className="text-[10px] font-bold text-slate-400 hover:text-primary underline transition-colors"
            >
              {manual ? 'pick from the list' : 'type a slug instead'}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ModelPicker;

import React, { useState, useEffect, useMemo } from 'react';
import {
  RefreshCw, AlertTriangle, Trash2, ShieldAlert, Search,
  ChevronDown, ChevronRight, CheckCircle2, Loader2, X,
} from 'lucide-react';
import { orgHygieneService, OrgHygiene, RiskLevel } from '../../services/orgHygiene.service';
import { useToast } from '../../context/ToastContext';

const riskStyle = (r: RiskLevel) => {
  switch (r) {
    case 'HIGH':   return 'bg-rose-100 text-rose-700';
    case 'MEDIUM': return 'bg-amber-100 text-amber-700';
    case 'LOW':    return 'bg-sky-100 text-sky-700';
    default:       return 'bg-emerald-100 text-emerald-700';
  }
};

const riskBar = (r: RiskLevel) => {
  switch (r) {
    case 'HIGH':   return 'bg-rose-500';
    case 'MEDIUM': return 'bg-amber-500';
    case 'LOW':    return 'bg-sky-500';
    default:       return 'bg-emerald-500';
  }
};

const RISK_ORDER: Record<RiskLevel, number> = { HIGH: 0, MEDIUM: 1, LOW: 2, HEALTHY: 3 };

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString() : '—';

const OrgHygienePanel: React.FC = () => {
  const { showToast } = useToast();
  const [rows, setRows] = useState<OrgHygiene[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | ''>('');

  // Deletion state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setRows(await orgHygieneService.getReport());
      setSelected(new Set());
    } catch (e: any) {
      setError(e?.message || 'Could not load the organization review.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return rows
      .filter(r => !riskFilter || r.risk === riskFilter)
      .filter(r => !needle
        || r.name.toLowerCase().includes(needle)
        || (r.adminEmail ?? '').toLowerCase().includes(needle)
        || (r.country ?? '').toLowerCase().includes(needle))
      .sort((a, b) => RISK_ORDER[a.risk] - RISK_ORDER[b.risk] || b.score - a.score);
  }, [rows, search, riskFilter]);

  const counts = useMemo(() => ({
    total:   rows.length,
    high:    rows.filter(r => r.risk === 'HIGH').length,
    medium:  rows.filter(r => r.risk === 'MEDIUM').length,
    healthy: rows.filter(r => r.risk === 'HEALTHY').length,
  }), [rows]);

  const selectedRows = rows.filter(r => selected.has(r.id));
  const selectedWithData = selectedRows.filter(r => r.hasRealData);

  const toggleRow = (id: string) => setExpanded(p => {
    const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  const toggleSelect = (r: OrgHygiene) => {
    if (r.isDemo) return;
    setSelected(p => {
      const n = new Set(p); n.has(r.id) ? n.delete(r.id) : n.add(r.id); return n;
    });
  };

  const selectAllHighRisk = () => {
    setSelected(new Set(filtered.filter(r => r.risk === 'HIGH' && !r.isDemo && !r.hasRealData).map(r => r.id)));
  };

  const runDelete = async () => {
    setIsDeleting(true);
    setProgress({ done: 0, total: selectedRows.length });
    let ok = 0;
    const failures: string[] = [];

    // Sequential on purpose. Each delete cascades every child row and then
    // removes auth users; firing them in parallel would make a partial failure
    // much harder to reason about afterwards.
    for (let i = 0; i < selectedRows.length; i++) {
      const org = selectedRows[i];
      try {
        const res = await orgHygieneService.deleteOrganization(org.id);
        if (res.success) ok++; else failures.push(`${org.name}: ${res.message}`);
      } catch (e: any) {
        failures.push(`${org.name}: ${e?.message || 'failed'}`);
      }
      setProgress({ done: i + 1, total: selectedRows.length });
    }

    setIsDeleting(false);
    setConfirmOpen(false);
    setConfirmText('');
    setProgress(null);

    if (failures.length) {
      console.error('[OrgHygiene] Deletion failures:', failures);
      showToast(`Deleted ${ok} of ${selectedRows.length}. ${failures.length} failed — see console.`, 'error');
    } else {
      showToast(`Permanently deleted ${ok} organization${ok === 1 ? '' : 's'}.`, 'success');
    }
    load();
  };

  const confirmPhrase = `DELETE ${selectedRows.length}`;
  const canConfirm = confirmText.trim() === confirmPhrase && !isDeleting;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert size={20} className="text-primary" />
            <h3 className="text-xl font-semibold text-slate-900">Organization Review</h3>
          </div>
          <p className="text-xs font-bold text-slate-400 mt-1">
            Signals that separate real customers from signup-form residue. Nothing is deleted automatically.
          </p>
        </div>
        <button
          onClick={load}
          disabled={isLoading}
          className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400 hover:text-primary transition-colors disabled:opacity-50"
          aria-label="Refresh review"
        >
          <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Summary */}
      {!isLoading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {([
            ['Total', counts.total, 'text-slate-800'],
            ['High risk', counts.high, 'text-rose-600'],
            ['Medium', counts.medium, 'text-amber-600'],
            ['Healthy', counts.healthy, 'text-emerald-600'],
          ] as const).map(([label, n, cls]) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
              <p className={`text-2xl font-bold tabular-nums ${cls}`}>{n}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            placeholder="Search by organization, admin email or country"
            className="w-full pl-12 pr-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-primary-light transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs outline-none focus:ring-4 focus:ring-primary-light"
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value as RiskLevel | '')}
          >
            <option value="">All risk levels</option>
            <option value="HIGH">High risk</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
            <option value="HEALTHY">Healthy</option>
          </select>

          <button
            onClick={selectAllHighRisk}
            className="px-4 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs hover:bg-slate-200 transition-colors"
          >
            Select high-risk with no data
          </button>

          {selected.size > 0 && (
            <>
              <button
                onClick={() => setSelected(new Set())}
                className="px-4 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                Clear ({selected.size})
              </button>
              <button
                onClick={() => setConfirmOpen(true)}
                className="px-5 py-3 bg-rose-600 text-white rounded-2xl font-bold text-xs hover:bg-rose-700 transition-colors flex items-center gap-2"
              >
                <Trash2 size={14} /> Delete {selected.size} permanently
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-5 bg-rose-50 border border-rose-100 rounded-2xl">
          <AlertTriangle size={18} className="text-rose-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-bold text-rose-700">{error}</p>
        </div>
      )}

      {isLoading && (
        <p className="text-center py-12 text-xs font-bold text-slate-400 uppercase tracking-widest">Reviewing…</p>
      )}

      {/* Rows */}
      {!isLoading && !error && (
        <div className="space-y-2">
          {filtered.map(r => {
            const isOpen = expanded.has(r.id);
            const isSel = selected.has(r.id);
            return (
              <div
                key={r.id}
                className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-colors ${
                  isSel ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-100'
                }`}
              >
                <div className="p-4 flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isSel}
                    disabled={r.isDemo}
                    onChange={() => toggleSelect(r)}
                    aria-label={`Select ${r.name}`}
                    className="w-4 h-4 accent-rose-600 disabled:opacity-30 flex-shrink-0"
                  />
                  <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${riskBar(r.risk)}`} />

                  <button onClick={() => toggleRow(r.id)} className="min-w-0 flex-1 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-800 text-sm truncate">{r.name || '(unnamed)'}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wide ${riskStyle(r.risk)}`}>
                        {r.risk}
                      </span>
                      {r.isDemo && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[9px] font-bold uppercase tracking-wide">
                          Demo — protected
                        </span>
                      )}
                      {r.hasRealData && !r.isDemo && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-wide">
                          Has real data
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] font-bold text-slate-400">
                      <span>{r.userCount} user{r.userCount === 1 ? '' : 's'}</span>
                      <span className="text-slate-300">|</span>
                      <span>{r.attendanceCount} attendance</span>
                      <span className="text-slate-300">|</span>
                      <span>{r.leaveCount} leave</span>
                      <span className="text-slate-300">|</span>
                      <span>joined {fmtDate(r.created)}</span>
                      {r.adminEmail && (
                        <>
                          <span className="text-slate-300">|</span>
                          <span className="truncate">{r.adminEmail}</span>
                        </>
                      )}
                    </div>
                  </button>

                  <button onClick={() => toggleRow(r.id)} aria-expanded={isOpen} aria-label="Toggle details">
                    {isOpen
                      ? <ChevronDown size={16} className="text-slate-300" />
                      : <ChevronRight size={16} className="text-slate-300" />}
                  </button>
                </div>

                {isOpen && (
                  <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-3">
                    {r.flags.length === 0 ? (
                      <div className="flex items-center gap-2 text-emerald-700">
                        <CheckCircle2 size={14} />
                        <p className="text-xs font-bold">No warnings — this looks like a real, active organization.</p>
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {r.flags.map(f => (
                          <li key={f.code} className="flex items-start gap-2">
                            <AlertTriangle size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-bold text-slate-700">{f.label}</p>
                              <p className="text-[11px] font-medium text-slate-500">{f.detail}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <div><p className="text-slate-700 text-sm normal-case tracking-normal">{r.country || '—'}</p>Country</div>
                      <div><p className="text-slate-700 text-sm normal-case tracking-normal">{r.subscription || '—'}</p>Plan</div>
                      <div><p className="text-slate-700 text-sm normal-case tracking-normal">{fmtDate(r.lastActivity)}</p>Last activity</div>
                      <div><p className="text-slate-700 text-sm normal-case tracking-normal">{r.settingsCount}</p>Settings saved</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <p className="text-center py-12 text-xs font-bold text-slate-400">No organizations match these filters.</p>
          )}
        </div>
      )}

      {/* Confirmation */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <Trash2 size={18} className="text-rose-600" />
                <h4 className="text-lg font-semibold text-slate-900">Delete permanently</h4>
              </div>
              {!isDeleting && (
                <button onClick={() => { setConfirmOpen(false); setConfirmText(''); }} aria-label="Cancel">
                  <X size={18} className="text-slate-400" />
                </button>
              )}
            </div>

            <p className="text-xs font-bold text-slate-500">
              This removes {selectedRows.length} organization{selectedRows.length === 1 ? '' : 's'} and
              everything belonging to them — employees, attendance, leave records and login accounts.
              It cannot be undone. Each deletion is written to the audit trail first.
            </p>

            {selectedWithData.length > 0 && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-rose-600" />
                  <p className="text-xs font-bold text-rose-700">
                    {selectedWithData.length} of these hold real data
                  </p>
                </div>
                <ul className="text-[11px] font-bold text-rose-600 space-y-0.5">
                  {selectedWithData.slice(0, 6).map(o => (
                    <li key={o.id}>
                      {o.name} — {o.userCount} users, {o.attendanceCount} attendance, {o.leaveCount} leave
                    </li>
                  ))}
                  {selectedWithData.length > 6 && <li>…and {selectedWithData.length - 6} more</li>}
                </ul>
              </div>
            )}

            <div className="max-h-40 overflow-y-auto bg-slate-50 rounded-xl p-3">
              <ul className="text-[11px] font-bold text-slate-600 space-y-0.5">
                {selectedRows.map(o => <li key={o.id}>{o.name || '(unnamed)'}</li>)}
              </ul>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-delete" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Type <span className="text-rose-600">{confirmPhrase}</span> to confirm
              </label>
              <input
                id="confirm-delete"
                type="text"
                value={confirmText}
                disabled={isDeleting}
                onChange={e => setConfirmText(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-4 focus:ring-rose-100"
                placeholder={confirmPhrase}
              />
            </div>

            {progress && (
              <p className="text-xs font-bold text-slate-500 tabular-nums">
                Deleting {progress.done} of {progress.total}…
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setConfirmOpen(false); setConfirmText(''); }}
                disabled={isDeleting}
                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={runDelete}
                disabled={!canConfirm}
                className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-rose-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                {isDeleting ? 'Deleting…' : 'Delete permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgHygienePanel;

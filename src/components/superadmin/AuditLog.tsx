import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Search, ShieldCheck, ChevronDown, ChevronRight, AlertCircle } from 'lucide-react';
import { auditService, AuditEntry, AuditAction, AUDITED_TABLES } from '../../services/audit.service';
import { Organization } from '../../types';

interface Props {
  organizations?: Organization[];
}

const actionStyle = (action: AuditAction) => {
  switch (action) {
    case 'INSERT': return 'bg-emerald-100 text-emerald-700';
    case 'DELETE': return 'bg-rose-100 text-rose-700';
    default:       return 'bg-amber-100 text-amber-700';
  }
};

const actionBar = (action: AuditAction) => {
  switch (action) {
    case 'INSERT': return 'bg-emerald-500';
    case 'DELETE': return 'bg-rose-500';
    default:       return 'bg-amber-500';
  }
};

/** Renders a value the way a person reads it, not the way JSON prints it. */
const display = (v: unknown): string => {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'string') return v === '' ? '(empty)' : v;
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
};

const DATE_RANGES = [
  { label: '24 hours', hours: 24 },
  { label: '7 days', hours: 24 * 7 },
  { label: '30 days', hours: 24 * 30 },
  { label: 'All time', hours: 0 },
];

const AuditLog: React.FC<Props> = ({ organizations = [] }) => {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const [search, setSearch] = useState('');
  const [orgFilter, setOrgFilter] = useState('');
  const [tableFilter, setTableFilter] = useState('');
  const [actionFilter, setActionFilter] = useState<AuditAction | ''>('');
  const [rangeHours, setRangeHours] = useState(24 * 7);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const since = rangeHours
        ? new Date(Date.now() - rangeHours * 3600 * 1000).toISOString()
        : undefined;
      const rows = await auditService.getAuditLog({
        organizationId: orgFilter || undefined,
        tableName: tableFilter || undefined,
        action: actionFilter || undefined,
        since,
        search,
        limit: 300,
      });
      setEntries(rows);
    } catch (e: any) {
      setError(e?.message || 'Could not load the audit log.');
    } finally {
      setIsLoading(false);
    }
  }, [orgFilter, tableFilter, actionFilter, rangeHours, search]);

  useEffect(() => { load(); }, [orgFilter, tableFilter, actionFilter, rangeHours]);

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectCls =
    'px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs outline-none focus:ring-4 focus:ring-primary-light transition-all';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-primary" />
            <h3 className="text-xl font-semibold text-slate-900">Audit Trail</h3>
          </div>
          <p className="text-xs font-bold text-slate-400 mt-1">
            Every change to leaves, attendance, profiles, organizations and settings — who, when, and what changed
          </p>
        </div>
        <button
          onClick={load}
          disabled={isLoading}
          className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400 hover:text-primary transition-colors disabled:opacity-50"
          aria-label="Refresh audit log"
        >
          <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        <form
          onSubmit={e => { e.preventDefault(); load(); }}
          className="relative"
        >
          <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            placeholder="Search by person, organization, field or record ID — press Enter"
            className="w-full pl-12 pr-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-primary-light transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </form>

        <div className="flex flex-wrap gap-3">
          {organizations.length > 0 && (
            <select className={selectCls} value={orgFilter} onChange={e => setOrgFilter(e.target.value)}>
              <option value="">All organizations</option>
              {organizations.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          )}

          <select className={selectCls} value={tableFilter} onChange={e => setTableFilter(e.target.value)}>
            <option value="">All records</option>
            {AUDITED_TABLES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <select
            className={selectCls}
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value as AuditAction | '')}
          >
            <option value="">All actions</option>
            <option value="INSERT">Created</option>
            <option value="UPDATE">Changed</option>
            <option value="DELETE">Deleted</option>
          </select>

          <select
            className={selectCls}
            value={rangeHours}
            onChange={e => setRangeHours(Number(e.target.value))}
          >
            {DATE_RANGES.map(r => <option key={r.label} value={r.hours}>{r.label}</option>)}
          </select>
        </div>
      </div>

      {/* Results */}
      {error && (
        <div className="flex items-start gap-3 p-5 bg-rose-50 border border-rose-100 rounded-2xl">
          <AlertCircle size={18} className="text-rose-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-bold text-rose-700">{error}</p>
        </div>
      )}

      {isLoading && (
        <p className="text-center py-12 text-xs font-bold text-slate-400 uppercase tracking-widest">
          Loading…
        </p>
      )}

      {!isLoading && !error && entries.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm space-y-2">
          <p className="text-sm font-semibold text-slate-700">No activity recorded in this period</p>
          <p className="text-xs font-bold text-slate-400">
            The audit trail starts from when it was switched on — it cannot show changes made before that.
          </p>
        </div>
      )}

      {!isLoading && entries.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </p>

          {entries.map(e => {
            const isOpen = expanded.has(e.id);
            return (
              <div key={e.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => toggle(e.id)}
                  aria-expanded={isOpen}
                  className="w-full p-4 flex items-center gap-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${actionBar(e.action)}`} />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-800 text-sm truncate">{e.actorName}</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-wide">
                        {e.actorRole}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wide ${actionStyle(e.action)}`}>
                        {e.action === 'INSERT' ? 'Created' : e.action === 'DELETE' ? 'Deleted' : 'Changed'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">{e.tableName}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-slate-400">
                        {new Date(e.occurredAt).toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold text-slate-300">|</span>
                      <span className="text-[10px] font-bold text-slate-400 truncate">{e.organizationName}</span>
                      {e.changedFields.length > 0 && (
                        <>
                          <span className="text-[10px] font-bold text-slate-300">|</span>
                          <span className="text-[10px] font-bold text-slate-400 truncate">
                            {e.changedFields.join(', ')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {isOpen
                    ? <ChevronDown size={16} className="text-slate-300 flex-shrink-0" />
                    : <ChevronRight size={16} className="text-slate-300 flex-shrink-0" />}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Record {e.recordId}
                    </p>

                    {e.action === 'UPDATE' && e.changedFields.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[30rem] text-xs">
                          <thead>
                            <tr className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                              <th className="text-left py-2 pr-4">Field</th>
                              <th className="text-left py-2 pr-4">Before</th>
                              <th className="text-left py-2">After</th>
                            </tr>
                          </thead>
                          <tbody>
                            {e.changedFields.map(f => (
                              <tr key={f} className="border-t border-slate-50">
                                <td className="py-2 pr-4 font-bold text-slate-500 align-top">{f}</td>
                                <td className="py-2 pr-4 text-rose-600 font-medium align-top break-all">
                                  {display(e.oldData?.[f])}
                                </td>
                                <td className="py-2 text-emerald-700 font-medium align-top break-all">
                                  {display(e.newData?.[f])}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {e.action !== 'UPDATE' && (
                      <pre className="text-[10px] bg-slate-50 rounded-xl p-4 overflow-x-auto text-slate-600">
                        {JSON.stringify(e.action === 'DELETE' ? e.oldData : e.newData, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AuditLog;

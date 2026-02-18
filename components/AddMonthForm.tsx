'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { MonthReport, WeekData, ProviderData, LeadData } from '@/lib/types';
import { labelToId } from '@/lib/utils';

const defaultWeeks: WeekData[] = [
  { label: 'Wk 1', appts: 0, apptGoal: null, bookedRate: 0, bookedRateGoal: null, vvsOver20: 0, availability: 0, sessionTime: '', statesOver7Days: '', contextNote: '' },
  { label: 'Wk 2', appts: 0, apptGoal: null, bookedRate: 0, bookedRateGoal: null, vvsOver20: 0, availability: 0, sessionTime: '', statesOver7Days: '', contextNote: '' },
  { label: 'Wk 3', appts: 0, apptGoal: null, bookedRate: 0, bookedRateGoal: null, vvsOver20: 0, availability: 0, sessionTime: '', statesOver7Days: '', contextNote: '' },
  { label: 'Wk 4', appts: 0, apptGoal: null, bookedRate: 0, bookedRateGoal: null, vvsOver20: 0, availability: 0, sessionTime: '', statesOver7Days: '', contextNote: '' },
];

export function AddMonthForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [label, setLabel] = useState('');
  const [monthApptGoal, setMonthApptGoal] = useState<string>('');
  const [monthBookedRateGoal, setMonthBookedRateGoal] = useState<string>('');
  const [weeks, setWeeks] = useState<WeekData[]>(() =>
    defaultWeeks.map((w) => ({ ...w }))
  );
  const [providers, setProviders] = useState<ProviderData[]>([]);
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [planning, setPlanning] = useState('');
  const [variables, setVariables] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const updateWeek = (index: number, field: keyof WeekData, value: string | number | null) => {
    setWeeks((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addProvider = () => {
    setProviders((prev) => [
      ...prev,
      { name: '', weeks: weeks.map(() => null), notes: '' },
    ]);
  };

  const updateProvider = (index: number, field: 'name' | 'notes', value: string) => {
    setProviders((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const updateProviderWeek = (providerIndex: number, weekIndex: number, value: number | null) => {
    setProviders((prev) => {
      const next = [...prev];
      const w = [...next[providerIndex].weeks];
      w[weekIndex] = value;
      next[providerIndex] = { ...next[providerIndex], weeks: w };
      return next;
    });
  };

  const removeProvider = (index: number) => {
    setProviders((prev) => prev.filter((_, i) => i !== index));
  };

  const addLead = () => {
    setLeads((prev) => [...prev, { name: '', weeks: weeks.map(() => 0) }]);
  };

  const updateLead = (index: number, field: 'name', value: string) => {
    setLeads((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const updateLeadWeek = (leadIndex: number, weekIndex: number, value: number) => {
    setLeads((prev) => {
      const next = [...prev];
      const w = [...next[leadIndex].weeks];
      w[weekIndex] = value;
      next[leadIndex] = { ...next[leadIndex], weeks: w };
      return next;
    });
  };

  const removeLead = (index: number) => {
    setLeads((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setError('');
    if (!label.trim()) {
      setError('Month label is required.');
      return;
    }
    const id = labelToId(label);
    const report: MonthReport = {
      id,
      label: label.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
      weeks,
      providers,
      leads,
      planning,
      variables,
      recommendations,
      monthApptGoal: monthApptGoal === '' ? null : parseInt(monthApptGoal, 10) || null,
      monthBookedRateGoal: monthBookedRateGoal === '' ? null : parseInt(monthBookedRateGoal, 10) || null,
    };
    setSaving(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save report');
      }
      router.push(`/report/${id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save');
      setSaving(false);
    }
  };

  return (
    <div className="card-pad" style={{ maxWidth: 900 }}>
      <div className="section-label">Step {step} of 5</div>

      {step === 1 && (
        <div className="fade-in">
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
              Month label (required)
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. January 2026"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
                Monthly Appt Goal (optional)
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 1100"
                value={monthApptGoal}
                onChange={(e) => setMonthApptGoal(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
                Monthly Booked Rate Goal % (optional)
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 68"
                value={monthBookedRateGoal}
                onChange={(e) => setMonthBookedRateGoal(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="fade-in">
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Week</th>
                  <th className="right">Appts</th>
                  <th className="right">Appt Goal</th>
                  <th className="right">Booked %</th>
                  <th className="right">Booked Goal %</th>
                  <th className="right">VVs &gt;20%</th>
                  <th className="right">Avail</th>
                  <th>Session</th>
                  <th>States &gt;7d</th>
                  <th>Context Note</th>
                </tr>
              </thead>
              <tbody>
                {weeks.map((w, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{w.label}</td>
                    <td>
                      <input
                        type="number"
                        className="form-input"
                        style={{ width: 70 }}
                        value={w.appts || ''}
                        onChange={(e) => updateWeek(i, 'appts', parseInt(e.target.value, 10) || 0)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-input"
                        style={{ width: 70 }}
                        value={w.apptGoal ?? ''}
                        onChange={(e) => updateWeek(i, 'apptGoal', e.target.value === '' ? null : parseInt(e.target.value, 10) ?? null)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-input"
                        style={{ width: 60 }}
                        value={w.bookedRate || ''}
                        onChange={(e) => updateWeek(i, 'bookedRate', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-input"
                        style={{ width: 60 }}
                        value={w.bookedRateGoal ?? ''}
                        onChange={(e) => updateWeek(i, 'bookedRateGoal', e.target.value === '' ? null : parseFloat(e.target.value) || null)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-input"
                        style={{ width: 60 }}
                        value={w.vvsOver20 || ''}
                        onChange={(e) => updateWeek(i, 'vvsOver20', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-input"
                        style={{ width: 50 }}
                        value={w.availability || ''}
                        onChange={(e) => updateWeek(i, 'availability', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: 70 }}
                        placeholder="10:03"
                        value={w.sessionTime}
                        onChange={(e) => updateWeek(i, 'sessionTime', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: 90 }}
                        placeholder="NV, WA"
                        value={w.statesOver7Days}
                        onChange={(e) => updateWeek(i, 'statesOver7Days', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-input"
                        style={{ minWidth: 200 }}
                        placeholder="e.g. Victor OOO, hiring paused"
                        value={w.contextNote}
                        onChange={(e) => updateWeek(i, 'contextNote', e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>Provider utilization (% per week)</span>
            <button type="button" className="btn btn-sm" onClick={addProvider}>
              + Add provider
            </button>
          </div>
          {providers.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 12 }}>No providers yet. Click &quot;+ Add provider&quot; to add one.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Provider</th>
                    {weeks.map((w) => (
                      <th key={w.label} className="right">
                        {w.label}
                      </th>
                    ))}
                    <th>Notes</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {providers.map((p, pi) => (
                    <tr key={pi}>
                      <td>
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: 120 }}
                          placeholder="Name"
                          value={p.name}
                          onChange={(e) => updateProvider(pi, 'name', e.target.value)}
                        />
                      </td>
                      {p.weeks.map((_, wi) => (
                        <td key={wi}>
                          <input
                            type="number"
                            className="form-input"
                            style={{ width: 50 }}
                            value={p.weeks[wi] ?? ''}
                            onChange={(e) => updateProviderWeek(pi, wi, e.target.value === '' ? null : parseInt(e.target.value, 10))}
                          />
                        </td>
                      ))}
                      <td>
                        <input
                          type="text"
                          className="form-input"
                          style={{ minWidth: 140 }}
                          placeholder="Notes"
                          value={p.notes}
                          onChange={(e) => updateProvider(pi, 'notes', e.target.value)}
                        />
                      </td>
                      <td>
                        <button type="button" className="btn btn-sm" onClick={() => removeProvider(pi)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>Lead performance (% per week)</span>
            <button type="button" className="btn btn-sm" onClick={addLead}>
              + Add lead
            </button>
          </div>
          {leads.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 12 }}>No leads yet. Click &quot;+ Add lead&quot; to add one.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Lead</th>
                    {weeks.map((w) => (
                      <th key={w.label} className="right">
                        {w.label}
                      </th>
                    ))}
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l, li) => (
                    <tr key={li}>
                      <td>
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: 120 }}
                          placeholder="Name"
                          value={l.name}
                          onChange={(e) => updateLead(li, 'name', e.target.value)}
                        />
                      </td>
                      {l.weeks.map((_, wi) => (
                        <td key={wi}>
                          <input
                            type="number"
                            className="form-input"
                            style={{ width: 50 }}
                            value={l.weeks[wi] ?? ''}
                            onChange={(e) => updateLeadWeek(li, wi, parseInt(e.target.value, 10) || 0)}
                          />
                        </td>
                      ))}
                      <td>
                        <button type="button" className="btn btn-sm" onClick={() => removeLead(li)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {step === 5 && (
        <div className="fade-in">
          {['Planning', 'Variables', 'Recommendations'].map((title, i) => {
            const key = title.toLowerCase() as 'planning' | 'variables' | 'recommendations';
            const setter = key === 'planning' ? setPlanning : key === 'variables' ? setVariables : setRecommendations;
            const value = key === 'planning' ? planning : key === 'variables' ? variables : recommendations;
            return (
              <div key={key} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--accent)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {title}
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  style={{ resize: 'vertical' }}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={`Enter ${title.toLowerCase()} notes…`}
                />
              </div>
            );
          })}
        </div>
      )}

      {error && (
        <div style={{ color: 'var(--red)', fontSize: 12, marginTop: 12 }}>{error}</div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <div>
          {step > 1 && (
            <button type="button" className="btn" onClick={() => setStep((s) => s - 1)}>
              Back
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {step < 5 ? (
            <button
              type="button"
              className="btn-primary"
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 1 && !label.trim()}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save Report'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

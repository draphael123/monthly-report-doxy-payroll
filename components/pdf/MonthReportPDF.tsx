'use client';

import {
  Document, Page, Text, View, StyleSheet, Font,
} from '@react-pdf/renderer';
import { MonthReport } from '@/lib/types';
import { monthSummary, avg, sum, goalAttainment } from '@/lib/utils';

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    backgroundColor: '#0d1117',
    color: '#e6edf3',
    fontFamily: 'Helvetica',
    fontSize: 9,
    padding: 32,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#30363d',
    paddingBottom: 14,
    marginBottom: 20,
  },
  title: { fontSize: 22, color: '#e6edf3', fontFamily: 'Helvetica-Bold', letterSpacing: -0.5 },
  titleAccent: { color: '#58a6ff' },
  subtitle: { fontSize: 9, color: '#8b949e', marginTop: 3 },
  badge: {
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 8,
    color: '#8b949e',
  },
  // Section labels
  sectionLabel: {
    fontSize: 7,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#8b949e',
    marginBottom: 8,
    marginTop: 18,
  },
  // KPI row
  kpiRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  kpiCard: {
    flex: 1,
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 6,
    padding: 10,
  },
  kpiLabel: { fontSize: 7, color: '#8b949e', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  kpiValue: { fontSize: 16, fontFamily: 'Helvetica-Bold', marginBottom: 3 },
  kpiGoal: { fontSize: 7, color: '#8b949e' },
  // Tables
  table: {
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 6,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1c2128',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#30363d',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#21262d',
  },
  tableRowAlt: { backgroundColor: 'rgba(255,255,255,0.01)' },
  th: { fontSize: 7, color: '#8b949e', textTransform: 'uppercase', letterSpacing: 1 },
  td: { fontSize: 8, color: '#e6edf3' },
  tdMuted: { fontSize: 8, color: '#8b949e' },
  // Pills
  pill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
  },
  // Provider heatmap cell
  dotCell: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3,
    fontSize: 7,
    textAlign: 'center',
    color: '#ffffff',
    fontFamily: 'Helvetica-Bold',
  },
  // Notes
  noteCard: {
    flex: 1,
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 6,
    padding: 10,
  },
  noteLabel: { fontSize: 7, color: '#58a6ff', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  noteLine: { fontSize: 7, color: '#8b949e', marginBottom: 3 },
  // Week context note
  contextNote: {
    backgroundColor: 'rgba(88,166,255,0.08)',
    borderLeftWidth: 2,
    borderLeftColor: '#58a6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 3,
    borderRadius: 2,
  },
  contextNoteText: { fontSize: 7, color: '#8b949e', fontStyle: 'italic' },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 32,
    right: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#30363d',
    paddingTop: 8,
  },
  footerText: { fontSize: 7, color: '#8b949e' },
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function dotBgPdf(v: number | null): string {
  if (v === null) return '#21262d';
  if (v >= 70) return 'rgba(63,185,80,0.6)';
  if (v >= 50) return 'rgba(227,179,65,0.5)';
  return 'rgba(247,129,102,0.5)';
}

function pillBg(v: number): string {
  if (v >= 70) return 'rgba(63,185,80,0.2)';
  if (v >= 50) return 'rgba(227,179,65,0.2)';
  return 'rgba(247,129,102,0.2)';
}

function pillCol(v: number): string {
  if (v >= 70) return '#3fb950';
  if (v >= 50) return '#e3b341';
  return '#f78166';
}

function attainmentBadge(actual: number, goal: number | null, higherIsBetter = true) {
  if (!goal) return null;
  const att = goalAttainment(actual, goal, higherIsBetter);
  if (!att) return null;
  const color = att.status === 'met' ? '#3fb950' : att.status === 'close' ? '#e3b341' : '#f78166';
  const bg    = att.status === 'met' ? 'rgba(63,185,80,0.15)' : att.status === 'close' ? 'rgba(227,179,65,0.15)' : 'rgba(247,129,102,0.15)';
  return (
    <View style={[s.pill, { backgroundColor: bg }]}>
      <Text style={{ color, fontSize: 7, fontFamily: 'Helvetica-Bold' }}>
        {att.status === 'met' ? '✓ ' : att.status === 'close' ? '~ ' : '✗ '}{att.pct}% of goal
      </Text>
    </View>
  );
}

// ─── PDF Document ─────────────────────────────────────────────────────────────
export function MonthReportPDF({ report }: { report: MonthReport }) {
  const summary = monthSummary(report);
  const totalApptGoal = report.weeks.reduce((sum, w) => sum + (w.apptGoal ?? 0), 0) || report.monthApptGoal || null;

  return (
    <Document>
      {/* ── Page 1: Summary + KPIs + Weekly table ── */}
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.title}>
              Fountain <Text style={s.titleAccent}>Vitality</Text>
            </Text>
            <Text style={{ ...s.title, fontSize: 14, fontFamily: 'Helvetica', marginTop: 2 }}>
              {report.label} — Clinical Operations Report
            </Text>
            <Text style={s.subtitle}>Generated {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
          </View>
          <View style={s.badge}>
            <Text>HRT · TRT · GLP-1</Text>
          </View>
        </View>

        {/* Monthly KPI Summary */}
        <Text style={s.sectionLabel}>Monthly Summary</Text>
        <View style={s.kpiRow}>
          {[
            { label: 'Total Appts',     val: Number(summary.appts).toLocaleString(), goal: totalApptGoal,            actual: summary.appts,         color: '#58a6ff', higher: true  },
            { label: 'Avg Booked Rate', val: `${summary.booked}%`,                  goal: report.monthBookedRateGoal, actual: parseFloat(summary.booked), color: '#3fb950', higher: true  },
            { label: 'Avg VV >20 Min',  val: `${summary.vvs}%`,                     goal: null,                      actual: parseFloat(summary.vvs),    color: '#f78166', higher: false },
            { label: 'Avg Availability',val: `${summary.avail}d`,                   goal: null,                      actual: parseFloat(summary.avail),  color: '#e3b341', higher: false },
          ].map(({ label, val, goal, actual, color, higher }) => (
            <View key={label} style={[s.kpiCard, { borderTopWidth: 2, borderTopColor: color }]}>
              <Text style={s.kpiLabel}>{label}</Text>
              <Text style={[s.kpiValue, { color }]}>{val}</Text>
              {goal !== null && (
                <Text style={s.kpiGoal}>
                  Goal: {typeof goal === 'number' && goal > 100 ? goal.toLocaleString() : `${goal}%`}
                  {' · '}{goalAttainment(Number(actual), goal, higher)?.pct ?? '—'}% attained
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Week-by-Week KPI Table */}
        <Text style={s.sectionLabel}>Week-by-Week Performance</Text>
        <View style={s.table}>
          <View style={s.tableHeader}>
            {['Week', 'Appts', 'Goal', 'Att.', 'Booked %', 'VV >20%', 'Avail (d)', 'Session', 'States >7d'].map((h, i) => (
              <Text key={h} style={[s.th, { flex: i === 0 ? 1 : i === 8 ? 1.2 : 0.7 }]}>{h}</Text>
            ))}
          </View>
          {report.weeks.map((w, i) => {
            const att = goalAttainment(w.appts, w.apptGoal, true);
            return (
              <View key={i}>
                <View style={[s.tableRow, i % 2 !== 0 ? s.tableRowAlt : {}]}>
                  <Text style={[s.td, { flex: 1, fontFamily: 'Helvetica-Bold' }]}>{w.label}</Text>
                  <Text style={[s.td, { flex: 0.7 }]}>{w.appts.toLocaleString()}</Text>
                  <Text style={[s.tdMuted, { flex: 0.7 }]}>{w.apptGoal ? w.apptGoal.toLocaleString() : '—'}</Text>
                  <Text style={[s.td, { flex: 0.7, color: att ? (att.status === 'met' ? '#3fb950' : att.status === 'close' ? '#e3b341' : '#f78166') : '#8b949e' }]}>
                    {att ? `${att.pct}%` : '—'}
                  </Text>
                  <Text style={[s.td, { flex: 0.7 }]}>{w.bookedRate}%</Text>
                  <Text style={[s.td, { flex: 0.7, color: w.vvsOver20 > 8 ? '#f78166' : w.vvsOver20 > 5 ? '#e3b341' : '#3fb950' }]}>{w.vvsOver20}%</Text>
                  <Text style={[s.td, { flex: 0.7, color: w.availability <= 2 ? '#3fb950' : w.availability <= 3 ? '#e3b341' : '#f78166' }]}>{w.availability}</Text>
                  <Text style={[s.td, { flex: 0.7 }]}>{w.sessionTime}</Text>
                  <Text style={[s.td, { flex: 1.2, color: w.statesOver7Days === 'None' ? '#3fb950' : '#f78166' }]}>{w.statesOver7Days}</Text>
                </View>
                {w.contextNote && (
                  <View style={[s.contextNote, { marginHorizontal: 10, marginBottom: 4 }]}>
                    <Text style={s.contextNoteText}>{w.contextNote}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Notes row */}
        <Text style={s.sectionLabel}>Notes</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {[
            { label: 'Planning',        content: report.planning },
            { label: 'Variables',       content: report.variables },
            { label: 'Recommendations', content: report.recommendations },
          ].map(({ label, content }) => (
            <View key={label} style={s.noteCard}>
              <Text style={s.noteLabel}>{label}</Text>
              {(content ?? '').split('\n').filter(Boolean).map((line, i) => (
                <Text key={i} style={s.noteLine}>— {line}</Text>
              ))}
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>Fountain Vitality · Clinical Operations · {report.label}</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>

      {/* ── Page 2: Provider Utilization ── */}
      <Page size="A4" style={s.page}>
        <Text style={[s.sectionLabel, { marginTop: 0 }]}>Provider Schedule Utilization — % of Schedule Booked</Text>

        {/* Legend */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 10 }}>
          {[['≥70% — On Target', '#3fb950'], ['50–69% — Monitor', '#e3b341'], ['<50% — Needs Attention', '#f78166'], ['— OOO / No Data', '#8b949e']].map(([l, c]) => (
            <View key={l} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: c }} />
              <Text style={{ fontSize: 7, color: '#8b949e' }}>{l}</Text>
            </View>
          ))}
        </View>

        <View style={s.table}>
          <View style={s.tableHeader}>
            <Text style={[s.th, { flex: 1.6 }]}>Provider</Text>
            {report.weeks.map(w => <Text key={w.label} style={[s.th, { flex: 0.7, textAlign: 'center' }]}>{w.label}</Text>)}
            <Text style={[s.th, { flex: 0.7, textAlign: 'center' }]}>Avg</Text>
            <Text style={[s.th, { flex: 2 }]}>Notes</Text>
          </View>
          {report.providers.map((p, i) => {
            const valid = p.weeks.filter((v): v is number => v !== null);
            const provAvg = valid.length > 0 ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : null;
            return (
              <View key={p.name} style={[s.tableRow, i % 2 !== 0 ? s.tableRowAlt : {}]}>
                <Text style={[s.td, { flex: 1.6, fontFamily: 'Helvetica-Bold' }]}>{p.name}</Text>
                {p.weeks.map((v, wi) => (
                  <View key={wi} style={{ flex: 0.7, alignItems: 'center' }}>
                    <View style={[s.dotCell, { backgroundColor: dotBgPdf(v), width: 34 }]}>
                      <Text style={{ fontSize: 7, color: '#fff', textAlign: 'center' }}>{v !== null ? `${v}%` : '—'}</Text>
                    </View>
                  </View>
                ))}
                <View style={{ flex: 0.7, alignItems: 'center' }}>
                  <View style={[s.dotCell, { backgroundColor: provAvg !== null ? dotBgPdf(provAvg) : '#21262d', width: 34 }]}>
                    <Text style={{ fontSize: 7, color: '#fff', textAlign: 'center', fontFamily: 'Helvetica-Bold' }}>
                      {provAvg !== null ? `${provAvg}%` : '—'}
                    </Text>
                  </View>
                </View>
                <Text style={[s.tdMuted, { flex: 2, fontSize: 7, fontStyle: 'italic' }]}>{p.notes}</Text>
              </View>
            );
          })}
        </View>

        {/* Leads */}
        {report.leads?.length > 0 && (
          <>
            <Text style={s.sectionLabel}>Lead Performance</Text>
            <View style={s.table}>
              <View style={s.tableHeader}>
                <Text style={[s.th, { flex: 1.4 }]}>Lead</Text>
                {report.weeks.map(w => <Text key={w.label} style={[s.th, { flex: 0.8, textAlign: 'center' }]}>{w.label}</Text>)}
                <Text style={[s.th, { flex: 0.8, textAlign: 'center' }]}>Avg</Text>
              </View>
              {report.leads.map((l, i) => {
                const leadAvg = Math.round(l.weeks.reduce((a, b) => a + b, 0) / l.weeks.length);
                return (
                  <View key={l.name} style={[s.tableRow, i % 2 !== 0 ? s.tableRowAlt : {}]}>
                    <Text style={[s.td, { flex: 1.4, fontFamily: 'Helvetica-Bold' }]}>{l.name}</Text>
                    {l.weeks.map((v, wi) => (
                      <View key={wi} style={{ flex: 0.8, alignItems: 'center' }}>
                        <View style={[s.pill, { backgroundColor: pillBg(v) }]}>
                          <Text style={{ color: pillCol(v), fontSize: 7, fontFamily: 'Helvetica-Bold' }}>{v}%</Text>
                        </View>
                      </View>
                    ))}
                    <Text style={[s.td, { flex: 0.8, textAlign: 'center', color: '#8b949e' }]}>{leadAvg}%</Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>Fountain Vitality · Clinical Operations · {report.label}</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}

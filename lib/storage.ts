import fs from 'fs';
import path from 'path';
import { MonthReport, ReportsStore } from './types';

const DATA_PATH = path.join(process.cwd(), 'data', 'reports.json');

// ─── January 2026 Seed Data ──────────────────────────────────────────────────
const JAN_2026_SEED: MonthReport = {
  id: '2026-01',
  label: 'January 2026',
  createdAt: '2026-01-31',
  monthApptGoal: 1100,
  monthBookedRateGoal: 68,
  weeks: [
    {
      label: 'Wk 1', appts: 731,  apptGoal: null, bookedRate: 66.5, bookedRateGoal: null,
      vvsOver20: 8.73, availability: 3.2, sessionTime: '10:03', statesOver7Days: 'NV, WA',
      contextNote: 'Victor & DeAnna OOO. Hiring paused. Cross-training HRT/TRT underway (Skye, Ashley E, Michelle F).',
    },
    {
      label: 'Wk 2', appts: 1075, apptGoal: null, bookedRate: 65.0, bookedRateGoal: null,
      vvsOver20: 6.88, availability: 1.8, sessionTime: '9:43',  statesOver7Days: 'None',
      contextNote: 'Terray OOO Wed–Monday. HRT Follow-up 20-min VV launched 1/12–1/13.',
    },
    {
      label: 'Wk 3', appts: 1017, apptGoal: 1100, bookedRate: 61.0, bookedRateGoal: null,
      vvsOver20: 8.74, availability: 1.6, sessionTime: '9:58',  statesOver7Days: 'None',
      contextNote: 'Rachel Razi OOO 1/21–2/2. All VVs now 20 minutes.',
    },
    {
      label: 'Wk 4', appts: 1012, apptGoal: 1100, bookedRate: 61.0, bookedRateGoal: null,
      vvsOver20: 3.80, availability: 1.3, sessionTime: '8:50',  statesOver7Days: 'None',
      contextNote: 'Rachel OOO, Bill OOO, Martin OOO M–TH. VVs over 20 min dropped to 3.8% — best week.',
    },
  ],
  providers: [
    { name: 'Victor',         weeks: [null, 78, 74, 74], notes: 'OOO Wk 1' },
    { name: 'Tim',            weeks: [81,   74, 75, 75], notes: '' },
    { name: 'DeAnna',         weeks: [null, 74, 60, 78], notes: 'OOO Wk 1' },
    { name: 'Catherine',      weeks: [91,   71, 72, 58], notes: '' },
    { name: 'Liz',            weeks: [77,   71, 70, 77], notes: '' },
    { name: 'Ashley E',       weeks: [80,   66, 71, 71], notes: 'HRT shadowing → completed' },
    { name: 'Rachel Razi',    weeks: [75,   72, 70, 63], notes: 'OOO 1/21–2/2' },
    { name: 'Bryce',          weeks: [77,   68, 61, 66], notes: '' },
    { name: 'Martin',         weeks: [76,   66, 71, 63], notes: 'OOO Wk 4 M–TH' },
    { name: 'Vivien',         weeks: [75,   68, 65, 68], notes: '' },
    { name: 'Megan RR',       weeks: [55,   67, 68, 69], notes: '' },
    { name: 'Ashley Grout',   weeks: [81,   66, 59, 62], notes: '' },
    { name: 'Danielle Board', weeks: [86,   61, 57, 68], notes: '' },
    { name: 'Priya',          weeks: [59,   70, 61, 72], notes: '' },
    { name: 'Jacquelyn',      weeks: [67,   60, 46, 31], notes: 'Async visits + TRT training (Wk 4)' },
    { name: 'Skye',           weeks: [45,   56, 61, 37], notes: 'HRT shadowing in progress' },
    { name: 'Bryana',         weeks: [44,   53, 44, 39], notes: 'Hybrid – Async + VV' },
    { name: 'Alexis',         weeks: [36,   37, 50, 44], notes: 'HRT follow-up shadowing → completed; licensing' },
    { name: 'Michele F',      weeks: [26,   25, 27, 54], notes: 'TRT shadowing → completed; licensing' },
  ],
  leads: [
    { name: 'Terray', weeks: [51, 48, 44, 40] },
    { name: 'Bill',   weeks: [48, 47, 41, 23] },
    { name: 'Summer', weeks: [54, 25, 19, 21] },
  ],
  planning: 'Hiring MD for TN/TX follow-up patients',
  variables: 'Rachel Razi OOO 1/21-2/2\nBill OOO Wk 4\nMartin OOO Wk 4 M-TH\nTerray OOO Wk 2 Wed-Monday\nVictor & DeAnna OOO Wk 1',
  recommendations: 'All VVs are now 20 minutes\nHRT Follow-up 20-min VV launched 1/12-1/13\nGoal: improve Alexis & Michele F schedules\nAlexis & Michele working on licensing (will no longer see TX TRT once new MD hired)',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function ensureDataFile(): void {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_PATH)) {
    const seed: ReportsStore = { reports: [JAN_2026_SEED] };
    fs.writeFileSync(DATA_PATH, JSON.stringify(seed, null, 2));
  }
}

export function getAllReports(): MonthReport[] {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  const store: ReportsStore = JSON.parse(raw);
  return (store.reports ?? []).sort((a, b) => a.id.localeCompare(b.id));
}

export function getReport(id: string): MonthReport | null {
  return getAllReports().find(r => r.id === id) ?? null;
}

export function saveReport(report: MonthReport): void {
  ensureDataFile();
  const reports = getAllReports();
  const idx = reports.findIndex(r => r.id === report.id);
  if (idx >= 0) {
    reports[idx] = report;
  } else {
    reports.push(report);
  }
  fs.writeFileSync(DATA_PATH, JSON.stringify({ reports }, null, 2));
}

export function deleteReport(id: string): void {
  ensureDataFile();
  const reports = getAllReports().filter(r => r.id !== id);
  fs.writeFileSync(DATA_PATH, JSON.stringify({ reports }, null, 2));
}

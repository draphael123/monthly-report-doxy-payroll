# Fountain Vitality — Clinical Operations Dashboard
## Cursor / Claude Build Prompt  ·  v2

---

## Overview

Build a full-stack **Next.js 14** web application for Fountain Vitality's Clinical Operations team. The app is a monthly reporting dashboard that stores weekly provider performance data month-over-month in a persistent JSON file database. No external database required — data is stored in `data/reports.json` on the server.

**New in v2:** Goal tracking (vs. actual), per-week context notes, and PDF export.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **PDF Export**: `@react-pdf/renderer`
- **Fonts**: DM Mono + Fraunces (Google Fonts)
- **Persistence**: JSON file via Node.js `fs` module (server-side API routes)
- **Package manager**: npm

---

## Project Structure

```
fountain-vitality/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                      # Dashboard: month cards + MoM trend charts
│   ├── report/[id]/page.tsx          # Month detail view
│   ├── add/page.tsx                  # 5-step wizard to post a new report
│   └── globals.css
├── components/
│   ├── Nav.tsx
│   ├── MonthCard.tsx
│   ├── KpiCards.tsx
│   ├── WeeklyTable.tsx               # Includes goal columns + context notes
│   ├── ProviderTable.tsx
│   ├── LeadsTable.tsx
│   ├── NotesSection.tsx
│   ├── TrendCharts.tsx
│   ├── GoalAttainmentBar.tsx         # NEW
│   ├── AddMonthForm.tsx
│   └── pdf/
│       └── MonthReportPDF.tsx        # NEW: @react-pdf/renderer template
├── lib/
│   ├── types.ts
│   ├── storage.ts
│   └── utils.ts
├── app/api/
│   ├── reports/route.ts
│   ├── reports/[id]/route.ts
│   └── reports/export/[id]/route.ts  # NEW: PDF generation endpoint
├── data/
│   └── reports.json
└── public/
```

---

## Data Model (`lib/types.ts`)

All interfaces are already written in the provided `lib/types.ts`. Key additions in v2:

### WeekData
```typescript
export interface WeekData {
  label: string;
  appts: number;
  apptGoal: number | null;        // weekly appointment target
  bookedRate: number;
  bookedRateGoal: number | null;  // weekly booked rate target %
  vvsOver20: number;
  availability: number;
  sessionTime: string;
  statesOver7Days: string;
  contextNote: string;            // free-text note specific to this week
}
```

### MonthReport
```typescript
export interface MonthReport {
  id: string;
  label: string;
  createdAt: string;
  weeks: WeekData[];
  providers: ProviderData[];
  leads: LeadData[];
  planning: string;
  variables: string;
  recommendations: string;
  monthApptGoal: number | null;
  monthBookedRateGoal: number | null;
}
```

---

## Persistence Layer

Already fully implemented in the provided `lib/storage.ts`. January 2026 is pre-seeded with context notes and goals.

---

## API Routes

### Existing
- `GET /api/reports` — all reports
- `POST /api/reports` — save report
- `GET /api/reports/[id]` — single report
- `DELETE /api/reports/[id]` — delete report

### NEW: PDF Export
- `GET /api/reports/export/[id]` — streams a PDF download

The export route is already written in `app/api/reports/export/[id]/route.ts`.

---

## Pages

### Dashboard — `app/page.tsx`
Same as v1, plus:
- KPI cards show goal attainment % when a monthly goal is set
- Use `GoalAttainmentBar` under the appts and booked rate KPI cards

### Month Detail — `app/report/[id]/page.tsx`
Same as v1, plus:
- **"↓ Export PDF" button** in the page header (right side, next to Back button)
  - `onClick={() => window.open('/api/reports/export/' + report.id, '_blank')}`
- Weekly table now has Goal columns and attainment pills
- **Per-week context note** shown as indented italic sub-row beneath each week row that has a `contextNote` (blue left border, subtle blue background)

### Add Report — `app/add/page.tsx`

**Step 1 — Month Info** (updated):
- Month label (required)
- Monthly Appt Goal (optional number input)
- Monthly Booked Rate Goal (optional number input)

**Step 2 — Weekly KPIs** (updated):
Columns: Week | Appts | **Appt Goal** | Booked % | **Booked Goal %** | VVs >20% | Availability | Session | States >7d | **Context Note**

Context Note: wider text input (min-width 200px), free text like "Victor OOO, hiring paused".

Steps 3–5 unchanged.

---

## NEW: GoalAttainmentBar component

`components/GoalAttainmentBar.tsx`

Props: `{ actual: number; goal: number | null; label: string; higherIsBetter?: boolean }`

- Gray track bar with colored fill (green ≥100%, yellow ≥90%, red <90%)
- Animate fill width on mount (CSS transition)
- Shows "X / Y goal — Z% attained" beneath
- Only renders when goal is not null

---

## NEW: MonthReportPDF (`components/pdf/MonthReportPDF.tsx`)

Already fully written. Two-page PDF:
- **Page 1**: Header, KPI cards with goal attainment, week-by-week table with goals + attainment + context notes inline, planning/variables/recommendations notes
- **Page 2**: Provider utilization heatmap table, lead performance table
- Both pages: "Fountain Vitality · Clinical Operations · [Month]" footer with page numbers

**Critical**: Only import in API routes (server-side). Client triggers download via `window.open()`.

---

## Goal Attainment Logic

Already in `lib/utils.ts`:

```typescript
goalAttainment(actual, goal, higherIsBetter)
// returns { pct: number; status: 'met' | 'close' | 'missed' } | null

attainmentColor(status) // hex color
attainmentBg(status)    // same at 15% opacity
```

Status thresholds: met ≥100%, close ≥90%, missed <90%.

Direction: Appts + Booked Rate = higher is better. VVs + Availability = lower is better.

---

## Per-Week Context Notes — UI Detail

Sub-row style under each week row in the detail table:
- Spans full width, blue left border (2px, `--accent`)
- Background: `rgba(88,166,255,0.06)`
- 11px italic `--muted` text with a 💬 icon prefix
- Padding: 6px 16px 6px 28px
- Only shown when `contextNote` is non-empty

---

## Design System (unchanged from v1)

```css
:root {
  --bg: #0d1117; --surface: #161b22; --surface2: #1c2128;
  --border: #30363d; --accent: #58a6ff;
  --green: #3fb950; --yellow: #e3b341; --red: #f78166;
  --purple: #d2a8ff; --text: #e6edf3; --muted: #8b949e;
}
```
Typography: Fraunces (display) + DM Mono (body/data).

---

## Setup

```bash
cd fountain-vitality
npm install
npm run dev
```

Open `http://localhost:3000`. January 2026 pre-loaded with goals and context notes.

---

## Important Notes

1. `lib/storage.ts` and PDF components are server-only — never import in client components.
2. PDF download = `window.open('/api/reports/export/' + id)` from client.
3. All goal fields are optional — hide goal UI gracefully when not set.
4. Backward compatibility: treat missing fields (`apptGoal`, `contextNote`, etc.) as `null` / `""`.
5. `data/reports.json` is gitignored; `data/.gitkeep` keeps the directory.

---

## Glossary

- **Booked Rate**: % of provider schedule filled with patients
- **VVs Over 20 Min**: % of video visits exceeding 20-minute target
- **HRT/TRT Availability**: Avg days until next available appointment
- **States >7 Days**: States where patient wait exceeds 7 days
- **Goal Attainment**: Actual as % of target (green ≥100%, yellow ≥90%, red <90%)
- **Context Note**: Week-specific annotation (OOO, policy changes, volume anomalies)

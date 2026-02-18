export interface WeekData {
  label: string;
  appts: number;
  apptGoal: number | null;        // target appointment count for this week
  bookedRate: number;
  bookedRateGoal: number | null;  // target booked rate % for this week
  vvsOver20: number;
  availability: number;
  sessionTime: string;
  statesOver7Days: string;
  contextNote: string;            // free-text note for this specific week (OOO, events, etc.)
}

export interface ProviderData {
  name: string;
  weeks: (number | null)[];
  notes: string;
}

export interface LeadData {
  name: string;
  weeks: number[];
}

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
  monthApptGoal: number | null;       // overall monthly appointment goal
  monthBookedRateGoal: number | null; // overall monthly booked rate goal %
}

export interface ReportsStore {
  reports: MonthReport[];
}

export interface MonthSummary {
  appts: number;
  booked: string;
  vvs: string;
  avail: string;
}

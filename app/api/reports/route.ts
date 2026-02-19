import { NextRequest, NextResponse } from 'next/server';
import { getAllReports, saveReport } from '@/lib/storage';
import { MonthReport } from '@/lib/types';

export async function GET() {
  try {
    const reports = await getAllReports();
    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error loading reports:', error);
    // Return empty array instead of error object to match expected format
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const report: MonthReport = await request.json();
    if (!report.id || !report.label) {
      return NextResponse.json({ error: 'Missing required fields: id, label' }, { status: 400 });
    }
    await saveReport(report);
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Error saving report:', error);
    return NextResponse.json({ error: 'Failed to save report' }, { status: 500 });
  }
}

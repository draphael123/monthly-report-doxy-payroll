import { NextRequest, NextResponse } from 'next/server';
import { getReport } from '@/lib/storage';
import { monthSummary } from '@/lib/utils';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const report = await getReport(params.id);
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const summary = monthSummary(report);
    
    // Build CSV content
    const rows: string[] = [];
    
    // Header
    rows.push('Fountain Vitality - Monthly Report');
    rows.push(`Month: ${report.label}`);
    rows.push(`Created: ${report.createdAt}`);
    rows.push('');
    
    // Summary
    rows.push('Monthly Summary');
    rows.push(`Total Appointments,${summary.appts}`);
    rows.push(`Average Booked Rate,${summary.booked}%`);
    rows.push(`Average VV >20 Min,${summary.vvs}%`);
    rows.push(`Average Availability,${summary.avail} days`);
    rows.push('');
    
    // Weekly Data
    rows.push('Week-by-Week Performance');
    rows.push('Week,Appointments,Appt Goal,Booked Rate,Booked Goal,VV >20%,Availability,Session Time,States >7d,Context Note');
    report.weeks.forEach((week) => {
      rows.push([
        week.label,
        week.appts.toString(),
        week.apptGoal?.toString() || '',
        `${week.bookedRate}%`,
        week.bookedRateGoal?.toString() || '',
        `${week.vvsOver20}%`,
        week.availability.toString(),
        week.sessionTime,
        week.statesOver7Days,
        `"${week.contextNote.replace(/"/g, '""')}"`, // Escape quotes in CSV
      ].join(','));
    });
    rows.push('');
    
    // Provider Data
    rows.push('Provider Utilization (% of Schedule Booked)');
    const weekHeaders = report.weeks.map(w => w.label).join(',');
    rows.push(`Provider,${weekHeaders},Average,Notes`);
    report.providers.forEach((provider) => {
      const validWeeks = provider.weeks.filter((w): w is number => w !== null);
      const avg = validWeeks.length > 0
        ? Math.round(validWeeks.reduce((a, b) => a + b, 0) / validWeeks.length)
        : '';
      const weekValues = provider.weeks.map(w => w?.toString() || '').join(',');
      rows.push([
        provider.name,
        weekValues,
        avg.toString(),
        `"${provider.notes.replace(/"/g, '""')}"`,
      ].join(','));
    });
    rows.push('');
    
    // Lead Data
    if (report.leads.length > 0) {
      rows.push('Lead Performance');
      rows.push(`Lead,${weekHeaders}`);
      report.leads.forEach((lead) => {
        rows.push([
          lead.name,
          lead.weeks.join(','),
        ].join(','));
      });
      rows.push('');
    }
    
    // Notes
    rows.push('Notes');
    rows.push('Planning');
    rows.push(`"${report.planning.replace(/"/g, '""')}"`);
    rows.push('');
    rows.push('Variables');
    rows.push(`"${report.variables.replace(/"/g, '""')}"`);
    rows.push('');
    rows.push('Recommendations');
    rows.push(`"${report.recommendations.replace(/"/g, '""')}"`);
    
    const csvContent = rows.join('\n');
    const filename = `fountain-vitality-${report.id}.csv`;
    
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('CSV export error:', error);
    return NextResponse.json({ error: 'Failed to generate CSV' }, { status: 500 });
  }
}


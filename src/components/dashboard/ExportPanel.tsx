'use client';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Download, FileText} from 'lucide-react';
import type {VisibilityAnalysisData} from '@/lib/api/types';

interface ExportPanelProps {
  data: VisibilityAnalysisData;
  companyName: string;
}

export function ExportPanel({data, companyName}: ExportPanelProps) {
  const handleDownloadCSV = () => {
    // Convert data to CSV format
    const headers = ['Query', 'Model', 'Mentioned', 'Rank'];
    const rows = data.batch_results.flatMap((batch) =>
      Object.entries(batch.by_model).map(([model, breakdown]) => [
        `Batch ${batch.batch_num}`,
        model,
        breakdown.mentions > 0 ? 'Yes' : 'No',
        breakdown.mention_rate,
      ])
    );

    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join(
      '\n'
    );

    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `visibility-report-${companyName.toLowerCase().replace(/\s+/g, '-')}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    alert('PDF download functionality coming soon!');
  };

  return (
    <Card className='bg-card border-border animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <CardHeader>
        <CardTitle className='text-foreground'>Export Reports</CardTitle>
        <p className='text-sm text-muted-foreground'>
          Download your visibility analysis
        </p>
      </CardHeader>
      <CardContent className='space-y-3'>
        <Button
          onClick={handleDownloadPDF}
          className='w-full bg-primary hover:bg-orange-600 text-black font-semibold justify-start'
          size='lg'>
          <FileText className='mr-2 h-5 w-5' />
          Download Full Report (PDF)
        </Button>
        <Button
          onClick={handleDownloadCSV}
          variant='outline'
          className='w-full bg-muted border-zinc-700 text-foreground hover:bg-muted justify-start'
          size='lg'>
          <Download className='mr-2 h-5 w-5' />
          Export Query Log (CSV)
        </Button>
      </CardContent>
    </Card>
  );
}

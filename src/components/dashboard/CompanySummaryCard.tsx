'use client';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Building2, Users} from 'lucide-react';
import type {CompanyAnalysisData} from '@/lib/api/types';

interface CompanySummaryCardProps {
  analysis: CompanyAnalysisData;
  isLoading?: boolean;
}

export function CompanySummaryCard({
  analysis,
  isLoading = false,
}: CompanySummaryCardProps) {
  if (isLoading) {
    return (
      <Card className='bg-card border-border'>
        <CardContent className='p-6'>
          <div className='space-y-3'>
            <div className='h-4 bg-muted rounded animate-pulse' />
            <div className='h-4 bg-muted rounded animate-pulse w-5/6' />
            <div className='h-4 bg-muted rounded animate-pulse w-4/6' />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Company Summary */}
      <Card className='bg-card border-border'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-foreground'>
            <Building2 className='h-5 w-5 text-primary' />
            {analysis.company_name}
          </CardTitle>
          <p className='text-sm text-muted-foreground'>{analysis.industry}</p>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground leading-relaxed'>
            {analysis.company_summary}
          </p>
        </CardContent>
      </Card>

      {/* Competitors */}
      <Card className='bg-card border-border'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-foreground'>
            <Users className='h-5 w-5 text-primary' />
            Competitors ({analysis.competitors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-2'>
            {analysis.competitors.map((competitor, idx) => (
              <span
                key={idx}
                className='px-3 py-1 bg-muted text-foreground text-sm rounded-full border border-border'>
                {competitor}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

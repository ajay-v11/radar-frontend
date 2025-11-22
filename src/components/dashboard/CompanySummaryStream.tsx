'use client';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Building2} from 'lucide-react';

interface CompanySummaryStreamProps {
  summary: string;
  isStreaming: boolean;
  companyName: string;
}

export function CompanySummaryStream({
  summary,
  isStreaming,
  companyName,
}: CompanySummaryStreamProps) {
  return (
    <Card className='sticky top-4 z-20 bg-card border-border shadow-lg'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-foreground'>
          <Building2 className='h-5 w-5 text-primary' />
          {companyName} Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isStreaming && !summary ? (
          <div className='space-y-2'>
            <div className='h-4 bg-muted rounded animate-pulse' />
            <div className='h-4 bg-muted rounded animate-pulse w-5/6' />
            <div className='h-4 bg-muted rounded animate-pulse w-4/6' />
          </div>
        ) : (
          <div className='text-sm text-muted-foreground leading-relaxed'>
            {summary}
            {isStreaming && (
              <span className='inline-block w-2 h-4 bg-primary ml-1 animate-pulse' />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

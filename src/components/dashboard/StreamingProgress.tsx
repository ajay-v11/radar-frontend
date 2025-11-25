'use client';

import {Card, CardContent} from '@/components/ui/card';
import type {SSEEvent} from '@/lib/api/types';

interface StreamingProgressProps {
  currentStep: SSEEvent | null;
}

export function StreamingProgress({currentStep}: StreamingProgressProps) {
  if (!currentStep) return null;

  const getStepLabel = (step: string) => {
    const labels: Record<string, string> = {
      initialize: 'Initializing',
      scraping: 'Scraping Website',
      analyzing: 'Analyzing with AI',
      finalizing: 'Finalizing Results',
      complete: 'Complete',
    };
    return labels[step] || step;
  };

  const getStatusColor = (status: string) => {
    if (status === 'completed' || status === 'success') return 'text-green-500';
    if (status === 'in_progress' || status === 'started')
      return 'text-blue-500';
    if (status === 'failed') return 'text-red-500';
    return 'text-muted-foreground';
  };

  return (
    <Card className='border-primary/20'>
      <CardContent className='p-6'>
        <div className='space-y-4'>
          <div className='flex items-center gap-3'>
            <div className='flex-shrink-0'>
              {currentStep.step === 'complete' ? (
                <svg
                  className='w-6 h-6 text-green-500'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              ) : (
                <div className='w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin' />
              )}
            </div>
            <div className='flex-1'>
              <div
                className={`text-sm font-semibold ${getStatusColor(
                  currentStep.status
                )}`}>
                {getStepLabel(currentStep.step)}
              </div>
              {currentStep.message && (
                <div className='text-xs text-muted-foreground mt-1'>
                  {currentStep.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

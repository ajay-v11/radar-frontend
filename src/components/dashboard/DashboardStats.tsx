'use client';

import {Card, CardContent} from '@/components/ui/card';
import type {VisibilityAnalysisData} from '@/lib/api/types';

interface DashboardStatsProps {
  data: VisibilityAnalysisData;
  models: string[];
  isAnimating: boolean;
}

export function DashboardStats({
  data,
  models,
  isAnimating,
}: DashboardStatsProps) {
  const animationClass = isAnimating
    ? 'animate-in fade-in slide-in-from-bottom-4 duration-500'
    : '';

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${animationClass}`}>
      {/* Visibility Score */}
      <Card className='bg-card border-border'>
        <CardContent className='p-6 flex flex-col items-center justify-center'>
          <p className='text-sm text-muted-foreground mb-2'>Visibility Score</p>
          <div className='relative w-24 h-24'>
            <svg className='transform -rotate-90 w-24 h-24'>
              <circle
                cx='48'
                cy='48'
                r='40'
                stroke='currentColor'
                strokeWidth='6'
                fill='none'
                className='text-muted'
              />
              <circle
                cx='48'
                cy='48'
                r='40'
                stroke='currentColor'
                strokeWidth='6'
                fill='none'
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${
                  2 * Math.PI * 40 * (1 - data.visibility_score / 100)
                }`}
                className='text-primary transition-all duration-1000'
                strokeLinecap='round'
              />
            </svg>
            <div className='absolute inset-0 flex items-center justify-center'>
              <span className='text-3xl font-bold text-primary'>
                {Math.round(data.visibility_score)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Queries */}
      <Card className='bg-card border-border'>
        <CardContent className='p-6 flex flex-col justify-center'>
          <p className='text-sm text-muted-foreground mb-2'>Queries Tested</p>
          <p className='text-4xl font-bold text-foreground'>
            {data.total_queries}
          </p>
        </CardContent>
      </Card>

      {/* Total Mentions */}
      <Card className='bg-card border-border'>
        <CardContent className='p-6 flex flex-col justify-center'>
          <p className='text-sm text-muted-foreground mb-2'>Times Mentioned</p>
          <p className='text-4xl font-bold text-foreground'>
            {data.total_responses}
          </p>
        </CardContent>
      </Card>

      {/* Models Tested */}
      <Card className='bg-card border-border'>
        <CardContent className='p-6 flex flex-col justify-center'>
          <p className='text-sm text-muted-foreground mb-2'>AI Models</p>
          <p className='text-4xl font-bold text-foreground'>{models.length}</p>
          <p className='text-xs text-muted-foreground mt-1'>
            {models.join(', ')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

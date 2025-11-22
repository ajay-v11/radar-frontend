'use client';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Lightbulb, TrendingUp} from 'lucide-react';

interface InsightsPanelProps {
  isAnimating: boolean;
}

export function InsightsPanel({isAnimating}: InsightsPanelProps) {
  const animationClass = isAnimating
    ? 'animate-in fade-in slide-in-from-right-4 duration-500'
    : '';

  return (
    <Card className={`bg-card border-border ${animationClass}`}>
      <CardHeader>
        <CardTitle className='text-foreground flex items-center gap-2'>
          <Lightbulb className='h-5 w-5 text-primary' />
          Insights & Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-3'>
          <div className='flex gap-3'>
            <TrendingUp className='h-5 w-5 text-primary shrink-0 mt-1' />
            <div>
              <h4 className='text-foreground font-semibold mb-1'>
                Strengthen &apos;Comparison&apos; Keywords
              </h4>
              <p className='text-sm text-muted-foreground'>
                Your brand is rarely mentioned in comparison queries. Focus on
                content that directly compares your features against
                competitors.
              </p>
            </div>
          </div>
          <div className='flex gap-3'>
            <TrendingUp className='h-5 w-5 text-primary shrink-0 mt-1' />
            <div>
              <h4 className='text-foreground font-semibold mb-1'>
                Boost &apos;Reviews&apos; Visibility
              </h4>
              <p className='text-sm text-muted-foreground'>
                Your reviews visibility is low. Encourage satisfied customers to
                leave reviews on popular platforms to improve mentions.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import type {ModelBreakdown} from '@/lib/api/types';

interface CompetitorListProps {
  competitors: Record<string, ModelBreakdown>;
  companyName: string;
  isAnimating: boolean;
}

export function CompetitorList({
  competitors,
  companyName,
  isAnimating,
}: CompetitorListProps) {
  const animationClass = isAnimating
    ? 'animate-in fade-in slide-in-from-left-4 duration-500'
    : '';

  // Extract competitor data and sort by mentions
  const competitorList = Object.entries(competitors).flatMap(
    ([model, breakdown]) =>
      Object.entries(breakdown.competitor_mentions || {}).map(
        ([name, mentions]) => ({
          name,
          mentions,
          model,
        })
      )
  );

  // Aggregate by competitor name
  const aggregated = competitorList.reduce((acc, curr) => {
    if (!acc[curr.name]) {
      acc[curr.name] = {name: curr.name, mentions: 0};
    }
    acc[curr.name].mentions += curr.mentions;
    return acc;
  }, {} as Record<string, {name: string; mentions: number}>);

  const sortedCompetitors = Object.values(aggregated)
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, 5);

  // Add company at top
  const totalMentions = Object.values(competitors).reduce(
    (sum, breakdown) => sum + breakdown.mentions,
    0
  );

  const rankings = [
    {name: companyName, mentions: totalMentions, isYou: true},
    ...sortedCompetitors.map((c) => ({...c, isYou: false})),
  ];

  return (
    <Card className={`bg-card border-border ${animationClass}`}>
      <CardHeader>
        <CardTitle className='text-foreground'>Competitor Rankings</CardTitle>
        <p className='text-sm text-muted-foreground'>
          Top mentioned brands in AI responses
        </p>
      </CardHeader>
      <CardContent className='space-y-3'>
        {rankings.map((competitor, idx) => (
          <div
            key={competitor.name}
            className={`flex items-center justify-between p-4 rounded-lg transition-all ${
              competitor.isYou
                ? 'bg-primary/10 border border-primary/30'
                : 'bg-muted/50'
            }`}>
            <div className='flex items-center gap-3'>
              <span className='text-muted-foreground font-semibold w-6'>
                #{idx + 1}
              </span>
              <div className='w-8 h-8 rounded-full bg-muted flex items-center justify-center'>
                <span className='text-foreground text-sm font-semibold'>
                  {competitor.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <span className='text-foreground font-medium'>
                  {competitor.name}
                </span>
                {competitor.isYou && (
                  <span className='text-xs text-muted-foreground ml-2'>
                    (You)
                  </span>
                )}
              </div>
            </div>
            <span className='text-primary font-bold'>
              {competitor.mentions} mentions
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

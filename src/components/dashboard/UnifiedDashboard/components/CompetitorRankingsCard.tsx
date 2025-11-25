'use client';

import {Card, CardContent} from '@/components/ui/card';

interface CompetitorRanking {
  name: string;
  mention_count: number;
  visibility_score: number;
}

interface CompetitorRankingsCardProps {
  competitors: CompetitorRanking[];
}

export function CompetitorRankingsCard({
  competitors = [],
}: CompetitorRankingsCardProps) {
  if (!competitors || competitors.length === 0) {
    return null;
  }

  // Get top 5 competitors
  const topCompetitors = competitors.slice(0, 5);

  return (
    <Card className='h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm'>
      <CardContent className='p-4'>
        {/* Header */}
        <div className='mb-4'>
          <div className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            Top Competitors
          </div>
        </div>

        {/* Competitors List */}
        <div className='space-y-3'>
          {topCompetitors.map((competitor, index) => {
            const score = competitor.visibility_score;
            const getScoreColor = (score: number) => {
              if (score >= 60) return 'text-red-500';
              if (score >= 40) return 'text-yellow-500';
              return 'text-green-500';
            };

            return (
              <div
                key={competitor.name}
                className='group relative overflow-hidden rounded-lg border border-border/50 bg-gradient-to-br from-background/80 to-background/40 p-3 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5'
                style={{
                  animationDelay: `${index * 100}ms`,
                }}>
                {/* Gradient overlay on hover */}
                <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

                <div className='relative'>
                  {/* Competitor Header */}
                  <div className='mb-2 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div className='flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground'>
                        {index + 1}
                      </div>
                      <h3 className='text-sm font-semibold text-foreground'>
                        {competitor.name}
                      </h3>
                    </div>
                    <div className='rounded-full bg-muted/50 px-2.5 py-1'>
                      <span
                        className={`text-sm font-bold ${getScoreColor(score)}`}>
                        {score.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className='mb-2 h-1.5 w-full overflow-hidden rounded-full bg-muted/50'>
                    <div
                      className='h-full rounded-full bg-gradient-to-r from-red-500 via-red-500 to-red-500/60 shadow-lg shadow-red-500/20 transition-all duration-1000 ease-out animate-in slide-in-from-left'
                      style={{
                        width: `${score}%`,
                        animationDelay: `${index * 150}ms`,
                      }}
                    />
                  </div>

                  {/* Mentions Count */}
                  <div className='flex items-center justify-between text-xs text-muted-foreground'>
                    <span>Mentions</span>
                    <span className='font-semibold text-foreground'>
                      {competitor.mention_count}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        {competitors.length > 5 && (
          <div className='mt-3 text-center text-xs text-muted-foreground'>
            Showing top 5 of {competitors.length} competitors
          </div>
        )}
      </CardContent>
    </Card>
  );
}

'use client';

import {Card, CardContent} from '@/components/ui/card';
import {CategoryBreakdownItem} from '@/lib/api/types';

interface CategoryBreakdownCardProps {
  categoryBreakdown: CategoryBreakdownItem[];
}

export function CategoryBreakdownCard({
  categoryBreakdown,
}: CategoryBreakdownCardProps) {
  if (!categoryBreakdown || categoryBreakdown.length === 0) {
    return null;
  }

  return (
    <Card className='overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm'>
      <CardContent className='p-4'>
        {/* Header */}
        <div className='mb-4'>
          <div className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            Category Breakdown
          </div>
        </div>

        {/* Categories List */}
        <div className='space-y-2'>
          {categoryBreakdown.map((category, index) => {
            const score = category.score || 0;
            const normalizedScore = score < 1 ? score * 100 : score;

            return (
              <div
                key={category.category}
                className='group relative overflow-hidden rounded-lg border border-border/50 bg-gradient-to-br from-background/80 to-background/40 p-3 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-2'
                style={{
                  animationDelay: `${index * 50}ms`,
                }}>
                {/* Gradient overlay on hover */}
                <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

                <div className='relative'>
                  {/* Category Header */}
                  <div className='mb-2 flex items-center justify-between'>
                    <div className='flex-1'>
                      <h3 className='text-sm font-semibold capitalize text-foreground'>
                        {category.category.replace(/_/g, ' ')}
                      </h3>
                    </div>
                    <div className='rounded-full bg-primary/10 px-2.5 py-1 ring-1 ring-primary/20'>
                      <span className='text-sm font-bold text-primary'>
                        {normalizedScore.toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className='mb-2 h-1.5 w-full overflow-hidden rounded-full bg-muted/50'>
                    <div
                      className='h-full rounded-full bg-gradient-to-r from-primary via-primary to-primary/60 shadow-lg shadow-primary/20 transition-all duration-1000 ease-out'
                      style={{
                        width: `${normalizedScore}%`,
                        animationDelay: `${index * 100}ms`,
                      }}
                    />
                  </div>

                  {/* Stats */}
                  <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                    <div>
                      <span className='font-semibold text-foreground'>
                        {category.mentions}
                      </span>{' '}
                      mentions
                    </div>
                    <div className='h-3 w-px bg-border' />
                    <div>
                      <span className='font-semibold text-foreground'>
                        {category.queries}
                      </span>{' '}
                      queries
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

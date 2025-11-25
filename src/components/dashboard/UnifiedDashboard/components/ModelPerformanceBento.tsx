'use client';

import {Card, CardContent} from '@/components/ui/card';

import {CategoryBreakdownItem, ModelBreakdown} from '@/lib/api/types';
import {Skeleton} from '@/components/ui/skeleton';

interface ModelData {
  [modelName: string]: ModelBreakdown;
}

interface ModelPerformanceBentoProps {
  modelData?: ModelData;
  modelScores?: Record<string, number>;
  isStreaming?: boolean;
  categoryBreakdown?: CategoryBreakdownItem[];
  totalQueries?: number;
  totalMentions?: number;
}

export function ModelPerformanceBento({
  modelData,
  modelScores,
  isStreaming = false,
  categoryBreakdown = [],
  totalQueries = 0,
  totalMentions = 0,
}: ModelPerformanceBentoProps) {
  // Use modelData if available (final state), otherwise use modelScores (streaming state)
  const models: Array<[string, ModelBreakdown]> = modelData
    ? Object.entries(modelData)
    : modelScores
    ? Object.entries(modelScores).map(
        ([name, score]): [string, ModelBreakdown] => [
          name,
          {
            mentions: 0,
            total_responses: 0,
            mention_rate: score / 100, // Backend sends as percentage (90.0), convert to decimal (0.90)
            competitor_mentions: {},
          },
        ]
      )
    : [];

  // Model icons mapping
  const getModelIcon = (modelName: string) => {
    const name = modelName.toLowerCase();
    if (name.includes('chatgpt') || name.includes('gpt')) {
      return (
        <svg className='h-5 w-5' viewBox='0 0 24 24' fill='currentColor'>
          <path d='M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 004.981 4.18a5.985 5.985 0 00-3.998 2.9 6.046 6.046 0 00.743 7.097 5.98 5.98 0 00.51 4.911 6.051 6.051 0 006.515 2.9A5.985 5.985 0 0013.26 24a6.056 6.056 0 005.772-4.206 5.99 5.99 0 003.997-2.9 6.056 6.056 0 00-.747-7.073zM13.26 22.43a4.476 4.476 0 01-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 00.392-.681v-6.737l2.02 1.168a.071.071 0 01.038.052v5.583a4.504 4.504 0 01-4.494 4.494zM3.6 18.304a4.47 4.47 0 01-.535-3.014l.142.085 4.783 2.759a.771.771 0 00.78 0l5.843-3.369v2.332a.08.08 0 01-.033.062L9.74 19.95a4.5 4.5 0 01-6.14-1.646zM2.34 7.896a4.485 4.485 0 012.366-1.973V11.6a.766.766 0 00.388.676l5.815 3.355-2.02 1.168a.076.076 0 01-.071 0l-4.83-2.786A4.504 4.504 0 012.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 01.071 0l4.83 2.791a4.494 4.494 0 01-.676 8.105v-5.678a.79.79 0 00-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 00-.785 0L9.409 9.23V6.897a.066.066 0 01.028-.061l4.83-2.787a4.5 4.5 0 016.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 01-.038-.057V6.075a4.5 4.5 0 017.375-3.453l-.142.08L8.704 5.46a.795.795 0 00-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z' />
        </svg>
      );
    } else if (name.includes('claude')) {
      return (
        <svg className='h-5 w-5' viewBox='0 0 24 24' fill='currentColor'>
          <path d='M17.45 14.285c-.2.6-.5 1.1-.9 1.5-.4.4-.9.7-1.5.9-.6.2-1.2.3-1.9.3-1.3 0-2.4-.5-3.2-1.4-.8-.9-1.2-2.1-1.2-3.6 0-1.5.4-2.7 1.2-3.6.8-.9 1.9-1.4 3.2-1.4.7 0 1.3.1 1.9.3.6.2 1.1.5 1.5.9.4.4.7.9.9 1.5.2.6.3 1.2.3 1.9 0 .7-.1 1.3-.3 1.9zm-4.3-7.3c-1.9 0-3.5.7-4.7 2-1.2 1.3-1.8 3-1.8 5s.6 3.7 1.8 5c1.2 1.3 2.8 2 4.7 2 1.9 0 3.5-.7 4.7-2 1.2-1.3 1.8-3 1.8-5s-.6-3.7-1.8-5c-1.2-1.3-2.8-2-4.7-2z' />
        </svg>
      );
    } else if (name.includes('perplexity')) {
      return (
        <svg className='h-5 w-5' viewBox='0 0 24 24' fill='currentColor'>
          <path d='M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L19.82 8 12 11.82 4.18 8 12 4.18zM4 9.5l7 3.5v7l-7-3.5v-7zm9 11v-7l7-3.5v7l-7 3.5z' />
        </svg>
      );
    } else if (name.includes('gemini')) {
      return (
        <svg className='h-5 w-5' viewBox='0 0 24 24' fill='currentColor'>
          <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
        </svg>
      );
    }
    return (
      <svg
        className='h-5 w-5'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
        />
      </svg>
    );
  };

  return (
    <Card className='h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm'>
      <CardContent className='p-4'>
        {/* Header */}
        <div className='mb-4'>
          <div className='flex items-center justify-between'>
            <div className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              Model Performance
            </div>
            {isStreaming && (
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 animate-pulse rounded-full bg-primary' />
                <span className='text-xs text-muted-foreground'>
                  Updating...
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Models Grid */}
        <div className='space-y-3'>
          {models.map(([modelName, data], index) => {
            // Backend sends scores as percentages (0-100), convert to decimal (0-1) for display
            const mentionRate = data.mention_rate || 0;
            let mentions = data.mentions || 0;
            let queries = data.total_responses || 0;

            // When using modelScores (not modelData), use aggregate totals divided by number of models
            if (!modelData && models.length > 0) {
              mentions = Math.round(totalMentions / models.length);
              queries = Math.round(totalQueries / models.length);
            }

            return (
              <div
                key={modelName}
                className='group relative overflow-hidden rounded-lg border border-border/50 bg-gradient-to-br from-background/80 to-background/40 p-3 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5'
                style={{
                  animationDelay: `${index * 100}ms`,
                }}>
                {/* Gradient overlay on hover */}
                <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

                <div className='relative'>
                  {/* Model Header */}
                  <div className='mb-2 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110'>
                        {getModelIcon(modelName)}
                      </div>
                      <div>
                        <h3 className='text-sm font-semibold capitalize text-foreground'>
                          {modelName}
                        </h3>
                      </div>
                    </div>
                    <div className='rounded-full bg-primary/10 px-2.5 py-1 ring-1 ring-primary/20'>
                      <span className='text-sm font-bold text-primary'>
                        {(mentionRate * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className='mb-2 h-2 w-full overflow-hidden rounded-full bg-muted/50'>
                    <div
                      className='h-full rounded-full bg-gradient-to-r from-primary via-primary to-primary/60 shadow-lg shadow-primary/20 transition-all duration-1000 ease-out animate-in slide-in-from-left'
                      style={{
                        width: `${mentionRate * 100}%`,
                        animationDelay: `${index * 150}ms`,
                      }}
                    />
                  </div>

                  {/* Stats Grid */}
                  <div className='grid grid-cols-2 gap-2'>
                    <div className='rounded-lg bg-background/60 p-2 backdrop-blur-sm'>
                      <div className='text-xs text-muted-foreground'>
                        Mentions
                      </div>
                      {isStreaming && !modelData ? (
                        <Skeleton className='mt-0.5 h-6 w-12' />
                      ) : (
                        <div className='mt-0.5 text-base font-bold text-foreground'>
                          {mentions}
                        </div>
                      )}
                    </div>
                    <div className='rounded-lg bg-background/60 p-2 backdrop-blur-sm'>
                      <div className='text-xs text-muted-foreground'>
                        Queries
                      </div>
                      {isStreaming && !modelData ? (
                        <Skeleton className='mt-0.5 h-6 w-12' />
                      ) : (
                        <div className='mt-0.5 text-base font-bold text-foreground'>
                          {queries}
                        </div>
                      )}
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

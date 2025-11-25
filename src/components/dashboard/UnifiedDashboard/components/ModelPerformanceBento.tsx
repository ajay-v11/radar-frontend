'use client';

import {Card, CardContent} from '@/components/ui/card';
import Image from 'next/image';
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
        <Image
          src='/models/chatgpt.svg'
          alt='ChatGPT'
          width={20}
          height={20}
          className='h-5 w-5'
        />
      );
    } else if (name.includes('claude')) {
      return (
        <Image
          src='/models/claude.svg'
          alt='Claude'
          width={20}
          height={20}
          className='h-5 w-5'
        />
      );
    } else if (name.includes('llama') || name.includes('meta')) {
      return (
        <Image
          src='/models/meta.svg'
          alt='Meta Llama'
          width={20}
          height={20}
          className='h-5 w-5'
        />
      );
    } else if (name.includes('gemini')) {
      return (
        <Image
          src='/models/gemini.svg'
          alt='Gemini'
          width={20}
          height={20}
          className='h-5 w-5'
        />
      );
    } else if (name.includes('perplexity')) {
      return (
        <svg className='h-5 w-5' viewBox='0 0 24 24' fill='currentColor'>
          <path d='M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L19.82 8 12 11.82 4.18 8 12 4.18zM4 9.5l7 3.5v7l-7-3.5v-7zm9 11v-7l7-3.5v7l-7 3.5z' />
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

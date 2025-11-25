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
    } else if (name.includes('llama')) {
      return (
        <svg className='h-5 w-5' viewBox='0 0 24 24' fill='currentColor'>
          <path
            d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 12.8687 2.11211 13.7126 2.3228 14.522C3.12067 13.6288 4.20577 13.0135 5.41828 12.8091C6.01257 12.709 6.62128 12.7156 7.21855 12.8286C7.54573 12.8906 7.86591 12.9806 8.17743 13.097C9.28188 13.5097 10.2798 14.1687 11.1278 15.0204C11.9687 15.8647 12.6366 16.8648 13.0858 17.965C13.2183 18.2895 13.3283 18.6218 13.4158 18.9602C13.5289 19.3973 13.6067 19.843 13.6493 20.2954C13.0645 20.4578 12.4577 20.5367 11.8447 20.5312H11.8385C11.4583 20.5312 11.0827 20.5042 10.7135 20.4518C11.1378 21.3653 12.072 22 13.1538 22H12ZM18.2526 14.4936C17.3986 13.2514 16.2573 12.2359 14.9351 11.5368C14.2862 11.1938 13.6067 10.9161 12.9038 10.7052C12.1895 10.4912 11.4651 10.3396 10.7329 10.2528C9.25595 10.0778 7.76633 10.2647 6.36853 10.7936C5.68897 11.0506 5.04406 11.3857 4.44199 11.7915C4.94309 6.27367 9.58983 2 15.1538 2C20.6767 2 25.1538 6.47715 25.1538 12C25.1538 16.4183 22.2882 20.1834 18.2526 14.4936Z'
            transform='translate(-2 -2) scale(1.1)'
          />
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

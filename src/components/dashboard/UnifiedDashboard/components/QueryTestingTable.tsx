'use client';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {QueryTableSkeleton} from './QueryTableSkeleton';
import {QueryTableContent} from './QueryTableContent';
import {Progress} from '@/components/ui/progress';
import type {CategoryProgress, BatchResult} from '@/lib/api/types';

interface QueryTestingTableProps {
  batchResults: BatchResult[];
  streamingQueries: string[];
  isAnalyzing: boolean;
  categoryProgress?: CategoryProgress[];
}

function getStatusLabel(status: CategoryProgress['status']): string {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'generating':
      return 'Generating Queries';
    case 'testing':
      return 'Testing Responses';
    case 'analyzing':
      return 'Analyzing Results';
    case 'complete':
      return 'Complete';
    default:
      return 'Unknown';
  }
}

function getStatusColor(status: CategoryProgress['status']): string {
  switch (status) {
    case 'pending':
      return 'text-muted-foreground';
    case 'generating':
      return 'text-blue-500';
    case 'testing':
      return 'text-yellow-500';
    case 'analyzing':
      return 'text-purple-500';
    case 'complete':
      return 'text-green-500';
    default:
      return 'text-muted-foreground';
  }
}

function getProgressPercentage(category: CategoryProgress): number {
  switch (category.status) {
    case 'pending':
      return 0;
    case 'generating':
      return 25;
    case 'testing':
      return 50;
    case 'analyzing':
      return 75;
    case 'complete':
      return 100;
    default:
      return 0;
  }
}

function formatCategoryName(category: string): string {
  return category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function QueryTestingTable({
  batchResults,
  streamingQueries,
  isAnalyzing,
  categoryProgress = [],
}: QueryTestingTableProps) {
  // Show category progress if available, otherwise show legacy batch results
  const showCategoryProgress = categoryProgress.length > 0;

  // Hide the table if there's no data to show
  if (!showCategoryProgress && batchResults.length === 0 && !isAnalyzing) {
    return null;
  }

  return (
    <Card className='overflow-hidden'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2 text-base'>
          {showCategoryProgress ? 'Category Progress' : 'Query Testing Results'}
          {isAnalyzing && (
            <div className='h-2 w-2 animate-pulse rounded-full bg-primary' />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className='p-0'>
        {showCategoryProgress ? (
          <div className='divide-y'>
            {categoryProgress.map((category) => {
              const isCurrentlyProcessing =
                category.status !== 'pending' && category.status !== 'complete';
              const progressPercentage = getProgressPercentage(category);
              const isComplete = category.status === 'complete';

              return (
                <div
                  key={category.category}
                  className={`p-4 transition-all duration-500 ease-out ${
                    isCurrentlyProcessing
                      ? 'bg-accent/50 animate-in fade-in slide-in-from-left-2'
                      : isComplete
                      ? 'bg-muted/30 animate-in fade-in'
                      : ''
                  }`}>
                  <div className='flex items-start justify-between gap-4'>
                    {/* Category Name and Status */}
                    <div className='flex-1 space-y-2'>
                      <div className='flex items-center gap-2'>
                        <h4 className='font-medium'>
                          {formatCategoryName(category.category)}
                        </h4>
                        <span
                          className={`text-xs font-medium ${getStatusColor(
                            category.status
                          )}`}>
                          {getStatusLabel(category.status)}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <Progress value={progressPercentage} className='h-1.5' />

                      {/* Details based on status */}
                      <div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
                        {/* Queries Generated */}
                        {category.queriesGenerated !== undefined && (
                          <div>
                            <span className='font-medium'>Queries:</span>{' '}
                            {category.queriesGenerated}
                          </div>
                        )}

                        {/* Responses Tested */}
                        {category.responsesTested !== undefined && (
                          <div>
                            <span className='font-medium'>Tested:</span>{' '}
                            {category.responsesTested}
                          </div>
                        )}

                        {/* Visibility Score and Mentions (when complete) */}
                        {category.status === 'complete' && (
                          <>
                            {category.score !== undefined && (
                              <div>
                                <span className='font-medium'>Visibility:</span>{' '}
                                <span className='text-foreground font-semibold'>
                                  {category.score.toFixed(1)}%
                                </span>
                              </div>
                            )}
                            {category.mentions !== undefined && (
                              <div>
                                <span className='font-medium'>Mentions:</span>{' '}
                                <span className='text-foreground font-semibold'>
                                  {category.mentions}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Status Icon */}
                    <div className='shrink-0'>
                      {category.status === 'complete' ? (
                        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10'>
                          <svg
                            className='h-5 w-5 text-green-500'
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
                        </div>
                      ) : isCurrentlyProcessing ? (
                        <div className='flex h-8 w-8 items-center justify-center'>
                          <div className='h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                        </div>
                      ) : (
                        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-muted'>
                          <div className='h-2 w-2 rounded-full bg-muted-foreground' />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : batchResults.length === 0 && isAnalyzing ? (
          <QueryTableSkeleton />
        ) : (
          <QueryTableContent
            batchResults={batchResults}
            streamingQueries={streamingQueries}
          />
        )}
      </CardContent>
    </Card>
  );
}

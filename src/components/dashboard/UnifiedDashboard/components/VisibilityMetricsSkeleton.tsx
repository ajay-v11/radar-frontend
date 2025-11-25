'use client';

import {Card, CardContent} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';

export function VisibilityScoreSkeleton() {
  return (
    <Card className='h-full overflow-hidden border-border/50 bg-gradient-to-br from-primary/5 via-card to-card backdrop-blur-sm'>
      <CardContent className='flex h-full flex-col justify-between p-6'>
        {/* Header */}
        <div className='mb-4'>
          <Skeleton className='h-3 w-32' />
        </div>

        {/* Circular Progress - Centered */}
        <div className='flex flex-1 flex-col items-center justify-center'>
          <div className='relative'>
            {/* Circle skeleton */}
            <div className='flex h-48 w-48 items-center justify-center'>
              <Skeleton className='h-44 w-44 rounded-full' />
            </div>

            {/* Score in center */}
            <div className='absolute inset-0 flex flex-col items-center justify-center'>
              <Skeleton className='h-12 w-24' />
              <Skeleton className='mt-2 h-3 w-20' />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className='mt-6 grid grid-cols-3 gap-3 border-t border-border/50 pt-4'>
          <div className='text-center'>
            <Skeleton className='mx-auto h-6 w-12' />
            <Skeleton className='mx-auto mt-1 h-3 w-16' />
          </div>
          <div className='border-l border-r border-border/50 text-center'>
            <Skeleton className='mx-auto h-6 w-12' />
            <Skeleton className='mx-auto mt-1 h-3 w-16' />
          </div>
          <div className='text-center'>
            <Skeleton className='mx-auto h-6 w-12' />
            <Skeleton className='mx-auto mt-1 h-3 w-16' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ModelPerformanceSkeleton() {
  return (
    <Card className='h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm'>
      <CardContent className='p-4'>
        {/* Header */}
        <div className='mb-4'>
          <Skeleton className='h-3 w-32' />
        </div>

        {/* Models Grid */}
        <div className='space-y-3'>
          {[1, 2].map((index) => (
            <div
              key={index}
              className='overflow-hidden rounded-lg border border-border/50 bg-gradient-to-br from-background/80 to-background/40 p-3'>
              {/* Model Header */}
              <div className='mb-2 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-8 w-8 rounded-lg' />
                  <Skeleton className='h-4 w-20' />
                </div>
                <Skeleton className='h-6 w-12 rounded-full' />
              </div>

              {/* Progress Bar */}
              <Skeleton className='mb-2 h-2 w-full rounded-full' />

              {/* Stats Grid */}
              <div className='grid grid-cols-2 gap-2'>
                <div className='rounded-lg bg-background/60 p-2'>
                  <Skeleton className='h-3 w-12' />
                  <Skeleton className='mt-1 h-6 w-8' />
                </div>
                <div className='rounded-lg bg-background/60 p-2'>
                  <Skeleton className='h-3 w-12' />
                  <Skeleton className='mt-1 h-6 w-8' />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

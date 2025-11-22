'use client';

import {Loader2} from 'lucide-react';
interface CategoryProgress {
  name: string;
  status: 'pending' | 'loading' | 'complete';
}

interface LoadingSidebarProps {
  isVisible: boolean;
  currentPhase: string;
  categories: CategoryProgress[];
}

export function LoadingSidebar({
  isVisible,
  currentPhase,
  categories,
}: LoadingSidebarProps) {
  if (!isVisible) return null;

  return (
    <div className='w-64 border-r border-border bg-card p-6 space-y-6'>
      {/* Animated Loading Indicator */}
      <div className='flex flex-col items-center justify-center space-y-4'>
        <div className='relative'>
          <Loader2 className='h-12 w-12 text-primary animate-spin' />
          <div className='absolute inset-0 bg-primary/20 blur-xl animate-pulse' />
        </div>
        <div className='text-center'>
          <p className='text-sm font-medium text-foreground'>
            {currentPhase === 'summary'
              ? 'Analyzing Company...'
              : currentPhase === 'categories'
              ? 'Testing Queries...'
              : 'Processing Results...'}
          </p>
          <p className='text-xs text-muted-foreground mt-1'>
            Please wait while we gather data
          </p>
        </div>
      </div>

      {/* Vertical Shimmer Effect */}
      <div className='space-y-3'>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className='h-16 bg-muted rounded-lg overflow-hidden relative'>
            <div className='absolute inset-0 bg-linear-to-r from-transparent via-primary/10 to-transparent animate-shimmer' />
          </div>
        ))}
      </div>

      {/* Category Progress */}
      {categories.length > 0 && (
        <div className='space-y-2'>
          <p className='text-xs font-medium text-muted-foreground uppercase tracking-wide'>
            Progress
          </p>
          {categories.map((cat, idx) => (
            <div key={idx} className='flex items-center gap-2'>
              <div
                className={`h-2 w-2 rounded-full ${
                  cat.status === 'complete'
                    ? 'bg-green-500'
                    : cat.status === 'loading'
                    ? 'bg-primary animate-pulse'
                    : 'bg-muted'
                }`}
              />
              <span className='text-xs text-muted-foreground truncate'>
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

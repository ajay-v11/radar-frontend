'use client';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {CheckCircle2, Loader2} from 'lucide-react';

interface QueryData {
  query: string;
  model: string;
  mentioned: boolean;
}

interface CategoryProgress {
  name: string;
  status: 'pending' | 'loading' | 'complete';
  queries: QueryData[];
  visibility: number;
}

interface CategoryQueryLogProps {
  categories: CategoryProgress[];
}

export function CategoryQueryLog({categories}: CategoryQueryLogProps) {
  return (
    <Card className='bg-card border-border'>
      <CardHeader>
        <CardTitle className='text-foreground'>Query Log by Category</CardTitle>
        <p className='text-sm text-muted-foreground'>
          Live updates as queries are tested
        </p>
      </CardHeader>
      <CardContent>
        {/* Table Header */}
        <div className='grid grid-cols-12 gap-4 px-4 py-3 text-sm font-medium text-muted-foreground border-b border-border'>
          <div className='col-span-5'>Category</div>
          <div className='col-span-3 text-center'>Status</div>
          <div className='col-span-2 text-center'>Queries</div>
          <div className='col-span-2 text-center'>Visibility</div>
        </div>

        {/* Category Rows */}
        <div className='space-y-2 mt-2'>
          {categories.map((category, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-12 gap-4 px-4 py-4 rounded-lg transition-all duration-300 ${
                category.status === 'loading'
                  ? 'bg-primary/10 border border-primary/30'
                  : category.status === 'complete'
                  ? 'bg-muted/50'
                  : 'bg-background'
              }`}>
              {/* Category Name */}
              <div className='col-span-5 flex items-center'>
                <span className='text-foreground font-medium'>
                  {category.name}
                </span>
              </div>

              {/* Status */}
              <div className='col-span-3 flex items-center justify-center'>
                {category.status === 'pending' && (
                  <span className='text-xs text-muted-foreground px-3 py-1 bg-muted rounded-full'>
                    Waiting
                  </span>
                )}
                {category.status === 'loading' && (
                  <div className='flex items-center gap-2'>
                    <Loader2 className='h-4 w-4 text-primary animate-spin' />
                    <span className='text-xs text-primary font-medium'>
                      Testing...
                    </span>
                  </div>
                )}
                {category.status === 'complete' && (
                  <CheckCircle2 className='h-5 w-5 text-green-500' />
                )}
              </div>

              {/* Queries Count */}
              <div className='col-span-2 flex items-center justify-center'>
                {category.status === 'loading' ? (
                  <div className='h-6 w-12 bg-muted rounded animate-pulse' />
                ) : category.status === 'complete' ? (
                  <span className='text-foreground font-semibold'>
                    {category.queries.length || 4}
                  </span>
                ) : (
                  <span className='text-muted-foreground'>-</span>
                )}
              </div>

              {/* Visibility */}
              <div className='col-span-2 flex items-center justify-center'>
                {category.status === 'loading' ? (
                  <div className='h-6 w-16 bg-muted rounded animate-pulse' />
                ) : category.status === 'complete' ? (
                  <span className='text-primary font-bold'>
                    {Math.round(category.visibility)}%
                  </span>
                ) : (
                  <span className='text-muted-foreground'>-</span>
                )}
              </div>

              {/* Loading shimmer effect */}
              {category.status === 'loading' && (
                <div className='col-span-12 h-1 bg-muted rounded-full overflow-hidden mt-2'>
                  <div className='h-full bg-primary animate-shimmer-horizontal' />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className='text-center py-12 text-muted-foreground'>
            <p className='text-sm'>Initializing query categories...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

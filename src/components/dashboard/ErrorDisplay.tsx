'use client';

import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import type {FormattedError} from '@/lib/api/errors';

interface ErrorDisplayProps {
  error: FormattedError;
  onRetry?: () => void;
  onDismiss?: () => void;
}

/**
 * ErrorDisplay component shows user-friendly error messages with retry option
 * Validates: Requirements 8.6
 */
export function ErrorDisplay({error, onRetry, onDismiss}: ErrorDisplayProps) {
  const getErrorIcon = () => {
    switch (error.type) {
      case 'network':
        return '🌐';
      case 'http':
        return '⚠️';
      case 'sse':
        return '🔌';
      case 'validation':
        return '📝';
      default:
        return '❌';
    }
  };

  const getErrorTitle = () => {
    switch (error.type) {
      case 'network':
        return 'Connection Error';
      case 'http':
        return 'Server Error';
      case 'sse':
        return 'Connection Interrupted';
      case 'validation':
        return 'Validation Error';
      default:
        return 'Error';
    }
  };

  return (
    <div className='flex items-center justify-center min-h-[400px] p-4'>
      <Card className='max-w-md w-full p-6 space-y-4'>
        <div className='flex items-start space-x-3'>
          <span className='text-3xl'>{getErrorIcon()}</span>
          <div className='flex-1 space-y-2'>
            <h3 className='text-lg font-semibold text-foreground'>
              {getErrorTitle()}
            </h3>
            <p className='text-sm text-muted-foreground'>{error.userMessage}</p>
            {process.env.NODE_ENV === 'development' && error.message && (
              <details className='mt-2'>
                <summary className='text-xs text-muted-foreground cursor-pointer hover:text-foreground'>
                  Technical Details
                </summary>
                <pre className='mt-2 text-xs bg-muted p-2 rounded overflow-auto'>
                  {error.message}
                </pre>
              </details>
            )}
          </div>
        </div>

        <div className='flex gap-2 justify-end'>
          {onDismiss && (
            <Button variant='outline' onClick={onDismiss}>
              Dismiss
            </Button>
          )}
          {onRetry && (
            <Button onClick={onRetry} className='gap-2'>
              <span>🔄</span>
              Retry
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

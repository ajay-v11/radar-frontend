'use client';

import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {getAPIMode, setAPIMode, type APIMode} from '@/lib/api/client';

/**
 * Development-only component for toggling between real and mock API modes
 * Only renders in development mode (NODE_ENV === 'development')
 */
export function ApiModeToggle() {
  const [mode, setMode] = useState<APIMode>('mock');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development mode
    setIsVisible(process.env.NODE_ENV === 'development');

    // Get initial mode from localStorage or environment
    setMode(getAPIMode());
  }, []);

  const handleToggle = () => {
    const newMode: APIMode = mode === 'real' ? 'mock' : 'real';
    setMode(newMode);
    setAPIMode(newMode);
  };

  // Don't render in production
  if (!isVisible) {
    return null;
  }

  return (
    <div className='fixed bottom-4 right-4 z-50'>
      <Button onClick={handleToggle} variant='outline' size='sm'>
        API: {mode.toUpperCase()}
      </Button>
    </div>
  );
}

'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {CompanyInput} from '@/components/dashboard/CompanyInput';
import {ApiModeToggle} from '@/components/dev/ApiModeToggle';
import {ErrorDisplay} from '@/components/dashboard/ErrorDisplay';
import {StreamingProgress} from '@/components/dashboard/StreamingProgress';
import type {CompanyData} from '@/lib/types';
import type {CompanyAnalysisData, SSEEvent} from '@/lib/api/types';
import type {FormattedError} from '@/lib/api/errors';

type PageStep = 'input' | 'streaming' | 'error';

export default function CompanyInputPage() {
  const router = useRouter();
  const [step, setStep] = useState<PageStep>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<FormattedError | null>(null);
  const [currentProgress, setCurrentProgress] = useState<SSEEvent | null>(null);

  const handleCompanySubmit = (
    data: CompanyData,
    analysis: CompanyAnalysisData
  ) => {
    // Clear any previous data first to avoid showing stale/incomplete data
    sessionStorage.removeItem('companyData');
    sessionStorage.removeItem('companyAnalysisData');
    sessionStorage.removeItem('skipModelSelection');
    sessionStorage.removeItem('companySlugId');
    sessionStorage.removeItem('visibilitySlugId');

    // Store complete data and navigate to dashboard
    sessionStorage.setItem('companyData', JSON.stringify(data));
    sessionStorage.setItem('companyAnalysisData', JSON.stringify(analysis));
    sessionStorage.setItem('skipModelSelection', 'true');

    // Store company slug_id for subsequent API calls
    if (analysis.slug_id) {
      sessionStorage.setItem('companySlugId', analysis.slug_id);
      console.log('[CompanyInput] Stored company slug_id:', analysis.slug_id);
    }

    // Navigate directly to dashboard
    router.push('/dashboard');
  };

  const handleProgress = (event: SSEEvent) => {
    setCurrentProgress(event);
    if (event.step !== 'complete') {
      setStep('streaming');
      setIsLoading(true);
    }
  };

  const handleError = (formattedError: FormattedError) => {
    setError(formattedError);
    setIsLoading(false);
    setStep('error');
  };

  const handleRetry = () => {
    setError(null);
    setStep('input');
  };

  const handleDismissError = () => {
    setError(null);
    setStep('input');
  };

  return (
    <div className='h-[calc(100vh-4rem)] bg-background flex overflow-hidden'>
      {/* Left Section - Input Form */}
      <div className='w-1/3 flex items-center justify-center p-12 border-r border-border'>
        {(step === 'input' || step === 'streaming') && (
          <div className='w-full space-y-6'>
            <CompanyInput
              onSubmit={handleCompanySubmit}
              onProgress={handleProgress}
              onError={handleError}
              isLoading={isLoading}
            />
            {step === 'streaming' && currentProgress && (
              <StreamingProgress currentStep={currentProgress} />
            )}
          </div>
        )}

        {step === 'error' && error && (
          <div className='w-full'>
            <ErrorDisplay
              error={error}
              onRetry={handleRetry}
              onDismiss={handleDismissError}
            />
          </div>
        )}
      </div>

      {/* Right Section - Info about Radar */}
      <div className='w-2/3 bg-background flex flex-col justify-end p-12'>
        <div className='text-muted-foreground'>
          <p className='text-sm italic'>
            &quot;Radar has transformed how we analyze companies, providing deep
            insights and comprehensive analysis faster than ever before.&quot;
          </p>
          <p className='text-sm mt-2'>- Industry Professional</p>
        </div>
      </div>

      <ApiModeToggle />
    </div>
  );
}

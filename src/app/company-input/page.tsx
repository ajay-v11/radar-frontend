'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import {CompanyInput} from '@/components/dashboard/CompanyInput';
import {ApiModeToggle} from '@/components/dev/ApiModeToggle';
import {ErrorDisplay} from '@/components/dashboard/ErrorDisplay';
import {StreamingProgress} from '@/components/dashboard/StreamingProgress';
import dashImg from '@/assets/dash-img.png';
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

      {/* Right Section - Mac-style floating window with dashboard preview */}
      <div className='w-2/3 bg-background flex flex-col items-center justify-center p-12 relative overflow-hidden'>
        {/* Subtle background gradient */}
        <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none' />

        <div
          className='relative max-w-3xl w-full'
          style={{
            animation: 'float 6s ease-in-out infinite',
          }}>
          {/* Mac window chrome */}
          <div className='bg-gradient-to-b from-muted to-muted/80 rounded-t-xl px-4 py-3 flex items-center gap-2 shadow-xl border-t border-x border-border/50'>
            <div className='flex gap-2'>
              <div className='w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer' />
              <div className='w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer' />
              <div className='w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer' />
            </div>
            <div className='flex-1 text-center text-xs text-muted-foreground font-medium'>
              Dashboard Preview
            </div>
          </div>

          {/* Window content */}
          <div className='bg-card rounded-b-xl overflow-hidden shadow-2xl border-x border-b border-border/50'>
            <div className='relative w-full aspect-[16/10] bg-muted/20'>
              <Image
                src={dashImg}
                alt='Dashboard Preview'
                fill
                className='object-cover object-top'
                priority
              />
            </div>
          </div>
        </div>

        {/* Tagline at bottom */}
        <div className='relative mt-12 text-center text-muted-foreground max-w-2xl'>
          <p className='text-sm italic'>
            &quot;Track your brand&apos;s visibility across AI platforms and
            understand how AI models perceive your company.&quot;
          </p>
          <p className='text-xs mt-2 opacity-70'>Powered by Radar</p>
        </div>
      </div>

      <ApiModeToggle />
    </div>
  );
}

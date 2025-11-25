'use client';

import * as React from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {getAPIClient} from '@/lib/api/client';
import {formatErrorMessage, logError} from '@/lib/api/errors';
import {getConnectionManager} from '@/lib/api/connection-manager';
import type {CompanyAnalysisData, SSEEvent} from '@/lib/api/types';
import type {FormattedError} from '@/lib/api/errors';

interface CompanyData {
  name: string;
  website: string;
  targetRegion: string;
}

interface CompanyInputProps {
  onSubmit: (data: CompanyData, analysisData: CompanyAnalysisData) => void;
  onProgress?: (event: SSEEvent) => void;
  onError?: (error: FormattedError) => void;
  isLoading?: boolean;
}

export function CompanyInput({
  onSubmit,
  onProgress,
  onError,
  isLoading = false,
}: CompanyInputProps) {
  const [companyName, setCompanyName] = React.useState('');
  const [website, setWebsite] = React.useState('');
  const [targetRegion, setTargetRegion] = React.useState('');
  const [errors, setErrors] = React.useState<{
    name?: string;
    website?: string;
    targetRegion?: string;
    api?: string;
  }>({});

  // Cleanup SSE connections on unmount
  React.useEffect(() => {
    return () => {
      const apiClient = getAPIClient();
      // Clean up any active connections when component unmounts
      if (apiClient.getMode() === 'real') {
        getConnectionManager().cleanup('company-analysis');
      }
    };
  }, []);

  const isValid =
    companyName.trim() !== '' &&
    website.trim() !== '' &&
    targetRegion.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return; // Prevent submission during loading

    // Validate fields
    const newErrors: {
      name?: string;
      website?: string;
      targetRegion?: string;
      api?: string;
    } = {};

    if (companyName.trim() === '') {
      newErrors.name = 'Company name is required';
    }

    if (website.trim() === '') {
      newErrors.website = 'Website URL is required';
    }

    if (targetRegion.trim() === '') {
      newErrors.targetRegion = 'Target region is required';
    }

    setErrors(newErrors);

    // Only submit if valid
    if (Object.keys(newErrors).length === 0) {
      const trimmedUrl = website.trim();
      const trimmedName = companyName.trim();

      console.log(
        '[CompanyInput] Submitting - Name:',
        trimmedName,
        'URL:',
        trimmedUrl
      );

      // Clear any previous session data before starting new analysis
      sessionStorage.removeItem('companyData');
      sessionStorage.removeItem('companyAnalysisData');
      sessionStorage.removeItem('skipModelSelection');

      try {
        const apiClient = getAPIClient();

        // Call API with progress callback - pass values as-is
        const analysisData = await apiClient.analyzeCompany(
          {
            company_url: trimmedUrl,
            company_name: trimmedName,
            target_region: targetRegion.trim(),
          },
          onProgress
        );

        console.log('[CompanyInput] Analysis completed:', analysisData);
        console.log(
          '[CompanyInput] slug_id from response:',
          analysisData.slug_id
        );

        // Pass both company data and analysis data to parent
        onSubmit(
          {
            name: trimmedName,
            website: trimmedUrl,
            targetRegion: targetRegion.trim(),
          },
          analysisData
        );
      } catch (error) {
        console.error('[CompanyInput] Error during analysis:', error);

        // Format and log the error
        const formattedError = formatErrorMessage(error);
        logError(formattedError, {
          component: 'CompanyInput',
          action: 'analyzeCompany',
          companyUrl: trimmedUrl,
        });

        // Add helpful message for connection errors
        let errorMessage = formattedError.userMessage;
        if (
          errorMessage.includes('SSE connection') ||
          errorMessage.includes('Unable to connect')
        ) {
          errorMessage +=
            ' Make sure the backend API is running on http://localhost:8000 or switch to Mock mode for testing.';
        }

        // If onError callback provided, use it (for full-page error display)
        if (onError) {
          onError({...formattedError, userMessage: errorMessage});
        } else {
          // Otherwise, show inline error
          setErrors((prev) => ({
            ...prev,
            api: errorMessage,
          }));
        }
      }
    }
  };

  const handleRetry = () => {
    // Clear API error and allow retry
    setErrors((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {api, ...rest} = prev;
      return rest;
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value);
    // Clear error when user starts typing
    if (errors.name) {
      setErrors((prev) => ({...prev, name: undefined}));
    }
  };

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('[CompanyInput] Website input changed:', value);
    setWebsite(value);
    // Clear error when user starts typing
    if (errors.website) {
      setErrors((prev) => ({...prev, website: undefined}));
    }
  };

  const handleTargetRegionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetRegion(e.target.value);
    // Clear error when user starts typing
    if (errors.targetRegion) {
      setErrors((prev) => ({...prev, targetRegion: undefined}));
    }
  };

  return (
    <div className='relative flex items-center justify-center bg-background w-full h-full'>
      <div className='relative z-10 w-full'>
        {/* <BackgroundGradient className="rounded-[22px] p-1 bg-card"> */}
        <Card className='w-full bg-card border-0'>
          <CardHeader className='text-center space-y-3 pb-8'>
            <CardTitle className='text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent tracking-tight'>
              Analyze Your Brand&apos;s AI Visibility
            </CardTitle>
          </CardHeader>
          <CardContent className='pb-8'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='space-y-2'>
                <Label
                  htmlFor='company-name'
                  className='text-base font-semibold text-foreground'>
                  Brand Name
                </Label>
                <Input
                  id='company-name'
                  type='text'
                  placeholder='hello fresh'
                  value={companyName}
                  onChange={handleNameChange}
                  disabled={isLoading}
                  className={`bg-background text-foreground ${
                    errors.name ? 'border-destructive' : ''
                  }`}
                />
                {errors.name && (
                  <p className='text-sm text-destructive'>{errors.name}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='website'
                  className='text-base font-semibold text-foreground'>
                  Website URL
                </Label>
                <Input
                  id='website'
                  type='text'
                  placeholder='https://www.hellofresh.com'
                  value={website}
                  onChange={handleWebsiteChange}
                  disabled={isLoading}
                  className={`bg-background text-foreground ${
                    errors.website ? 'border-destructive' : ''
                  }`}
                />
                {errors.website && (
                  <p className='text-sm text-destructive'>{errors.website}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='target-region'
                  className='text-base font-semibold text-foreground'>
                  Target Region
                </Label>
                <Input
                  id='target-region'
                  type='text'
                  placeholder='e.g., North America, Europe, Asia'
                  value={targetRegion}
                  onChange={handleTargetRegionChange}
                  disabled={isLoading}
                  className={`bg-background text-foreground ${
                    errors.targetRegion ? 'border-destructive' : ''
                  }`}
                />
                {errors.targetRegion && (
                  <p className='text-sm text-destructive'>
                    {errors.targetRegion}
                  </p>
                )}
              </div>

              {errors.api && (
                <div className='space-y-2 p-3 bg-destructive/10 border border-destructive rounded-md'>
                  <p className='text-sm text-destructive'>{errors.api}</p>
                  <Button
                    type='button'
                    size='sm'
                    variant='outline'
                    onClick={handleRetry}
                    className='w-full'>
                    Retry
                  </Button>
                </div>
              )}

              <div className='pt-4'>
                <Button
                  type='submit'
                  size='lg'
                  disabled={!isValid || isLoading}
                  className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base py-6 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200'>
                  {isLoading ? 'Analyzing...' : 'Run Scan'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        {/* </BackgroundGradient> */}
      </div>
    </div>
  );
}

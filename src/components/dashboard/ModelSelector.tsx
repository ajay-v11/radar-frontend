'use client';

import * as React from 'react';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Loader2} from 'lucide-react';
import {GlowingStarsBackground} from '@/components/ui/glowing-stars';
import {getAPIClient} from '@/lib/api/client';
import {formatErrorMessage, logError} from '@/lib/api/errors';
import {getConnectionManager} from '@/lib/api/connection-manager';
import type {
  CompanyAnalysisData,
  VisibilityAnalysisData,
  SSEEvent,
} from '@/lib/api/types';
import type {FormattedError} from '@/lib/api/errors';

interface ModelSelectorProps {
  companyData?: {
    name: string;
    website: string;
  };
  analysisData?: CompanyAnalysisData;
  onSubmit: (models: string[], visibilityData: VisibilityAnalysisData) => void;
  onProgress?: (event: SSEEvent) => void;
  onError?: (error: FormattedError) => void;
  onBack: () => void;
  isLoading?: boolean;
}

const AI_MODELS = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: "OpenAI's conversational AI model",
  },
  {
    id: 'claude',
    name: 'Claude',
    description: "Anthropic's AI assistant",
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    description: 'AI-powered search engine',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    description: "Google's multimodal AI model",
  },
];

export function ModelSelector({
  companyData,
  analysisData,
  onSubmit,
  onProgress,
  onError,
  onBack,
  isLoading = false,
}: ModelSelectorProps) {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [numQueries, setNumQueries] = React.useState<number>(20);
  const [error, setError] = React.useState<string>('');

  // Cleanup SSE connections on unmount
  React.useEffect(() => {
    return () => {
      const apiClient = getAPIClient();
      // Clean up any active connections when component unmounts
      if (apiClient.getMode() === 'real') {
        getConnectionManager().cleanup('visibility-analysis');
      }
    };
  }, []);

  const handleToggle = (modelId: string) => {
    if (isLoading) return; // Prevent changes during loading

    setSelected((prev) => {
      if (prev.includes(modelId)) {
        // Remove if already selected
        return prev.filter((id) => id !== modelId);
      } else if (prev.length < 2) {
        // Add if less than 2 selected
        return [...prev, modelId];
      }
      // Don't add if already 2 selected
      return prev;
    });
  };

  const isValid = selected.length === 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isValid && !isLoading && companyData) {
      try {
        setError('');
        const apiClient = getAPIClient();

        // Call visibility analysis API
        const visibilityData = await apiClient.analyzeVisibility(
          {
            company_url: companyData.website,
            models: selected,
            num_queries: numQueries,
          },
          onProgress
        );

        onSubmit(selected, visibilityData);
      } catch (err) {
        // Format and log the error
        const formattedError = formatErrorMessage(err);
        logError(formattedError, {
          component: 'ModelSelector',
          action: 'analyzeVisibility',
          companyUrl: companyData.website,
          models: selected,
        });

        // If onError callback provided, use it (for full-page error display)
        if (onError) {
          onError(formattedError);
        } else {
          // Otherwise, show inline error
          setError(formattedError.userMessage);
        }
      }
    }
  };

  const handleRetry = () => {
    setError('');
  };

  return (
    <div className='relative min-h-screen flex items-center justify-center p-4 bg-background overflow-hidden'>
      <GlowingStarsBackground />

      <Card className='relative z-10 w-full max-w-md bg-card border-border'>
        <CardHeader className='text-center space-y-2'>
          <CardTitle className='text-2xl font-semibold text-foreground'>
            Select AI Models
          </CardTitle>
          {companyData && analysisData && (
            <div className='text-sm text-muted-foreground space-y-1'>
              <p className='font-medium text-foreground'>{companyData.name}</p>
              <p className='text-xs'>Industry: {analysisData.industry}</p>
            </div>
          )}
          <p className='text-sm text-muted-foreground'>
            Choose exactly 2 AI models to compare your brand visibility
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='num-queries' className='text-sm font-medium'>
                Number of Queries
              </Label>
              <input
                id='num-queries'
                type='number'
                min='5'
                max='50'
                value={numQueries}
                onChange={(e) => setNumQueries(parseInt(e.target.value) || 20)}
                disabled={isLoading}
                className='w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50'
              />
              <p className='text-xs text-muted-foreground'>
                Number of queries to test (5-50, default: 20)
              </p>
            </div>

            <div className='space-y-3'>
              {AI_MODELS.map((model) => {
                const isChecked = selected.includes(model.id);
                const isDisabled =
                  (!isChecked && selected.length >= 2) || isLoading;

                return (
                  <div
                    key={model.id}
                    className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors ${
                      isChecked
                        ? 'border-primary bg-primary/10'
                        : isDisabled
                        ? 'border-border bg-muted/50 opacity-50'
                        : 'border-border bg-muted/50 hover:border-primary/50'
                    }`}>
                    <Checkbox
                      id={model.id}
                      checked={isChecked}
                      onCheckedChange={() => handleToggle(model.id)}
                      disabled={isDisabled}
                      className='mt-1 shrink-0'
                    />
                    <div className='flex-1 min-w-0'>
                      <Label
                        htmlFor={model.id}
                        className={`text-base font-medium cursor-pointer block text-foreground ${
                          isDisabled ? 'cursor-not-allowed' : ''
                        }`}>
                        {model.name}
                      </Label>
                      <p className='text-sm text-muted-foreground mt-1'>
                        {model.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {selected.length !== 2 && (
              <div className='text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border border-border'>
                {selected.length === 0
                  ? 'Please select 2 AI models to continue'
                  : selected.length === 1
                  ? 'Please select 1 more AI model'
                  : 'Please select only 2 AI models'}
              </div>
            )}

            {error && (
              <div className='space-y-2 p-3 bg-destructive/10 border border-destructive rounded-md'>
                <p className='text-sm text-destructive'>{error}</p>
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

            <div className='flex gap-3 pt-2'>
              <Button
                type='button'
                variant='outline'
                size='lg'
                onClick={onBack}
                disabled={isLoading}
                className='flex-1'>
                Back
              </Button>
              <Button
                type='submit'
                size='lg'
                disabled={!isValid || isLoading}
                className='flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-50'>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Generating...
                  </>
                ) : (
                  'Generate Report'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

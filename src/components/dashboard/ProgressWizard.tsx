'use client';

import {Check, Loader2} from 'lucide-react';

interface CategoryProgress {
  name: string;
  status: 'pending' | 'loading' | 'complete';
}

interface ProgressWizardProps {
  currentStep: number;
  phase: 1 | 2;
  categories?: CategoryProgress[];
}

const PHASE_2_STEPS = [
  'Detecting Industry',
  'Generating Queries',
  'Testing AI Models',
];

export function ProgressWizard({
  currentStep,
  phase,
  categories = [],
}: ProgressWizardProps) {
  const STEPS = PHASE_2_STEPS;

  return (
    <div className='w-64 border-r border-border bg-card p-6'>
      <div className='space-y-6'>
        <div>
          <h3 className='text-sm font-semibold text-foreground mb-4'>
            Progress
          </h3>

          {/* Vertical Progress Steps */}
          <div className='space-y-4'>
            {STEPS.map((step, idx) => {
              const isComplete = idx < currentStep;
              const isCurrent = idx === currentStep;
              const isPending = idx > currentStep;

              return (
                <div key={idx} className='flex items-start gap-3'>
                  {/* Step Indicator */}
                  <div className='relative shrink-0'>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        isComplete
                          ? 'bg-primary border-primary'
                          : isCurrent
                          ? 'bg-primary/20 border-primary'
                          : 'bg-background border-border'
                      }`}>
                      {isComplete ? (
                        <Check className='h-4 w-4 text-primary-foreground' />
                      ) : isCurrent ? (
                        <Loader2 className='h-4 w-4 text-primary animate-spin' />
                      ) : (
                        <span className='text-xs text-muted-foreground'>
                          {idx + 1}
                        </span>
                      )}
                    </div>

                    {/* Connecting Line */}
                    {idx < STEPS.length - 1 && (
                      <div
                        className={`absolute left-4 top-8 w-0.5 h-8 -ml-px transition-all ${
                          isComplete ? 'bg-primary' : 'bg-border'
                        }`}
                      />
                    )}
                  </div>

                  {/* Step Label */}
                  <div className='flex-1 pt-1'>
                    <p
                      className={`text-sm font-medium ${
                        isComplete || isCurrent
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }`}>
                      {step}
                    </p>
                    {isCurrent && (
                      <p className='text-xs text-muted-foreground mt-1'>
                        In progress...
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Progress */}
        {categories.length > 0 && currentStep >= 2 && (
          <div className='pt-4 border-t border-border'>
            <h4 className='text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3'>
              Categories
            </h4>
            <div className='space-y-2'>
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
          </div>
        )}
      </div>
    </div>
  );
}

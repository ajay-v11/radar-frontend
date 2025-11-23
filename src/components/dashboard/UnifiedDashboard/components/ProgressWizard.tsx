'use client';

interface ProgressWizardProps {
  steps: string[];
  currentStep: number;
  isAnalyzing: boolean;
}

export function ProgressWizard({
  steps,
  currentStep,
  isAnalyzing,
}: ProgressWizardProps) {
  return (
    <div className="sticky top-4 rounded-lg border border-border bg-card/50 p-6 backdrop-blur-sm">
      <h3 className="mb-6 text-sm font-semibold text-muted-foreground">
        PROGRESS
      </h3>
      <div className="relative space-y-6">
        {/* Connecting Line */}
        <div className="absolute bottom-4 left-[15px] top-4 w-[2px] bg-border" />

        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isPending = index > currentStep;

          return (
            <div key={index} className="relative flex items-start gap-4">
              <div className="relative z-10">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isCompleted ? 'border-primary bg-primary' : ''
                  } ${
                    isActive
                      ? 'border-primary bg-primary shadow-lg shadow-primary/50'
                      : ''
                  } ${isPending ? 'border-border bg-background' : ''}`}>
                  {isActive && (
                    <div className="absolute inset-0 animate-ping rounded-full bg-primary opacity-75" />
                  )}
                  <div
                    className={`h-2 w-2 rounded-full ${
                      isCompleted || isActive
                        ? 'bg-primary-foreground'
                        : 'bg-muted-foreground'
                    }`}
                  />
                </div>
              </div>

              <div className="flex-1 pt-1">
                <span
                  className={`text-sm transition-colors duration-300 ${
                    isActive ? 'font-semibold text-foreground' : ''
                  } ${isCompleted ? 'text-muted-foreground' : ''} ${
                    isPending ? 'text-muted-foreground/50' : ''
                  }`}>
                  {step}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {isAnalyzing && (
        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          Processing...
        </div>
      )}
    </div>
  );
}

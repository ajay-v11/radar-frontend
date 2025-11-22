'use client';

import * as React from 'react';
import {useEffect, useState} from 'react';
import {GlowingStarsBackground} from '@/components/ui/glowing-stars';
import type {SSEEvent} from '@/lib/api/types';

interface LoadingWizardProps {
  onComplete?: () => void;
  duration?: number;
  startStep?: number;
  endStep?: number;
  sseEvents?: SSEEvent[];
  phase?: 1 | 2;
}

const PHASE_1_STEPS = ['Scraping Company Website', 'Analyzing Company Profile'];

const PHASE_2_STEPS = [
  'Detecting Industry',
  'Generating Buyer-Intent Queries',
  'Testing Across AI Models',
];

export function LoadingWizard({
  onComplete,
  duration = 24000,
  startStep = 0,
  endStep = 2,
  sseEvents = [],
  phase = 2,
}: LoadingWizardProps) {
  const [currentStep, setCurrentStep] = useState(startStep);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [batchProgress, setBatchProgress] = useState<{
    batchNum: number;
    progress: number;
  } | null>(null);

  const STEPS = phase === 1 ? PHASE_1_STEPS : PHASE_2_STEPS;
  const stepsToComplete = endStep - startStep + 1;
  const stepDuration = duration / stepsToComplete;

  // Handle SSE events to update progress
  useEffect(() => {
    if (sseEvents.length === 0) return;

    const latestEvent = sseEvents[sseEvents.length - 1];

    // Map SSE event steps to wizard steps
    if (phase === 1) {
      // Phase 1: Company Analysis
      if (latestEvent.step === 'scraping') {
        setCurrentStep(0);
        setCurrentMessage(latestEvent.message || 'Scraping company website...');
      } else if (latestEvent.step === 'analysis') {
        setCurrentStep(1);
        setCurrentMessage(
          latestEvent.message || 'Analyzing company profile...'
        );
      } else if (latestEvent.step === 'complete') {
        setCurrentStep(1);
        setCurrentMessage('Analysis complete!');
        if (onComplete) {
          setTimeout(() => onComplete(), 500);
        }
      }
    } else {
      // Phase 2: Visibility Analysis
      if (latestEvent.step === 'step1') {
        setCurrentStep(0);
        setCurrentMessage(latestEvent.message || 'Detecting industry...');
      } else if (latestEvent.step === 'step2') {
        setCurrentStep(1);
        setCurrentMessage(latestEvent.message || 'Generating queries...');
      } else if (latestEvent.step === 'step3' || latestEvent.step === 'batch') {
        setCurrentStep(2);

        // Handle batch progress
        if (latestEvent.step === 'batch' && latestEvent.data) {
          const batchData = latestEvent.data;
          setBatchProgress({
            batchNum: batchData.batch_num || 0,
            progress: batchData.progress || 0,
          });
          setCurrentMessage(
            latestEvent.message ||
              `Testing batch ${batchData.batch_num}... ${Math.round(
                batchData.progress || 0
              )}%`
          );
        } else {
          setCurrentMessage(
            latestEvent.message || 'Testing across AI models...'
          );
        }
      } else if (latestEvent.step === 'step4') {
        setCurrentStep(2);
        setCurrentMessage(latestEvent.message || 'Finalizing analysis...');
      } else if (latestEvent.step === 'complete') {
        setCurrentStep(2);
        setCurrentMessage('Analysis complete!');
        if (onComplete) {
          setTimeout(() => onComplete(), 500);
        }
      }
    }

    // Handle errors
    if (latestEvent.step === 'error') {
      setCurrentMessage(latestEvent.data?.error || 'An error occurred');
    }
  }, [sseEvents, phase, onComplete]);

  // Fallback timer-based progression if no SSE events
  useEffect(() => {
    if (sseEvents.length > 0) return; // Don't use timer if we have SSE events

    const timers: NodeJS.Timeout[] = [];

    // Progress through steps from startStep to endStep
    let stepIndex = 0;
    for (let i = startStep; i <= endStep; i++) {
      if (i > startStep) {
        stepIndex++;
        const timer = setTimeout(() => {
          setCurrentStep(i);
        }, stepDuration * stepIndex);
        timers.push(timer);
      }
    }

    // Complete after all steps
    const completeTimer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, duration);
    timers.push(completeTimer);

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [
    duration,
    stepDuration,
    onComplete,
    startStep,
    endStep,
    sseEvents.length,
  ]);

  return (
    <div className='relative min-h-screen flex items-center justify-center p-4 bg-background overflow-hidden'>
      <GlowingStarsBackground />

      <div className='relative z-10 w-full max-w-2xl'>
        <div className='space-y-8'>
          <h2 className='text-muted-foreground text-xl text-center'>
            Analyzing your brand's visibility...
          </h2>

          <div className='relative space-y-6 max-w-md mx-auto'>
            {/* Connecting Line */}
            <div className='absolute left-[15px] top-4 bottom-4 w-[2px] bg-border' />

            {STEPS.map((step, index) => {
              const isCompleted = index < currentStep;
              const isActive = index === currentStep;
              const isPending = index > currentStep;

              return (
                <div key={index} className='relative flex items-center gap-4'>
                  <div className='relative z-10'>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isCompleted ? 'bg-primary' : ''
                      } ${isActive ? 'bg-primary animate-pulse' : ''} ${
                        isPending ? 'bg-muted' : ''
                      }`}>
                      {isActive && (
                        <div className='absolute inset-0 rounded-full bg-primary animate-ping opacity-75' />
                      )}
                      <div className='w-3 h-3 rounded-full bg-background' />
                    </div>
                  </div>

                  <span
                    className={`text-lg transition-colors duration-300 ${
                      isActive ? 'text-foreground font-semibold' : ''
                    } ${isCompleted ? 'text-muted-foreground' : ''} ${
                      isPending ? 'text-muted-foreground/50' : ''
                    }`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>

          {currentMessage && (
            <p className='text-muted-foreground text-sm text-center'>
              {currentMessage}
            </p>
          )}

          {batchProgress && (
            <div className='text-center space-y-2'>
              <p className='text-muted-foreground text-sm'>
                Batch {batchProgress.batchNum} -{' '}
                {Math.round(batchProgress.progress)}% complete
              </p>
              <div className='w-full max-w-md mx-auto bg-muted rounded-full h-2'>
                <div
                  className='bg-primary h-2 rounded-full transition-all duration-300'
                  style={{width: `${batchProgress.progress}%`}}
                />
              </div>
            </div>
          )}

          {!currentMessage && (
            <p className='text-muted-foreground text-sm text-center animate-pulse'>
              This will just take a moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

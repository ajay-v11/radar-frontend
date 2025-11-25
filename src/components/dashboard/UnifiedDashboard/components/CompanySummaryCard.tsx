'use client';

import {useState} from 'react';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {CompanyAnalysisModal} from './CompanyAnalysisModal';
import type {CompanyData} from '@/lib/types';
import type {CompanyAnalysisData} from '@/lib/api/types';

interface CompanySummaryCardProps {
  companyAnalysis: CompanyAnalysisData;
  companyData: CompanyData;
  selectedModels: string[];
  wizardStep: number;
}

export function CompanySummaryCard({
  companyAnalysis,
  companyData,
  selectedModels,
  wizardStep,
}: CompanySummaryCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card className='opacity-100 transition-all duration-500'>
        <CardContent className='p-4'>
          <div className='grid gap-4 md:grid-cols-12'>
            {/* Company Info */}
            <div className='space-y-2 md:col-span-3'>
              <div>
                <div className='text-xs font-medium text-muted-foreground'>
                  COMPANY
                </div>
                <div className='text-lg font-bold'>
                  {companyAnalysis.company_name}
                </div>
              </div>
              <div>
                <div className='text-xs text-muted-foreground'>Industry</div>
                <div className='text-sm font-medium capitalize'>
                  {companyAnalysis.industry}
                </div>
              </div>
              <div>
                <div className='text-xs text-muted-foreground'>Website</div>
                <div className='truncate text-xs text-primary'>
                  {companyData.website}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className='flex flex-col justify-center border-l border-border pl-4 md:col-span-4'>
              <div className='mb-1 text-xs font-medium text-muted-foreground'>
                DESCRIPTION
              </div>
              <p className='line-clamp-3 text-sm leading-relaxed text-muted-foreground'>
                {companyAnalysis.company_description}
              </p>
            </div>

            {/* Competitors */}
            {companyAnalysis.competitors &&
              companyAnalysis.competitors.length > 0 && (
                <div className='flex flex-col border-l border-border pl-4 md:col-span-3'>
                  <div className='mb-2 text-xs font-medium text-muted-foreground'>
                    COMPETITORS
                  </div>
                  <div className='flex flex-wrap gap-1'>
                    {companyAnalysis.competitors.map(
                      (competitor: string, index: number) => (
                        <div
                          key={index}
                          className='whitespace-nowrap rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs font-medium'>
                          {competitor}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Selected Models */}
            {wizardStep >= 1 && selectedModels.length > 0 && (
              <div className='flex flex-col border-l border-border pl-4 md:col-span-2'>
                <div className='mb-2 text-xs font-medium text-muted-foreground'>
                  MODELS
                </div>
                <div className='flex flex-wrap gap-1'>
                  {selectedModels.map((model) => (
                    <div
                      key={model}
                      className='whitespace-nowrap rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium capitalize text-primary'>
                      {model}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Show All Button */}
          <div className='mt-4 flex justify-end'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setShowModal(true)}
              className='text-xs text-muted-foreground hover:text-foreground'>
              Show All Details
            </Button>
          </div>
        </CardContent>
      </Card>

      <CompanyAnalysisModal
        open={showModal}
        onOpenChange={setShowModal}
        data={companyAnalysis}
      />
    </>
  );
}

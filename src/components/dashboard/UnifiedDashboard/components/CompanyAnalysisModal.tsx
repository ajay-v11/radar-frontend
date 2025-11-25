'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type {CompanyAnalysisData} from '@/lib/api/types';

interface CompanyAnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CompanyAnalysisData;
}

export function CompanyAnalysisModal({
  open,
  onOpenChange,
  data,
}: CompanyAnalysisModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[85vh] p-0 flex flex-col overflow-hidden'>
        <DialogHeader className='px-6 pt-6 pb-4 shrink-0'>
          <DialogTitle className='text-2xl font-bold'>
            {data.company_name} - Complete Analysis
          </DialogTitle>
        </DialogHeader>
        <div className='overflow-y-auto flex-1 px-6 pb-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30'>
          <div className='space-y-6'>
            {/* Basic Info */}
            <Section title='Company Overview'>
              <InfoRow label='Company Name' value={data.company_name} />
              <InfoRow label='Industry' value={data.industry} />
              {data.broad_category && (
                <InfoRow label='Category' value={data.broad_category} />
              )}
              <InfoRow label='Target Region' value={data.target_region} />
              {data.company_url && (
                <InfoRow label='Website' value={data.company_url} link />
              )}
            </Section>

            {/* Description */}
            <Section title='Description'>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                {data.industry_description || data.company_description}
              </p>
            </Section>

            {/* Brand Positioning */}
            {data.brand_positioning && (
              <Section title='Brand Positioning'>
                <InfoRow
                  label='Value Proposition'
                  value={data.brand_positioning.value_proposition}
                />
                <InfoRow
                  label='Price Positioning'
                  value={data.brand_positioning.price_positioning}
                  capitalize
                />
                {data.brand_positioning.differentiators.length > 0 && (
                  <div className='space-y-1'>
                    <div className='text-xs font-medium text-muted-foreground'>
                      Differentiators
                    </div>
                    <ul className='list-disc list-inside text-sm space-y-1'>
                      {data.brand_positioning.differentiators.map(
                        (diff, idx) => (
                          <li key={idx}>{diff}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </Section>
            )}

            {/* Target Audience */}
            {data.target_audience && (
              <Section title='Target Audience'>
                <p className='text-sm'>{data.target_audience}</p>
              </Section>
            )}

            {/* Competitors */}
            {data.competitors && data.competitors.length > 0 && (
              <Section title='Competitors'>
                <div className='flex flex-wrap gap-2'>
                  {data.competitors.map((competitor, idx) => (
                    <div
                      key={idx}
                      className='px-3 py-1.5 rounded-md border border-border bg-muted/50 text-sm font-medium'>
                      {competitor}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Competitors Data (Detailed) */}
            {data.competitors_data && data.competitors_data.length > 0 && (
              <Section title='Competitor Analysis'>
                <div className='space-y-3'>
                  {data.competitors_data.map((competitor, idx: number) => (
                    <div
                      key={idx}
                      className='p-3 rounded-lg border border-border bg-muted/30'>
                      <div className='font-semibold text-sm mb-1'>
                        {competitor.name}
                      </div>
                      <p className='text-xs text-muted-foreground mb-2'>
                        {competitor.description}
                      </p>
                      <div className='grid grid-cols-2 gap-2 text-xs'>
                        <div>
                          <span className='text-muted-foreground'>
                            Products:{' '}
                          </span>
                          <span>{competitor.products}</span>
                        </div>
                        <div>
                          <span className='text-muted-foreground'>
                            Price Tier:{' '}
                          </span>
                          <span className='capitalize'>
                            {competitor.price_tier}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Product Category */}
            {data.product_category && (
              <Section title='Product Category'>
                <p className='text-sm font-medium'>{data.product_category}</p>
              </Section>
            )}

            {/* Market Keywords */}
            {data.market_keywords && data.market_keywords.length > 0 && (
              <Section title='Market Keywords'>
                <div className='flex flex-wrap gap-2'>
                  {data.market_keywords.map((keyword, idx) => (
                    <div
                      key={idx}
                      className='px-2 py-1 rounded-md bg-primary/10 text-xs font-medium text-primary'>
                      {keyword}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Query Categories */}
            {data.query_categories_template && (
              <Section title='Query Categories'>
                <div className='space-y-3'>
                  {Object.entries(data.query_categories_template).map(
                    ([key, category]) => (
                      <div
                        key={key}
                        className='p-3 rounded-lg border border-border bg-muted/30'>
                        <div className='flex items-center justify-between mb-1'>
                          <div className='font-semibold text-sm'>
                            {category.name}
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            Weight: {(category.weight * 100).toFixed(0)}%
                          </div>
                        </div>
                        <p className='text-xs text-muted-foreground mb-2'>
                          {category.description}
                        </p>
                        {category.examples && category.examples.length > 0 && (
                          <div className='flex flex-wrap gap-1'>
                            {category.examples.map(
                              (example: string, idx: number) => (
                                <div
                                  key={idx}
                                  className='px-2 py-0.5 rounded-md bg-background text-xs'>
                                  {example}
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </Section>
            )}

            {/* Buyer Intent Signals */}
            {data.buyer_intent_signals && (
              <Section title='Buyer Intent Signals'>
                {data.buyer_intent_signals.common_questions.length > 0 && (
                  <div className='space-y-1 mb-4'>
                    <div className='text-xs font-medium text-muted-foreground'>
                      Common Questions
                    </div>
                    <ul className='list-disc list-inside text-sm space-y-1'>
                      {data.buyer_intent_signals.common_questions.map(
                        (q, idx) => (
                          <li key={idx}>{q}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
                {data.buyer_intent_signals.decision_factors.length > 0 && (
                  <div className='space-y-1 mb-4'>
                    <div className='text-xs font-medium text-muted-foreground'>
                      Decision Factors
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      {data.buyer_intent_signals.decision_factors.map(
                        (factor, idx) => (
                          <div
                            key={idx}
                            className='px-2 py-1 rounded-md bg-muted text-xs'>
                            {factor}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
                {data.buyer_intent_signals.pain_points.length > 0 && (
                  <div className='space-y-1'>
                    <div className='text-xs font-medium text-muted-foreground'>
                      Pain Points
                    </div>
                    <ul className='list-disc list-inside text-sm space-y-1'>
                      {data.buyer_intent_signals.pain_points.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Section>
            )}

            {/* Industry Specific Data */}
            {data.industry_specific &&
              Object.keys(data.industry_specific).length > 0 && (
                <Section title='Industry-Specific Metrics'>
                  <div className='grid grid-cols-2 gap-3'>
                    {Object.entries(data.industry_specific).map(
                      ([key, value]) => (
                        <InfoRow
                          key={key}
                          label={key
                            .split('_')
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(' ')}
                          value={String(value)}
                        />
                      )
                    )}
                  </div>
                </Section>
              )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className='space-y-3'>
      <h3 className='text-sm font-semibold text-foreground uppercase tracking-wide'>
        {title}
      </h3>
      <div className='space-y-2'>{children}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  link = false,
  capitalize = false,
}: {
  label: string;
  value: string;
  link?: boolean;
  capitalize?: boolean;
}) {
  return (
    <div className='space-y-0.5'>
      <div className='text-xs font-medium text-muted-foreground'>{label}</div>
      {link ? (
        <a
          href={value}
          target='_blank'
          rel='noopener noreferrer'
          className='text-sm text-primary hover:underline'>
          {value}
        </a>
      ) : (
        <div className={`text-sm ${capitalize ? 'capitalize' : ''}`}>
          {value}
        </div>
      )}
    </div>
  );
}

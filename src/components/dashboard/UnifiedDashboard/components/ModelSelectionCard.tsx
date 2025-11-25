'use client';

import {InlineModelSelector} from '../../InlineModelSelector';

interface ModelSelectionCardProps {
  onSubmit: (models: string[], numQueries: number, llmProvider: string) => void;
  selectedModels: string[];
}

export function ModelSelectionCard({
  onSubmit,
  selectedModels,
}: ModelSelectionCardProps) {
  return (
    <div className='opacity-100 transition-all duration-500 animate-subtle-jiggle'>
      <div className='relative rounded-lg'>
        {/* Glow effect */}
        <div className='absolute -inset-0.5 bg-linear-to-r from-primary/50 via-primary/30 to-primary/50 rounded-lg blur-sm animate-pulse-glow' />

        {/* Content */}
        <div className='relative'>
          <InlineModelSelector
            onSubmit={onSubmit}
            selectedModels={selectedModels}
          />
        </div>
      </div>
    </div>
  );
}

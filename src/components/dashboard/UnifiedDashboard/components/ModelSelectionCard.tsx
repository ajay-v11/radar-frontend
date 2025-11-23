'use client';

import {InlineModelSelector} from '../../InlineModelSelector';

interface ModelSelectionCardProps {
  onSubmit: (models: string[], numQueries: number) => void;
  selectedModels: string[];
}

export function ModelSelectionCard({
  onSubmit,
  selectedModels,
}: ModelSelectionCardProps) {
  return (
    <div className="opacity-100 transition-all duration-500">
      <InlineModelSelector onSubmit={onSubmit} selectedModels={selectedModels} />
    </div>
  );
}

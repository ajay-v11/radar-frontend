'use client';

import {VisibilityScoreBento} from './VisibilityScoreBento';
import {ModelPerformanceBento} from './ModelPerformanceBento';

interface VisibilityMetricsGridProps {
  visibilityData: any;
  selectedModels: string[];
}

export function VisibilityMetricsGrid({
  visibilityData,
}: VisibilityMetricsGridProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Visibility Score */}
      <div className="lg:col-span-2">
        <VisibilityScoreBento
          visibilityScore={visibilityData.visibility_score}
          totalMentions={visibilityData.analysis_report?.total_mentions || 0}
          totalQueries={visibilityData.total_queries || 0}
          mentionRate={visibilityData.analysis_report?.mention_rate || 0}
        />
      </div>

      {/* Model Performance */}
      {visibilityData.analysis_report?.by_model && (
        <div className="lg:col-span-3">
          <ModelPerformanceBento
            modelData={visibilityData.analysis_report.by_model}
          />
        </div>
      )}
    </div>
  );
}

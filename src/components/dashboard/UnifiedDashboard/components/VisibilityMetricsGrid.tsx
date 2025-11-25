'use client';

import {VisibilityScoreBento} from './VisibilityScoreBento';
import {ModelPerformanceBento} from './ModelPerformanceBento';
import {CategoryBreakdownCard} from './CategoryBreakdownCard';
import {ModelCategoryMatrixCard} from './ModelCategoryMatrixCard';
import {
  VisibilityScoreSkeleton,
  ModelPerformanceSkeleton,
} from './VisibilityMetricsSkeleton';
import {StreamingProgress, VisibilityAnalysisData} from '@/lib/api/types';

interface VisibilityMetricsGridProps {
  visibilityData: VisibilityAnalysisData | null;
  selectedModels: string[];
  streamingProgress?: StreamingProgress;
  isStreaming?: boolean;
}

export function VisibilityMetricsGrid({
  visibilityData,
  streamingProgress,
  isStreaming = false,
}: VisibilityMetricsGridProps) {
  // Determine what data to display based on streaming state
  const displayData =
    isStreaming && streamingProgress
      ? {
          visibilityScore: streamingProgress.partialVisibilityScore,
          totalMentions: 0, // Will be updated from category breakdown
          totalQueries: 0, // Will be updated from category breakdown
          mentionRate: 0,
          modelScores: streamingProgress.partialModelScores,
          categoryBreakdown: streamingProgress.categoryBreakdown,
          isPartial: true,
          completedCategories: streamingProgress.completedCategories,
          totalCategories: streamingProgress.totalCategories,
        }
      : visibilityData
      ? {
          visibilityScore: visibilityData.visibility_score,
          totalMentions: visibilityData.total_mentions || 0,
          totalQueries: visibilityData.total_queries || 0,
          mentionRate:
            visibilityData.total_queries && visibilityData.total_queries > 0
              ? (visibilityData.total_mentions || 0) /
                visibilityData.total_queries
              : 0,
          modelScores: visibilityData.model_scores || {},
          categoryBreakdown: visibilityData.category_breakdown || [],
          modelData: visibilityData.analysis_report?.by_model,
          isPartial: false,
        }
      : null;

  // Calculate totals from category breakdown for streaming
  if (displayData?.isPartial && streamingProgress) {
    displayData.totalQueries = streamingProgress.categoryBreakdown.reduce(
      (sum, cat) => sum + cat.queries,
      0
    );
    displayData.totalMentions = streamingProgress.categoryBreakdown.reduce(
      (sum, cat) => sum + cat.mentions,
      0
    );
    displayData.mentionRate =
      displayData.totalQueries > 0
        ? displayData.totalMentions / displayData.totalQueries
        : 0;
  }

  // Show loading skeletons during initial connection (streaming but no data yet)
  const showLoadingSkeletons =
    isStreaming &&
    (!streamingProgress ||
      (streamingProgress.completedCategories === 0 &&
        streamingProgress.totalCategories === 0));

  if (showLoadingSkeletons) {
    return (
      <div className='space-y-6'>
        {/* Top Row: Loading Skeletons */}
        <div className='grid gap-6 lg:grid-cols-5'>
          {/* Visibility Score Skeleton */}
          <div className='lg:col-span-2'>
            <VisibilityScoreSkeleton />
          </div>

          {/* Model Performance Skeleton */}
          <div className='lg:col-span-3'>
            <ModelPerformanceSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!displayData) {
    return null;
  }

  return (
    <div className='space-y-6'>
      {/* Top Row: Visibility Score and Model Performance */}
      <div className='grid gap-6 lg:grid-cols-5 animate-in fade-in duration-500'>
        {/* Visibility Score */}
        <div className='lg:col-span-2'>
          <VisibilityScoreBento
            visibilityScore={displayData.visibilityScore}
            totalMentions={displayData.totalMentions}
            totalQueries={displayData.totalQueries}
            mentionRate={displayData.mentionRate}
            isStreaming={isStreaming}
            completedCategories={displayData.completedCategories}
            totalCategories={displayData.totalCategories}
          />
        </div>

        {/* Model Performance */}
        {(displayData.modelData ||
          Object.keys(displayData.modelScores || {}).length > 0) && (
          <div className='lg:col-span-3'>
            <ModelPerformanceBento
              modelData={displayData.modelData}
              modelScores={displayData.modelScores}
              isStreaming={isStreaming}
              categoryBreakdown={displayData.categoryBreakdown}
              totalQueries={displayData.totalQueries}
              totalMentions={displayData.totalMentions}
            />
          </div>
        )}
      </div>

      {/* Category Breakdown - Show when streaming completes or data is available */}
      {!isStreaming &&
        displayData.categoryBreakdown &&
        displayData.categoryBreakdown.length > 0 && (
          <div className='animate-in fade-in slide-in-from-bottom-4 duration-700'>
            <CategoryBreakdownCard
              categoryBreakdown={displayData.categoryBreakdown}
            />
          </div>
        )}

      {/* Model-Category Matrix - Show when streaming completes and matrix has data */}
      {!isStreaming &&
        visibilityData?.model_category_matrix &&
        Object.keys(visibilityData.model_category_matrix).length > 0 &&
        Object.values(visibilityData.model_category_matrix).some((modelData) =>
          Object.values(modelData).some((score) => score > 0)
        ) && (
          <div className='animate-in fade-in slide-in-from-bottom-4 duration-700 animation-delay-200'>
            <ModelCategoryMatrixCard
              modelCategoryMatrix={visibilityData.model_category_matrix}
            />
          </div>
        )}
    </div>
  );
}

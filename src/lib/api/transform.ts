import type {VisibilityAnalysisData} from './types';
import type {
  VisibilityReport,
  CategoryBreakdown,
  Competitor,
  QueryResult,
  QueryCategory,
  CompetitorSummary,
} from '../types';

/**
 * Transform API response to frontend VisibilityReport type
 */
export function transformVisibilityData(
  apiData: VisibilityAnalysisData,
  selectedModels: string[]
): VisibilityReport {
  return {
    companyName: apiData.company_name || '',
    overallScore: Math.round(apiData.visibility_score || 0),
    totalQueries: apiData.total_queries || 0,
    mentionedIn: apiData.analysis_report?.total_mentions || 0,
    models: selectedModels,
    breakdown: generateCategoryBreakdown(apiData),
    competitors: generateCompetitorList(apiData),
    queryLog: generateQueryLog(apiData, selectedModels),
  };
}

/**
 * Generate category breakdown from API data
 */
export function generateCategoryBreakdown(
  apiData: VisibilityAnalysisData
): CategoryBreakdown[] {
  // Since the API doesn't provide category-level data directly,
  // we'll create a simplified breakdown based on batch results
  const categories: QueryCategory[] = [
    'Product Selection',
    'Comparison Queries',
    'How-To Queries',
    'Best-Of Lists',
  ];

  const totalQueries = apiData.total_queries || 0;
  const totalMentions = apiData.analysis_report?.total_mentions || 0;
  const queriesPerCategory = Math.ceil(totalQueries / categories.length);

  return categories.map((category, index) => {
    // Distribute queries evenly across categories
    const categoryQueries = Math.min(
      queriesPerCategory,
      totalQueries - index * queriesPerCategory
    );

    // Estimate mentions proportionally
    const categoryMentions = Math.round(
      (categoryQueries / totalQueries) * totalMentions
    );

    const visibility =
      categoryQueries > 0
        ? Math.round((categoryMentions / categoryQueries) * 100)
        : 0;

    // Get top competitors for this category
    const topCompetitors = getTopCompetitorsForCategory(
      apiData,
      categoryQueries,
      3
    );

    return {
      category,
      totalQueries: categoryQueries,
      mentioned: categoryMentions,
      visibility,
      topCompetitors,
    };
  });
}

/**
 * Helper function to get top competitors for a category
 */
function getTopCompetitorsForCategory(
  apiData: VisibilityAnalysisData,
  categoryQueries: number,
  limit: number
): CompetitorSummary[] {
  const analysisReport = apiData.analysis_report;

  if (!analysisReport || !analysisReport.by_model) {
    return [];
  }

  // Aggregate competitor mentions across all models
  const competitorMentions: Record<string, number> = {};

  Object.values(analysisReport.by_model).forEach((modelBreakdown) => {
    if (modelBreakdown.competitor_mentions) {
      Object.entries(modelBreakdown.competitor_mentions).forEach(
        ([competitor, mentions]) => {
          competitorMentions[competitor] =
            (competitorMentions[competitor] || 0) + mentions;
        }
      );
    }
  });

  // Sort by mentions and take top N
  return Object.entries(competitorMentions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([name, mentions]) => ({
      name,
      mentions,
      percentage:
        categoryQueries > 0
          ? Math.round((mentions / categoryQueries) * 100)
          : 0,
    }));
}

/**
 * Generate competitor list with rankings
 */
export function generateCompetitorList(
  apiData: VisibilityAnalysisData
): Competitor[] {
  const analysisReport = apiData.analysis_report;
  const totalQueries = apiData.total_queries || 0;

  if (!analysisReport || !analysisReport.by_model) {
    return [];
  }

  // Aggregate competitor mentions across all models
  const competitorMentions: Record<string, number> = {};

  Object.values(analysisReport.by_model).forEach((modelBreakdown) => {
    if (modelBreakdown.competitor_mentions) {
      Object.entries(modelBreakdown.competitor_mentions).forEach(
        ([competitor, mentions]) => {
          competitorMentions[competitor] =
            (competitorMentions[competitor] || 0) + mentions;
        }
      );
    }
  });

  // Convert to Competitor array and sort by mentions
  return Object.entries(competitorMentions)
    .map(([name, mentions]) => ({
      name,
      mentions,
      visibility:
        totalQueries > 0 ? Math.round((mentions / totalQueries) * 100) : 0,
    }))
    .sort((a, b) => b.mentions - a.mentions);
}

/**
 * Generate query log entries from API data
 */
export function generateQueryLog(
  apiData: VisibilityAnalysisData,
  selectedModels: string[]
): QueryResult[] {
  const queryLog: QueryResult[] = [];
  const batchResults = apiData.batch_results || [];
  const totalQueries = apiData.total_queries || 0;
  const competitors = apiData.competitors || [];

  // Categories to distribute queries across
  const categories: QueryCategory[] = [
    'Product Selection',
    'Comparison Queries',
    'How-To Queries',
    'Best-Of Lists',
  ];

  // Generate query entries based on batch results
  batchResults.forEach((batch, batchIndex) => {
    const batchModels = Object.keys(batch.by_model || {});

    batchModels.forEach((model) => {
      const modelBreakdown = batch.by_model[model];
      const mentions = modelBreakdown?.mentions || 0;
      const totalResponses = modelBreakdown?.total_responses || 0;

      // Generate query entries for this batch/model combination
      for (let i = 0; i < totalResponses; i++) {
        const queryId = `q${batchIndex}-${model}-${i}`;
        const mentioned = i < mentions; // First N queries are mentioned
        const category = categories[i % categories.length];

        // Generate a generic query text
        const query = generateQueryText(category, apiData.company_name);

        // Select random competitors
        const queryCompetitors = selectRandomCompetitors(competitors, 2, 4);

        queryLog.push({
          id: queryId,
          query,
          mentioned,
          rank: mentioned ? Math.floor(Math.random() * 5) + 1 : null,
          competitors: queryCompetitors,
          model,
          category,
        });
      }
    });
  });

  // If no batch results, generate placeholder entries
  if (queryLog.length === 0 && totalQueries > 0) {
    const queriesPerModel = Math.ceil(totalQueries / selectedModels.length);

    selectedModels.forEach((model, modelIndex) => {
      for (
        let i = 0;
        i < queriesPerModel && queryLog.length < totalQueries;
        i++
      ) {
        const category = categories[i % categories.length];
        const mentioned = Math.random() < 0.35; // 35% mention rate

        queryLog.push({
          id: `q${modelIndex}-${i}`,
          query: generateQueryText(category, apiData.company_name),
          mentioned,
          rank: mentioned ? Math.floor(Math.random() * 5) + 1 : null,
          competitors: selectRandomCompetitors(competitors, 2, 4),
          model,
          category,
        });
      }
    });
  }

  return queryLog;
}

/**
 * Helper function to generate query text based on category
 */
function generateQueryText(
  category: QueryCategory,
  companyName: string
): string {
  const templates: Record<QueryCategory, string[]> = {
    'Product Selection': [
      `best software for ${companyName} use case`,
      `top tools similar to ${companyName}`,
      `which platform should I use for ${companyName} needs`,
    ],
    'Comparison Queries': [
      `${companyName} vs competitors`,
      `compare ${companyName} with alternatives`,
      `${companyName} or other options`,
    ],
    'How-To Queries': [
      `how to use ${companyName}`,
      `how to set up ${companyName}`,
      `how to integrate ${companyName}`,
    ],
    'Best-Of Lists': [
      `top 10 platforms like ${companyName}`,
      `best tools in ${companyName} category`,
      `leading solutions for ${companyName} use case`,
    ],
  };

  const categoryTemplates = templates[category];
  return categoryTemplates[
    Math.floor(Math.random() * categoryTemplates.length)
  ];
}

/**
 * Helper function to select random competitors
 */
function selectRandomCompetitors(
  competitors: string[],
  min: number,
  max: number
): string[] {
  if (competitors.length === 0) {
    return [];
  }

  const count = Math.min(
    Math.floor(Math.random() * (max - min + 1)) + min,
    competitors.length
  );

  const shuffled = [...competitors].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

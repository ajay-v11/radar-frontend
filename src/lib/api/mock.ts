import {
  CompanyAnalysisRequest,
  CompanyAnalysisData,
  VisibilityAnalysisRequest,
  VisibilityAnalysisData,
  SSEEvent,
  CompetitorData,
  ModelBreakdown,
  BatchResult,
  AnalysisReport,
} from './types';

export class MockAPIClient {
  /**
   * Analyze a company and return mock data
   */
  async analyzeCompany(
    request: CompanyAnalysisRequest,
    onProgress?: (event: SSEEvent) => void
  ): Promise<CompanyAnalysisData> {
    // Simulate realistic delay
    await this.delay(800);

    const mockData = this.generateMockCompanyData(request);

    // If progress callback provided, simulate SSE events
    if (onProgress) {
      await this.simulatePhase1SSEStream(mockData, onProgress);
    }

    return mockData;
  }

  /**
   * Analyze visibility and return mock data
   */
  async analyzeVisibility(
    request: VisibilityAnalysisRequest,
    onProgress?: (event: SSEEvent) => void
  ): Promise<VisibilityAnalysisData> {
    // Simulate realistic delay
    await this.delay(1000);

    const mockData = this.generateMockVisibilityData(request);

    // If progress callback provided, simulate SSE events
    if (onProgress) {
      await this.simulatePhase2SSEStream(mockData, onProgress);
    }

    return mockData;
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<{status: string; version: string}> {
    await this.delay(100);
    return {
      status: 'healthy',
      version: '1.0.0-mock',
    };
  }

  /**
   * Generate realistic mock company data
   */
  private generateMockCompanyData(
    request: CompanyAnalysisRequest
  ): CompanyAnalysisData {
    const companyName =
      request.company_name ||
      this.extractCompanyNameFromUrl(request.company_url);

    const industries = [
      'Software Development',
      'E-commerce',
      'Financial Services',
      'Healthcare Technology',
      'Cloud Computing',
      'Artificial Intelligence',
      'Cybersecurity',
      'Marketing Technology',
    ];

    const industry = industries[Math.floor(Math.random() * industries.length)];

    const competitors = this.generateCompetitors(industry, 5);
    const competitorsData = competitors.map((name) =>
      this.generateCompetitorData(name, industry)
    );

    return {
      industry,
      company_name: companyName,
      company_description: `${companyName} is a leading company in the ${industry} sector, providing innovative solutions to businesses worldwide.`,
      company_summary: `${companyName} specializes in ${industry.toLowerCase()} with a focus on innovation and customer success.`,
      competitors,
      competitors_data: competitorsData,
    };
  }

  /**
   * Generate realistic mock visibility data
   */
  private generateMockVisibilityData(
    request: VisibilityAnalysisRequest
  ): VisibilityAnalysisData {
    const companyName =
      request.company_name ||
      this.extractCompanyNameFromUrl(request.company_url);
    const numQueries = request.num_queries || 50;
    const models = request.models || ['gpt-4', 'claude-3', 'gemini-pro'];
    const batchSize = request.batch_size || 10;
    const numBatches = Math.ceil(numQueries / batchSize);

    const industry = 'Software Development';
    const competitors = this.generateCompetitors(industry, 5);

    // Generate batch results
    const batchResults: BatchResult[] = [];
    for (let i = 1; i <= numBatches; i++) {
      batchResults.push(this.generateBatchResult(i, models, competitors));
    }

    // Aggregate results
    const totalResponses = numQueries * models.length;
    const totalMentions = batchResults.reduce(
      (sum, batch) => sum + batch.total_mentions,
      0
    );
    const visibilityScore = Math.round((totalMentions / totalResponses) * 100);

    // Generate model breakdowns
    const byModel: Record<string, ModelBreakdown> = {};
    models.forEach((model) => {
      const modelMentions = batchResults.reduce(
        (sum, batch) => sum + (batch.by_model[model]?.mentions || 0),
        0
      );
      const modelResponses = numQueries;
      const competitorMentions: Record<string, number> = {};
      competitors.forEach((comp) => {
        competitorMentions[comp] = Math.floor(Math.random() * 10);
      });

      byModel[model] = {
        mentions: modelMentions,
        total_responses: modelResponses,
        mention_rate: modelMentions / modelResponses,
        competitor_mentions: competitorMentions,
      };
    });

    const analysisReport: AnalysisReport = {
      total_mentions: totalMentions,
      mention_rate: totalMentions / totalResponses,
      by_model: byModel,
      sample_mentions: this.generateSampleMentions(companyName, 5),
    };

    return {
      industry,
      company_name: companyName,
      competitors,
      total_queries: numQueries,
      total_responses: totalResponses,
      visibility_score: visibilityScore,
      analysis_report: analysisReport,
      batch_results: batchResults,
    };
  }

  /**
   * Generate a batch result
   */
  private generateBatchResult(
    batchNum: number,
    models: string[],
    competitors: string[]
  ): BatchResult {
    const byModel: Record<string, ModelBreakdown> = {};

    models.forEach((model) => {
      const mentions = Math.floor(Math.random() * 8) + 2;
      const totalResponses = 10;
      const competitorMentions: Record<string, number> = {};
      competitors.forEach((comp) => {
        competitorMentions[comp] = Math.floor(Math.random() * 3);
      });

      byModel[model] = {
        mentions,
        total_responses: totalResponses,
        mention_rate: mentions / totalResponses,
        competitor_mentions: competitorMentions,
      };
    });

    const totalMentions = Object.values(byModel).reduce(
      (sum, breakdown) => sum + breakdown.mentions,
      0
    );
    const totalResponses = Object.values(byModel).reduce(
      (sum, breakdown) => sum + breakdown.total_responses,
      0
    );
    const visibilityScore = Math.round((totalMentions / totalResponses) * 100);

    return {
      batch_num: batchNum,
      visibility_score: visibilityScore,
      total_mentions: totalMentions,
      by_model: byModel,
    };
  }

  /**
   * Generate competitor names
   */
  private generateCompetitors(industry: string, count: number): string[] {
    const prefixes = [
      'Tech',
      'Cloud',
      'Data',
      'Smart',
      'Digital',
      'Cyber',
      'AI',
    ];
    const suffixes = [
      'Labs',
      'Systems',
      'Solutions',
      'Corp',
      'Inc',
      'Tech',
      'AI',
    ];

    const competitors: string[] = [];
    for (let i = 0; i < count; i++) {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      competitors.push(`${prefix}${suffix}`);
    }
    return competitors;
  }

  /**
   * Generate competitor data
   */
  private generateCompetitorData(
    name: string,
    industry: string
  ): CompetitorData {
    return {
      name,
      description: `${name} is a competitor in the ${industry} space.`,
      products: `${name} offers various products and services in ${industry.toLowerCase()}.`,
      positioning: `${name} positions itself as an innovative leader in the market.`,
    };
  }

  /**
   * Generate sample mentions
   */
  private generateSampleMentions(companyName: string, count: number): string[] {
    const templates = [
      `${companyName} offers excellent solutions for enterprise needs.`,
      `I recommend checking out ${companyName} for their innovative approach.`,
      `${companyName} has been a leader in this space for years.`,
      `Many companies trust ${companyName} for their critical operations.`,
      `${companyName} provides comprehensive tools and services.`,
    ];

    return templates.slice(0, count);
  }

  /**
   * Extract company name from URL
   */
  private extractCompanyNameFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.replace('www.', '');
      const parts = hostname.split('.');
      const name = parts[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    } catch {
      return 'Company';
    }
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Simulate Phase 1 SSE stream (company analysis)
   */
  private async simulatePhase1SSEStream(
    data: CompanyAnalysisData,
    onProgress: (event: SSEEvent) => void
  ): Promise<void> {
    // Scraping started
    onProgress({
      step: 'scraping',
      status: 'started',
      message: 'Starting to scrape company website...',
    });

    await this.delay(600);

    // Scraping completed
    onProgress({
      step: 'scraping',
      status: 'completed',
      message: 'Website scraping completed',
      data: {content_length: 15000},
    });

    await this.delay(500);

    // Analysis started
    onProgress({
      step: 'analysis',
      status: 'started',
      message: 'Analyzing company data...',
    });

    await this.delay(800);

    // Analysis completed
    onProgress({
      step: 'analysis',
      status: 'completed',
      message: 'Company analysis completed',
      data,
    });

    await this.delay(300);

    // Complete
    onProgress({
      step: 'complete',
      status: 'success',
      message: 'Company analysis complete',
      data,
    });
  }

  /**
   * Simulate Phase 2 SSE stream (visibility analysis)
   */
  private async simulatePhase2SSEStream(
    data: VisibilityAnalysisData,
    onProgress: (event: SSEEvent) => void
  ): Promise<void> {
    // Step 1: Industry detection
    onProgress({
      step: 'step1',
      status: 'started',
      message: 'Detecting industry and competitors...',
    });

    await this.delay(700);

    onProgress({
      step: 'step1',
      status: 'completed',
      message: 'Industry detection completed',
      data: {
        industry: data.industry,
        company_name: data.company_name,
        competitors: data.competitors,
      },
    });

    await this.delay(500);

    // Step 2: Query generation
    onProgress({
      step: 'step2',
      status: 'started',
      message: 'Generating queries...',
    });

    await this.delay(600);

    onProgress({
      step: 'step2',
      status: 'completed',
      message: 'Query generation completed',
      data: {
        total_queries: data.total_queries,
        categories: 5,
      },
    });

    await this.delay(500);

    // Step 3: Batch processing setup
    onProgress({
      step: 'step3',
      status: 'started',
      message: 'Setting up batch processing...',
    });

    await this.delay(400);

    onProgress({
      step: 'step3',
      status: 'completed',
      message: 'Batch processing ready',
    });

    await this.delay(300);

    // Batch events
    for (let i = 0; i < data.batch_results.length; i++) {
      const batch = data.batch_results[i];

      // Testing started
      onProgress({
        step: 'batch',
        status: 'testing_started',
        message: `Testing batch ${batch.batch_num}...`,
        data: {
          batch_num: batch.batch_num,
          batch_size: 10,
        },
      });

      await this.delay(800);

      // Testing completed
      onProgress({
        step: 'batch',
        status: 'testing_completed',
        message: `Batch ${batch.batch_num} testing completed`,
        data: {
          batch_num: batch.batch_num,
          progress: Math.round(((i + 0.5) / data.batch_results.length) * 100),
          responses_count: 10,
        },
      });

      await this.delay(500);

      // Analysis started
      onProgress({
        step: 'batch',
        status: 'analysis_started',
        message: `Analyzing batch ${batch.batch_num}...`,
        data: {
          batch_num: batch.batch_num,
        },
      });

      await this.delay(600);

      // Analysis completed
      onProgress({
        step: 'batch',
        status: 'analysis_completed',
        message: `Batch ${batch.batch_num} analysis completed`,
        data: {
          batch_num: batch.batch_num,
          progress: Math.round(((i + 1) / data.batch_results.length) * 100),
          visibility_score: batch.visibility_score,
          total_mentions: batch.total_mentions,
        },
      });

      await this.delay(400);
    }

    // Step 4: Final aggregation
    onProgress({
      step: 'step4',
      status: 'started',
      message: 'Aggregating results...',
    });

    await this.delay(500);

    onProgress({
      step: 'step4',
      status: 'completed',
      message: 'Results aggregated',
      data: {
        visibility_score: data.visibility_score,
        total_mentions: data.analysis_report.total_mentions,
        by_model: data.analysis_report.by_model,
      },
    });

    await this.delay(300);

    // Complete
    onProgress({
      step: 'complete',
      status: 'success',
      message: 'Visibility analysis complete',
      data,
    });
  }
}

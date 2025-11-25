// ============= Request Types =============

export interface CompanyAnalysisRequest {
  company_url: string;
  company_name?: string;
  target_region?: string;
}

export interface VisibilityAnalysisRequest {
  company_url: string;
  company_slug_id?: string;
  num_queries?: number;
  models?: string[];
  llm_provider?: 'claude' | 'gemini' | 'llama' | 'openai' | 'grok' | 'deepseek';
  batch_size?: number;
  query_weights?: Record<string, number>;
}

// ============= Response Types =============

export interface CompetitorData {
  name: string;
  description: string;
  products: string;
  positioning: string;
  price_tier?: string;
}

export interface QueryCategoryTemplate {
  name: string;
  weight: number;
  description: string;
  examples: string[];
}

export interface BrandPositioning {
  value_proposition: string;
  differentiators: string[];
  price_positioning: string;
}

export interface BuyerIntentSignals {
  common_questions: string[];
  decision_factors: string[];
  pain_points: string[];
}

export interface ExtractionTemplate {
  extract_fields: string[];
  competitor_focus: string;
}

export interface CompanyAnalysisData {
  industry: string;
  broad_category?: string;
  industry_description?: string;
  company_name: string;
  company_description: string;
  company_summary?: string;
  competitors: string[];
  competitors_data?: CompetitorData[];
  target_region: string;
  extraction_template?: ExtractionTemplate;
  query_categories_template?: Record<string, QueryCategoryTemplate>;
  product_category?: string;
  market_keywords?: string[];
  target_audience?: string;
  brand_positioning?: BrandPositioning;
  buyer_intent_signals?: BuyerIntentSignals;
  industry_specific?: Record<string, string | number>;
  company_url?: string;
  slug_id?: string;
}

export interface CompanyAnalysisResponse {
  step: string;
  status: string;
  message: string;
  slug_id?: string;
  cached: boolean;
  data: CompanyAnalysisData;
}

export interface ModelBreakdown {
  mentions: number;
  total_responses: number;
  mention_rate: number;
  competitor_mentions: Record<string, number>;
}

export interface BatchResult {
  batch_num: number;
  visibility_score: number;
  total_mentions: number;
  by_model: Record<string, ModelBreakdown>;
}

export interface AnalysisReport {
  total_mentions: number;
  mention_rate: number;
  by_model: Record<string, ModelBreakdown>;
  sample_mentions: string[];
}

export interface CategoryBreakdownItem {
  category: string;
  score: number;
  queries: number;
  mentions: number;
}

export interface ModelCategoryMatrix {
  [modelName: string]: {
    [categoryName: string]: number;
  };
}

export interface CompetitorRanking {
  name: string;
  mention_count: number;
  visibility_score: number;
}

export interface VisibilityAnalysisData {
  industry: string;
  company_name: string;
  competitors: string[];
  total_queries: number;
  total_responses: number;
  visibility_score: number;
  analysis_report: AnalysisReport;
  batch_results: BatchResult[];
  slug_id?: string;
  // New fields for category-based streaming
  model_scores?: Record<string, number>;
  total_mentions?: number;
  categories_processed?: number;
  category_breakdown?: CategoryBreakdownItem[];
  model_category_matrix?: ModelCategoryMatrix;
  top_competitors?: CompetitorRanking[];
}

// ============= SSE Event Types =============

export type SSEEventStep =
  | 'initialize'
  | 'scraping'
  | 'analyzing'
  | 'finalizing'
  | 'analysis'
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'batch'
  | 'initialization'
  | 'category_queries'
  | 'category_testing'
  | 'category_analysis'
  | 'category_complete'
  | 'complete'
  | 'error';

export type SSEEventStatus =
  | 'started'
  | 'in_progress'
  | 'completed'
  | 'testing_started'
  | 'testing_completed'
  | 'analysis_started'
  | 'analysis_completed'
  | 'success'
  | 'failed';

export interface BaseSSEEvent {
  step: SSEEventStep;
  status: SSEEventStatus;
  message?: string;
}

export interface InitializeEvent extends BaseSSEEvent {
  step: 'initialize';
  data?: null;
}

export interface ScrapingEvent extends BaseSSEEvent {
  step: 'scraping';
  data?: {content_length?: number} | null;
}

export interface AnalyzingEvent extends BaseSSEEvent {
  step: 'analyzing';
  data?: null;
}

export interface FinalizingEvent extends BaseSSEEvent {
  step: 'finalizing';
  data?: null;
}

export interface AnalysisEvent extends BaseSSEEvent {
  step: 'analysis';
  data?: CompanyAnalysisData;
}

export interface Step1Event extends BaseSSEEvent {
  step: 'step1';
  data?: {
    industry: string;
    company_name: string;
    competitors: string[];
  };
}

export interface Step2Event extends BaseSSEEvent {
  step: 'step2';
  data?: {
    total_queries: number;
    categories: number;
  };
}

export interface Step3Event extends BaseSSEEvent {
  step: 'step3';
}

export interface Step4Event extends BaseSSEEvent {
  step: 'step4';
  data?: {
    visibility_score: number;
    total_mentions: number;
    by_model: Record<string, ModelBreakdown>;
  };
}

export interface BatchEvent extends BaseSSEEvent {
  step: 'batch';
  data?: {
    batch_num: number;
    batch_size?: number;
    progress?: number;
    responses_count?: number;
    visibility_score?: number;
    total_mentions?: number;
  };
}

export interface CompleteEvent extends BaseSSEEvent {
  step: 'complete';
  status: 'success';
  data: CompanyAnalysisData | VisibilityAnalysisData;
  cached?: boolean;
  slug_id?: string;
}

export interface ErrorEvent extends BaseSSEEvent {
  step: 'error';
  status: 'failed';
  data: {error: string};
}

export interface InitializationEvent extends BaseSSEEvent {
  step: 'initialization';
  status: 'completed';
  data: {
    total_categories: number;
    categories: string[];
  };
}

export interface CategoryQueriesEvent extends BaseSSEEvent {
  step: 'category_queries';
  status: 'in_progress';
  data: {
    category: string;
    queries_generated: number;
    progress: string;
  };
}

export interface CategoryTestingEvent extends BaseSSEEvent {
  step: 'category_testing';
  status: 'in_progress';
  data: {
    category: string;
    responses_tested: number;
    progress: string;
  };
}

export interface CategoryAnalysisEvent extends BaseSSEEvent {
  step: 'category_analysis';
  status: 'in_progress';
  data: {
    category: string;
    category_score: number;
    category_mentions: number;
    progress: string;
  };
}

export interface CategoryCompleteEvent extends BaseSSEEvent {
  step: 'category_complete';
  status: 'completed';
  data: {
    category: string;
    category_score: number;
    model_breakdown: Record<string, ModelBreakdown>;
    completed_categories: number;
    total_categories: number;
    progress: string;
    partial_visibility_score: number;
    partial_model_scores: Record<string, number>;
    total_queries: number;
    total_mentions: number;
    category_breakdown: CategoryBreakdownItem[];
  };
}

export interface StreamingProgress {
  currentCategory: string | null;
  completedCategories: number;
  totalCategories: number;
  partialVisibilityScore: number;
  partialModelScores: Record<string, number>;
  categoryBreakdown: CategoryBreakdownItem[];
}

export interface CategoryProgress {
  category: string;
  status: 'pending' | 'generating' | 'testing' | 'analyzing' | 'complete';
  queriesGenerated?: number;
  responsesTested?: number;
  score?: number;
  mentions?: number;
}

export type SSEEvent =
  | InitializeEvent
  | ScrapingEvent
  | AnalyzingEvent
  | FinalizingEvent
  | AnalysisEvent
  | Step1Event
  | Step2Event
  | Step3Event
  | Step4Event
  | BatchEvent
  | InitializationEvent
  | CategoryQueriesEvent
  | CategoryTestingEvent
  | CategoryAnalysisEvent
  | CategoryCompleteEvent
  | CompleteEvent
  | ErrorEvent;

// ============= Error Types =============

export interface APIError {
  detail: string;
  status?: number;
}

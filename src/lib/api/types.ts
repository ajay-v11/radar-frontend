// ============= Request Types =============

export interface CompanyAnalysisRequest {
  company_url: string;
  company_name?: string;
}

export interface VisibilityAnalysisRequest {
  company_url: string;
  num_queries?: number;
  models?: string[];
  llm_provider?: 'gemini' | 'chatgpt' | 'claude' | 'llama';
  batch_size?: number;
  query_weights?: Record<string, number>;
}

// ============= Response Types =============

export interface CompetitorData {
  name: string;
  description: string;
  products: string;
  positioning: string;
}

export interface CompanyAnalysisData {
  industry: string;
  company_name: string;
  company_description: string;
  company_summary: string;
  competitors: string[];
  competitors_data: CompetitorData[];
}

export interface CompanyAnalysisResponse {
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

export interface VisibilityAnalysisData {
  industry: string;
  company_name: string;
  competitors: string[];
  total_queries: number;
  total_responses: number;
  visibility_score: number;
  analysis_report: AnalysisReport;
  batch_results: BatchResult[];
}

// ============= SSE Event Types =============

export type SSEEventStep =
  | 'scraping'
  | 'analysis'
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'batch'
  | 'complete'
  | 'error';

export type SSEEventStatus =
  | 'started'
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

export interface ScrapingEvent extends BaseSSEEvent {
  step: 'scraping';
  data?: {content_length: number};
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
}

export interface ErrorEvent extends BaseSSEEvent {
  step: 'error';
  status: 'failed';
  data: {error: string};
}

export type SSEEvent =
  | ScrapingEvent
  | AnalysisEvent
  | Step1Event
  | Step2Event
  | Step3Event
  | Step4Event
  | BatchEvent
  | CompleteEvent
  | ErrorEvent;

// ============= Error Types =============

export interface APIError {
  detail: string;
  status?: number;
}

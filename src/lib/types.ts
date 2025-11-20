export interface CompanyData {
  name: string;
  website: string;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
}

export type QueryCategory = 
  | 'Product Selection'
  | 'Comparison Queries'
  | 'How-To Queries'
  | 'Best-Of Lists';

export interface QueryResult {
  id: string;
  query: string;
  mentioned: boolean;
  rank: number | null;
  competitors: string[];
  model: string;
  category: QueryCategory;
}

export interface CompetitorSummary {
  name: string;
  mentions: number;
  percentage: number;
}

export interface CategoryBreakdown {
  category: QueryCategory;
  totalQueries: number;
  mentioned: number;
  visibility: number;
  topCompetitors: CompetitorSummary[];
}

export interface Competitor {
  name: string;
  mentions: number;
  visibility: number;
}

export interface VisibilityReport {
  companyName: string;
  overallScore: number;
  totalQueries: number;
  mentionedIn: number;
  models: string[];
  breakdown: CategoryBreakdown[];
  competitors: Competitor[];
  queryLog: QueryResult[];
}

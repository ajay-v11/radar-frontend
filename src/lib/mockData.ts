import type {
  VisibilityReport,
  QueryResult,
  QueryCategory,
  CategoryBreakdown,
  Competitor,
  CompetitorSummary,
} from './types';

// Sample queries for each category
const queryTemplates: Record<QueryCategory, string[]> = {
  'Product Selection': [
    'best CRM software for small business',
    'top project management tools 2024',
    'which email marketing platform should I use',
    'best accounting software for startups',
    'recommended customer support software',
    'what is the best team collaboration tool',
    'top sales automation platforms',
    'best inventory management system',
    'which HR software is most popular',
    'recommended business intelligence tools',
    'best e-commerce platform for beginners',
    'top video conferencing software',
    'which payment processor should I choose',
    'best social media management tool',
    'recommended cybersecurity software',
    'top marketing automation platforms',
    'best cloud storage solution for business',
    'which analytics platform is best',
    'recommended helpdesk software',
    'best workflow automation tool',
  ],
  'Comparison Queries': [
    'Salesforce vs HubSpot',
    'Asana vs Monday.com comparison',
    'Slack vs Microsoft Teams which is better',
    'Mailchimp vs Constant Contact',
    'QuickBooks vs Xero comparison',
    'Zendesk vs Freshdesk',
    'Trello vs Jira for project management',
    'Shopify vs WooCommerce',
    'Zoom vs Google Meet comparison',
    'Stripe vs PayPal for online payments',
    'Hootsuite vs Buffer comparison',
    'Dropbox vs Google Drive for business',
    'Tableau vs Power BI',
    'Intercom vs Drift comparison',
    'Zapier vs Make automation',
  ],
  'How-To Queries': [
    'how to set up email automation',
    'how to track customer interactions',
    'how to automate sales workflows',
    'how to integrate CRM with email',
    'how to create customer segments',
    'how to set up lead scoring',
    'how to automate invoice generation',
    'how to track project milestones',
    'how to set up team permissions',
    'how to create custom reports',
    'how to automate social media posting',
    'how to set up payment processing',
    'how to track website analytics',
    'how to create email campaigns',
    'how to manage customer tickets',
    'how to set up two-factor authentication',
    'how to export data to CSV',
    'how to integrate with third-party apps',
    'how to create automated workflows',
    'how to set up user roles',
  ],
  'Best-Of Lists': [
    'top 10 CRM platforms',
    'best project management software 2024',
    'top 5 email marketing tools',
    'best accounting software for freelancers',
    'top customer service platforms',
    'best collaboration tools for remote teams',
    'top sales enablement software',
    'best inventory management solutions',
    'top HR management systems',
    'best data visualization tools',
    'top e-commerce platforms',
    'best video conferencing apps',
    'top payment gateways',
    'best social media schedulers',
    'top cybersecurity solutions',
  ],
};

// Sample competitor names
const competitorPool = [
  'Salesforce',
  'HubSpot',
  'Microsoft',
  'Oracle',
  'SAP',
  'Adobe',
  'Zoho',
  'Freshworks',
  'ServiceNow',
  'Atlassian',
  'Monday.com',
  'Asana',
  'Zendesk',
  'Intercom',
  'Mailchimp',
];

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function selectRandomItems<T>(array: T[], count: number): T[] {
  return shuffleArray(array).slice(0, count);
}

export function generateMockReport(
  companyName: string,
  models: string[]
): VisibilityReport {
  // Generate 50-100 total queries
  const totalQueries = getRandomInt(50, 100);
  
  // Select 5-8 competitors
  const competitorCount = getRandomInt(5, 8);
  const selectedCompetitors = selectRandomItems(competitorPool, competitorCount);
  
  // Distribute queries across categories
  const categories: QueryCategory[] = [
    'Product Selection',
    'Comparison Queries',
    'How-To Queries',
    'Best-Of Lists',
  ];
  
  const queriesPerCategory: Record<QueryCategory, number> = {
    'Product Selection': Math.floor(totalQueries * 0.35),
    'Comparison Queries': Math.floor(totalQueries * 0.25),
    'How-To Queries': Math.floor(totalQueries * 0.25),
    'Best-Of Lists': 0,
  };
  
  // Assign remaining queries to Best-Of Lists
  queriesPerCategory['Best-Of Lists'] = 
    totalQueries - 
    queriesPerCategory['Product Selection'] - 
    queriesPerCategory['Comparison Queries'] - 
    queriesPerCategory['How-To Queries'];
  
  // Generate query results
  const queryLog: QueryResult[] = [];
  let queryId = 1;
  let totalMentions = 0;
  
  // Track competitor mentions
  const competitorMentions: Record<string, number> = {};
  selectedCompetitors.forEach(comp => {
    competitorMentions[comp] = 0;
  });
  
  // Track mentions per category
  const categoryMentions: Record<QueryCategory, number> = {
    'Product Selection': 0,
    'Comparison Queries': 0,
    'How-To Queries': 0,
    'Best-Of Lists': 0,
  };
  
  categories.forEach(category => {
    const queryCount = queriesPerCategory[category];
    const availableQueries = queryTemplates[category];
    const selectedQueries = selectRandomItems(availableQueries, Math.min(queryCount, availableQueries.length));
    
    // If we need more queries than available templates, reuse some
    while (selectedQueries.length < queryCount) {
      selectedQueries.push(availableQueries[getRandomInt(0, availableQueries.length - 1)]);
    }
    
    selectedQueries.forEach(query => {
      // Randomly select a model for this query
      const model = models[getRandomInt(0, models.length - 1)];
      
      // 30-40% chance of being mentioned
      const mentioned = Math.random() < 0.35;
      
      if (mentioned) {
        totalMentions++;
        categoryMentions[category]++;
      }
      
      // If mentioned, assign a rank (1-5)
      const rank = mentioned ? getRandomInt(1, 5) : null;
      
      // Select 2-4 competitors for this query
      const queryCompetitorCount = getRandomInt(2, 4);
      const queryCompetitors = selectRandomItems(selectedCompetitors, queryCompetitorCount);
      
      // Increment competitor mention counts
      queryCompetitors.forEach(comp => {
        competitorMentions[comp]++;
      });
      
      queryLog.push({
        id: `q${queryId++}`,
        query,
        mentioned,
        rank,
        competitors: queryCompetitors,
        model,
        category,
      });
    });
  });
  
  // Calculate overall score
  const overallScore = Math.round((totalMentions / totalQueries) * 100);
  
  // Generate category breakdowns
  const breakdown: CategoryBreakdown[] = categories.map(category => {
    const categoryQueries = queryLog.filter(q => q.category === category);
    const mentioned = categoryMentions[category];
    const total = categoryQueries.length;
    const visibility = Math.round((mentioned / total) * 100);
    
    // Find top competitors for this category
    const categoryCompetitorCounts: Record<string, number> = {};
    categoryQueries.forEach(q => {
      q.competitors.forEach(comp => {
        categoryCompetitorCounts[comp] = (categoryCompetitorCounts[comp] || 0) + 1;
      });
    });
    
    const topCompetitors: CompetitorSummary[] = Object.entries(categoryCompetitorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, mentions]) => ({
        name,
        mentions,
        percentage: Math.round((mentions / total) * 100),
      }));
    
    return {
      category,
      totalQueries: total,
      mentioned,
      visibility,
      topCompetitors,
    };
  });
  
  // Generate competitor rankings
  const competitors: Competitor[] = Object.entries(competitorMentions)
    .map(([name, mentions]) => ({
      name,
      mentions,
      visibility: Math.round((mentions / totalQueries) * 100),
    }))
    .sort((a, b) => b.mentions - a.mentions);
  
  return {
    companyName,
    overallScore,
    totalQueries,
    mentionedIn: totalMentions,
    models,
    breakdown,
    competitors,
    queryLog,
  };
}

export function convertToCSV(queryLog: QueryResult[], companyName: string): string {
  const headers = ['Query Text', 'Mentioned', 'Rank', 'Competitors', 'AI Model'];
  const rows = queryLog.map(q => [
    `"${q.query.replace(/"/g, '""')}"`,
    q.mentioned ? 'Yes' : 'No',
    q.rank !== null ? q.rank.toString() : '-',
    `"${q.competitors.join(', ')}"`,
    q.model,
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');
  
  return csvContent;
}

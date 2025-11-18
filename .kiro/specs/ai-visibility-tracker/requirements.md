# Requirements Document

## Introduction

The AI Visibility Tracker is a Next.js web application that enables companies to track and analyze how frequently AI models mention their brand across various industry-related queries. The system provides a comprehensive dashboard showing visibility scores, competitor analysis, and detailed query breakdowns across multiple AI models.

## Glossary

- **System**: The AI Visibility Tracker web application
- **User**: A company representative or brand manager using the application
- **Visibility Score**: A percentage metric indicating how often a company is mentioned by AI models in response to industry queries
- **Query Log**: A comprehensive list of all test queries with their results
- **AI Model**: Large language models like ChatGPT, Claude, Perplexity, or Gemini
- **Competitor**: Other companies mentioned alongside the user's company in AI responses
- **Query Category**: Classification of queries (Product Selection, Comparison, How-To, Best-Of Lists)

## Requirements

### Requirement 1

**User Story:** As a brand manager, I want to view an engaging landing page, so that I understand the value proposition and can navigate to the dashboard

#### Acceptance Criteria

1. THE System SHALL display a full-height hero section containing a centered logo, headline "Track Your Brand's AI Visibility", subheadline, and a "Get Started" call-to-action button
2. WHEN the User clicks the "Get Started" button, THE System SHALL navigate to the dashboard page at /dashboard
3. THE System SHALL display a features section with 4 feature cards showing "Industry Detection", "Multi-Model Testing", "Competitor Analysis", and "Complete Query Transparency"
4. THE System SHALL render each feature card with an icon, title, and description using shadcn/ui Card components
5. THE System SHALL implement a responsive layout that adapts to mobile and desktop viewports

### Requirement 2

**User Story:** As a user, I want to input my company information, so that the system can analyze my brand's AI visibility

#### Acceptance Criteria

1. THE System SHALL display a form with input fields for Company Name and Website URL
2. THE System SHALL validate that both Company Name and Website URL fields contain non-empty values before enabling the "Analyze" button
3. WHEN the User clicks the "Analyze" button with valid inputs, THE System SHALL proceed to the model selection step
4. THE System SHALL use shadcn/ui Form, Input, and Button components for the company input interface
5. THE System SHALL display validation error messages when the User attempts to submit with empty fields

### Requirement 3

**User Story:** As a user, I want to select exactly 2 AI models to test, so that I can compare visibility across different platforms

#### Acceptance Criteria

1. THE System SHALL display a model selection interface with options for ChatGPT, Claude, Perplexity, and Gemini
2. THE System SHALL allow the User to select exactly 2 AI models from the available options
3. THE System SHALL disable the "Generate Report" button when fewer than 2 or more than 2 models are selected
4. WHEN the User selects exactly 2 models and clicks "Generate Report", THE System SHALL display a loading state for 1-2 seconds
5. WHEN the loading completes, THE System SHALL display the results report with mock data

### Requirement 4

**User Story:** As a user, I want to see an overview of my visibility score, so that I can quickly understand my brand's AI presence

#### Acceptance Criteria

1. THE System SHALL display an overview card showing the overall Visibility Score as a large percentage with a progress ring visualization
2. THE System SHALL display the total number of queries tested in the overview card
3. THE System SHALL display the total mention count in the overview card
4. THE System SHALL display the names of the 2 selected AI models in the overview card
5. THE System SHALL use shadcn/ui Card and Progress components for the overview visualization

### Requirement 5

**User Story:** As a user, I want to see visibility breakdown by query type, so that I can understand which categories perform best

#### Acceptance Criteria

1. THE System SHALL display query breakdowns for 4 categories: Product Selection, Comparison Queries, How-To Queries, and Best-Of Lists
2. THE System SHALL display for each category the visibility percentage, mention count, and total queries tested
3. THE System SHALL display the top 3 competitors for each query category
4. THE System SHALL use shadcn/ui Tabs or Accordion components to organize the category breakdowns
5. THE System SHALL calculate visibility percentage as (mentioned queries / total queries) * 100 for each category

### Requirement 6

**User Story:** As a user, I want to see competitor rankings, so that I can understand my position relative to other brands

#### Acceptance Criteria

1. THE System SHALL display a competitor rankings table with columns for competitor name, mention count, and visibility percentage
2. THE System SHALL include a bar chart visualization for each competitor's visibility percentage
3. THE System SHALL sort competitors by mention count in descending order
4. THE System SHALL use shadcn/ui Table component for the competitor rankings display
5. THE System SHALL display at least 5 competitor entries in the rankings table

### Requirement 7

**User Story:** As a user, I want to view a complete log of all queries tested, so that I can see detailed results for each query

#### Acceptance Criteria

1. THE System SHALL display a data table with columns: Query Text, Mentioned (✓/✗), Rank/Position, Competitors Found, and AI Model
2. THE System SHALL display between 50-100 query entries in the query log
3. THE System SHALL implement sortable columns for all data table fields
4. THE System SHALL implement a search/filter functionality to find specific queries
5. THE System SHALL use shadcn/ui DataTable pattern for the query log display

### Requirement 8

**User Story:** As a user, I want to download my visibility report, so that I can share results with my team

#### Acceptance Criteria

1. THE System SHALL display a "Download Report" button with a download icon
2. WHEN the User clicks the "Download Report" button, THE System SHALL trigger a mock CSV file download
3. THE System SHALL use shadcn/ui Button component with an icon for the download functionality
4. THE System SHALL include all query log data in the mock CSV download
5. THE System SHALL name the downloaded file with the format "visibility-report-[company-name].csv"

### Requirement 9

**User Story:** As a user, I want to see loading states during analysis, so that I know the system is processing my request

#### Acceptance Criteria

1. WHEN the System is generating a report, THE System SHALL display skeleton loading components for 1-2 seconds
2. THE System SHALL use shadcn/ui Skeleton components for loading states
3. THE System SHALL display a loading indicator on the "Generate Report" button during processing
4. THE System SHALL disable user interactions with form elements during the loading state
5. WHEN loading completes, THE System SHALL smoothly transition to displaying the results

### Requirement 10

**User Story:** As a mobile user, I want the application to work on my device, so that I can access visibility data anywhere

#### Acceptance Criteria

1. THE System SHALL implement responsive layouts that adapt to viewport widths below 768px
2. THE System SHALL ensure all interactive elements have touch-friendly sizes (minimum 44x44px)
3. THE System SHALL stack components vertically on mobile viewports where appropriate
4. THE System SHALL maintain readability of text and data tables on mobile devices
5. THE System SHALL use Tailwind CSS responsive utilities for all layout adaptations

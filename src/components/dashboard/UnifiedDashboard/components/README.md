# UnifiedDashboard Component Structure

This folder contains all the components for the Unified Dashboard feature, organized into smaller, reusable pieces.

## Component Hierarchy

```
UnifiedDashboard/
├── index.tsx                      # Main export
├── UnifiedDashboard.tsx           # Main container component
├── DashboardHeader.tsx            # Header with title and back button
├── ProgressWizard.tsx             # Left sidebar progress indicator
├── CompanySummaryCard.tsx         # Company information display
├── ModelSelectionCard.tsx         # Model selection interface wrapper
├── VisibilityMetricsGrid.tsx      # Grid layout for visibility metrics
├── QueryTestingTable.tsx          # Query testing results table
├── QueryTableContent.tsx          # Table content with batch results
├── QueryTableSkeleton.tsx         # Loading skeleton for table
├── ExportReportCard.tsx           # Export and download section
├── ExportButton.tsx               # Individual export button (PDF/CSV/JSON)
└── ReportSummaryStats.tsx         # Summary statistics grid
```

## Component Descriptions

### Core Components

**UnifiedDashboard.tsx**
- Main container component that orchestrates the entire dashboard
- Manages state for wizard steps, model selection, and analysis data
- Handles API calls and data flow between components

**DashboardHeader.tsx**
- Simple header with dashboard title and back button
- Consistent styling across the dashboard

**ProgressWizard.tsx**
- Left sidebar showing progress through dashboard steps
- Visual indicators for completed, active, and pending steps
- Animated transitions and loading states

### Summary & Selection

**CompanySummaryCard.tsx**
- Displays company information in a compact card
- Shows company name, industry, website, description
- Displays competitors and selected models
- Responsive grid layout

**ModelSelectionCard.tsx**
- Wrapper for the InlineModelSelector component
- Handles model selection submission

### Metrics & Results

**VisibilityMetricsGrid.tsx**
- Grid layout for visibility score and model performance
- Uses VisibilityScoreBento and ModelPerformanceBento components
- Responsive 2-column layout (2:3 ratio)

**QueryTestingTable.tsx**
- Container for query testing results
- Shows loading skeleton or actual results
- Displays batch information and query status

**QueryTableContent.tsx**
- Renders the actual table with batch results
- Groups queries by batch
- Shows query text, results, and status indicators

**QueryTableSkeleton.tsx**
- Loading skeleton for the query table
- Animated placeholder rows

### Export & Reports

**ExportReportCard.tsx**
- Container for export options and summary stats
- Shows completion status
- Organizes export buttons and statistics

**ExportButton.tsx**
- Reusable button for different export types (PDF, CSV, JSON)
- Color-coded icons and hover effects
- Configurable title and description

**ReportSummaryStats.tsx**
- Grid of summary statistics
- Shows analysis date, total queries, models tested, visibility score

## Usage

```tsx
import {UnifiedDashboard} from '@/components/dashboard/UnifiedDashboard';

<UnifiedDashboard
  companyData={companyData}
  companyAnalysis={companyAnalysis}
  onBack={handleBack}
/>
```

## Props

### UnifiedDashboard Props
- `companyData: CompanyData` - Company information (name, website)
- `companyAnalysis: CompanyAnalysisData` - Analysis results from API
- `onBack: () => void` - Callback for back button

## State Management

The UnifiedDashboard component manages:
- `currentStep` - Current dashboard step (summary, model-selection, queries, etc.)
- `wizardStep` - Numeric step for progress wizard (0-4)
- `selectedModels` - Array of selected AI models
- `isAnalyzing` - Loading state during analysis
- `visibilityData` - Results from visibility analysis API
- `streamingQueries` - Array of queries being tested
- `batchResults` - Array of batch results from API

## Styling

All components use:
- Tailwind CSS for styling
- shadcn/ui components (Card, Button, etc.)
- Consistent color scheme with primary/muted colors
- Responsive design with mobile-first approach
- Smooth transitions and animations

## Future Enhancements

Potential improvements:
- Add export functionality to ExportButton components
- Implement real-time streaming for query results
- Add filtering and sorting to QueryTestingTable
- Create detailed drill-down views for each metric
- Add data visualization charts
- Implement PDF generation for reports

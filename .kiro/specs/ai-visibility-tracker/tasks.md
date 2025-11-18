# Implementation Plan

- [x] 1. Set up TypeScript types and mock data infrastructure





  - Create `src/lib/types.ts` with all TypeScript interfaces (CompanyData, QueryResult, CategoryBreakdown, Competitor, VisibilityReport, etc.)
  - Create `src/lib/mockData.ts` with the `generateMockReport()` function that produces realistic visibility reports with 50-100 queries across 4 categories
  - Ensure mock data includes proper distribution of mentions (~30-40% visibility), 5-8 competitors, and realistic query examples
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1_

- [x] 2. Add required shadcn/ui components





  - [x] 2.1 Create `src/components/ui/button.tsx` with variants (default, destructive, outline, secondary, ghost, link) and sizes (default, sm, lg, icon)


    - _Requirements: 1.2, 2.3, 3.4, 8.2_

  - [x] 2.2 Create `src/components/ui/input.tsx` with focus, error, and disabled states

    - _Requirements: 2.1, 2.5_

  - [x] 2.3 Create `src/components/ui/label.tsx` for accessible form labels

    - _Requirements: 2.1_
  - [x] 2.4 Create `src/components/ui/checkbox.tsx` with check icon and accessible ARIA attributes


    - _Requirements: 3.1, 3.2_
  - [x] 2.5 Create `src/components/ui/table.tsx` with Table, TableHeader, TableBody, TableRow, TableHead, TableCell components


    - _Requirements: 6.2, 7.1_

  - [x] 2.6 Create `src/components/ui/tabs.tsx` with Tabs, TabsList, TabsTrigger, TabsContent components

    - _Requirements: 5.4_
  - [x] 2.7 Create `src/components/ui/badge.tsx` with variants (default, secondary, destructive, outline)


    - _Requirements: 4.4_

  - [x] 2.8 Create `src/components/ui/progress.tsx` with linear and circular variants for score visualization

    - _Requirements: 4.1, 6.2_

  - [x] 2.9 Create `src/components/ui/skeleton.tsx` with pulse animation for loading states

    - _Requirements: 9.1, 9.2_

- [x] 3. Build landing page components





  - [x] 3.1 Create `src/components/landing/Hero.tsx` with full-height section, centered logo icon, headline, subheadline, and "Get Started" button linking to /dashboard


    - Use lucide-react icon (e.g., BarChart or TrendingUp)
    - Implement gradient background with responsive text sizing
    - _Requirements: 1.1, 1.2, 1.5_
  - [x] 3.2 Create `src/components/landing/Features.tsx` with responsive grid (1/2/4 columns) displaying 4 feature cards


    - Each card shows icon (Search, BarChart3, Users, FileText), title, and description
    - Use shadcn/ui Card component
    - _Requirements: 1.3, 1.4, 1.5_
  - [x] 3.3 Update `src/app/page.tsx` to render Hero and Features components


    - _Requirements: 1.1, 1.3_

- [x] 4. Build dashboard Step 1: Company Input




  - [x] 4.1 Create `src/components/dashboard/CompanyInput.tsx` with form containing Company Name and Website URL inputs


    - Implement controlled inputs with useState
    - Add validation logic: both fields must be non-empty
    - Disable "Analyze" button until form is valid
    - Display validation error messages for empty fields
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 5. Build dashboard Step 2: Model Selection






  - [x] 5.1 Create `src/components/dashboard/ModelSelector.tsx` with checkbox group for 4 AI models (ChatGPT, Claude, Perplexity, Gemini)

    - Implement selection logic that enforces exactly 2 models
    - Disable "Generate Report" button when selection count ≠ 2
    - Add "Back" button to return to company input
    - Display validation message when selection is invalid
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 6. Build dashboard Step 3: Results components






  - [x] 6.1 Create `src/components/dashboard/OverviewCard.tsx` displaying overall visibility score with progress ring, total queries, mentions, and selected models

    - Implement color coding for score ranges (0-33% red, 34-66% yellow, 67-100% green)
    - Use Progress component for circular visualization
    - Display models as badges
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  - [x] 6.2 Create `src/components/dashboard/QueryBreakdown.tsx` with tabs for 4 query categories


    - Each tab shows visibility %, mention count, total queries, and top 3 competitors
    - Categories: Product Selection, Comparison Queries, How-To Queries, Best-Of Lists
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - [x] 6.3 Create `src/components/dashboard/CompetitorRankings.tsx` with sortable table showing competitor name, mention count, visibility %, and visual bar chart


    - Sort competitors by mention count (descending)
    - Use Progress component for horizontal bars
    - Display at least 5 competitors
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [x] 6.4 Create `src/components/dashboard/QueryLog.tsx` with searchable, sortable data table


    - Columns: Query Text, Mentioned (✓/✗), Rank/Position, Competitors Found, AI Model
    - Implement search filter functionality
    - Implement column sorting (ascending/descending)
    - Display 50-100 query entries
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  - [x] 6.5 Create `src/components/dashboard/VisibilityReport.tsx` as container component


    - Implement loading state with Skeleton components (1-2 second delay using setTimeout)
    - Render OverviewCard, QueryBreakdown, CompetitorRankings, and QueryLog once loaded
    - Add "Download Report" button with download icon that triggers mock CSV download
    - Implement smooth transition from loading to loaded state
    - _Requirements: 3.5, 8.1, 8.2, 8.3, 8.4, 8.5, 9.1, 9.2, 9.5_


- [x] 7. Build main dashboard page with multi-step flow



  - [x] 7.1 Create `src/app/dashboard/page.tsx` with state management for 3-step flow


    - Implement useState for current step ('input' | 'model-selection' | 'results')
    - Implement useState for company data and selected models
    - Conditionally render CompanyInput, ModelSelector, or VisibilityReport based on step
    - Wire up onSubmit callbacks to advance through steps
    - Pass mock data from generateMockReport() to VisibilityReport
    - _Requirements: 2.3, 3.4, 3.5, 9.3, 9.4_

- [x] 8. Implement CSV download functionality




  - [x] 8.1 Create utility function in `src/lib/mockData.ts` to convert query log data to CSV format


    - Include headers: Query Text, Mentioned, Rank, Competitors, AI Model
    - Format data rows with proper escaping
    - _Requirements: 8.4_


  - [x] 8.2 Implement download trigger in VisibilityReport component





    - Create blob from CSV string
    - Generate download link with filename format "visibility-report-[company-name].csv"
    - Trigger download on button click
    - _Requirements: 8.2, 8.5_

- [x] 9. Implement responsive design and mobile optimization





  - [x] 9.1 Add responsive Tailwind classes to all components


    - Hero: responsive text sizing (text-4xl md:text-6xl)
    - Features: grid layout (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
    - Dashboard: stack components vertically on mobile
    - Tables: horizontal scroll on mobile or stacked layout
    - _Requirements: 1.5, 10.1, 10.3_
  - [x] 9.2 Ensure touch-friendly interactive elements (minimum 44x44px)


    - Buttons, checkboxes, and clickable areas meet minimum size
    - _Requirements: 10.2_
  - [x] 9.3 Test and adjust text readability on mobile devices


    - Ensure proper font sizes and line heights
    - Test table readability and scrolling
    - _Requirements: 10.4_
  - [x] 9.4 Verify all Tailwind responsive utilities work correctly


    - Test on mobile (< 640px), tablet (640-1024px), and desktop (> 1024px)
    - _Requirements: 10.5_

- [x] 10. Add loading states and transitions






  - [x] 10.1 Implement Skeleton components for all loading states

    - OverviewCard skeleton
    - QueryBreakdown skeleton
    - CompetitorRankings skeleton
    - QueryLog skeleton
    - _Requirements: 9.1, 9.2_
  - [x] 10.2 Add loading spinner to "Generate Report" button during processing


    - Disable button during loading
    - Show spinner icon from lucide-react
    - _Requirements: 9.3_
  - [x] 10.3 Implement smooth fade-in transitions when content loads


    - Use CSS transitions or Tailwind animate utilities
    - _Requirements: 9.5_
  - [x] 10.4 Disable form interactions during loading states


    - Prevent multiple submissions
    - _Requirements: 9.4_

- [x] 11. Final integration and polish





  - [x] 11.1 Test complete user flow from landing page to results


    - Verify navigation works correctly
    - Ensure data persists through steps
    - Test back button functionality

  - [x] 11.2 Verify all mock data displays correctly

    - Check calculations (visibility percentages, rankings)
    - Ensure data consistency across all sections

  - [x] 11.3 Add accessibility attributes (ARIA labels, keyboard navigation)


    - Test keyboard-only navigation
    - Add proper ARIA labels to icons and interactive elements
    - Ensure focus indicators are visible

  - [x] 11.4 Test on multiple browsers and devices

    - Chrome, Firefox, Safari, Edge
    - Mobile and desktop viewports


  - [x] 11.5 Fix any TypeScript errors and run build


    - Ensure `npm run build` completes successfully
    - Fix any type errors or warnings

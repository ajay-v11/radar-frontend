# Design Document: AI Visibility Tracker

## Overview

The AI Visibility Tracker is a Next.js 16 application built with TypeScript, React 19, and Tailwind CSS 4. The application uses shadcn/ui components for a consistent, accessible UI and follows a multi-page architecture with a landing page and an interactive dashboard. The system uses mock data to simulate AI model analysis without requiring backend API integration.

### Technology Stack

- **Framework**: Next.js 16.0.3 with App Router
- **React**: 19.2.0 with React Compiler
- **TypeScript**: 5.x with strict mode
- **Styling**: Tailwind CSS 4 with tw-animate-css
- **UI Components**: shadcn/ui (custom implementation)
- **Icons**: lucide-react 0.554.0
- **Utilities**: clsx, tailwind-merge, class-variance-authority

## Architecture

### Page Structure

```
/app
├── page.tsx                    # Landing page
├── dashboard
│   └── page.tsx               # Dashboard with multi-step flow
├── layout.tsx                 # Root layout
└── globals.css                # Global styles
```

### Component Structure

```
/components
├── landing
│   ├── Hero.tsx              # Hero section with CTA
│   └── Features.tsx          # Feature cards grid
├── dashboard
│   ├── CompanyInput.tsx      # Step 1: Company form
│   ├── ModelSelector.tsx     # Step 2: AI model selection
│   ├── VisibilityReport.tsx  # Step 3: Results container
│   ├── OverviewCard.tsx      # Overall score display
│   ├── QueryBreakdown.tsx    # Category breakdown
│   ├── CompetitorRankings.tsx # Competitor table
│   └── QueryLog.tsx          # Complete query data table
└── ui
    ├── card.tsx              # Existing
    ├── button.tsx            # To be added
    ├── input.tsx             # To be added
    ├── form.tsx              # To be added
    ├── select.tsx            # To be added
    ├── checkbox.tsx          # To be added
    ├── table.tsx             # To be added
    ├── tabs.tsx              # To be added
    ├── badge.tsx             # To be added
    ├── progress.tsx          # To be added
    ├── skeleton.tsx          # To be added
    └── label.tsx             # To be added
```

### Data Structure

```
/lib
├── utils.ts                  # Existing cn() utility
├── mockData.ts              # Mock API responses
└── types.ts                 # TypeScript interfaces
```

## Components and Interfaces

### 1. Landing Page Components

#### Hero Component (`components/landing/Hero.tsx`)

**Purpose**: Display the main value proposition and primary CTA

**Props**: None

**Structure**:
- Full viewport height container
- Centered content with logo icon (from lucide-react)
- Headline and subheadline text
- Primary button linking to /dashboard
- Gradient background with subtle animation

**Styling**:
- Uses Tailwind utilities for centering and spacing
- Responsive text sizing (text-4xl md:text-6xl)
- Button uses shadcn/ui Button component with "default" variant

#### Features Component (`components/landing/Features.tsx`)

**Purpose**: Showcase key application features

**Props**: None

**Structure**:
- Grid layout (1 column mobile, 2 columns tablet, 4 columns desktop)
- Feature cards using shadcn/ui Card component
- Each card contains:
  - Icon from lucide-react (Search, BarChart3, Users, FileText)
  - Feature title
  - Feature description

**Data**:
```typescript
const features = [
  {
    icon: Search,
    title: "Industry Detection",
    description: "Automatically identifies relevant queries for your industry"
  },
  {
    icon: BarChart3,
    title: "Multi-Model Testing",
    description: "Compare visibility across ChatGPT, Claude, Perplexity, and Gemini"
  },
  {
    icon: Users,
    title: "Competitor Analysis",
    description: "See how you rank against competitors in AI responses"
  },
  {
    icon: FileText,
    title: "Complete Query Transparency",
    description: "View every query tested with detailed results"
  }
]
```

### 2. Dashboard Components

#### Dashboard Page State Management

The dashboard uses React useState to manage the multi-step flow:

```typescript
type DashboardStep = 'input' | 'model-selection' | 'results';

interface CompanyData {
  name: string;
  website: string;
}

interface SelectedModels {
  models: string[];
}

const [step, setStep] = useState<DashboardStep>('input');
const [companyData, setCompanyData] = useState<CompanyData | null>(null);
const [selectedModels, setSelectedModels] = useState<string[]>([]);
const [isLoading, setIsLoading] = useState(false);
```

#### CompanyInput Component (`components/dashboard/CompanyInput.tsx`)

**Purpose**: Collect company information

**Props**:
```typescript
interface CompanyInputProps {
  onSubmit: (data: CompanyData) => void;
}
```

**Structure**:
- Form with controlled inputs for company name and website
- Validation: both fields required
- Submit button disabled until valid
- Uses shadcn/ui Form, Input, Label, Button components

**Validation Logic**:
```typescript
const isValid = companyName.trim() !== '' && website.trim() !== '';
```

#### ModelSelector Component (`components/dashboard/ModelSelector.tsx`)

**Purpose**: Allow selection of exactly 2 AI models

**Props**:
```typescript
interface ModelSelectorProps {
  onSubmit: (models: string[]) => void;
  onBack: () => void;
}
```

**Structure**:
- Heading with instructions
- Checkbox group for 4 models: ChatGPT, Claude, Perplexity, Gemini
- Validation message when selection count ≠ 2
- "Generate Report" button (disabled unless exactly 2 selected)
- "Back" button to return to company input

**State Management**:
```typescript
const [selected, setSelected] = useState<string[]>([]);

const handleToggle = (model: string) => {
  setSelected(prev => 
    prev.includes(model) 
      ? prev.filter(m => m !== model)
      : prev.length < 2 ? [...prev, model] : prev
  );
};

const isValid = selected.length === 2;
```

#### VisibilityReport Component (`components/dashboard/VisibilityReport.tsx`)

**Purpose**: Container for all results sections

**Props**:
```typescript
interface VisibilityReportProps {
  companyData: CompanyData;
  selectedModels: string[];
  onBack: () => void;
}
```

**Structure**:
- Loading state with Skeleton components (1-2 second delay)
- Once loaded, displays:
  - OverviewCard
  - QueryBreakdown
  - CompetitorRankings
  - QueryLog
  - Download button

**Loading Simulation**:
```typescript
useEffect(() => {
  setIsLoading(true);
  const timer = setTimeout(() => {
    setIsLoading(false);
  }, 1500);
  return () => clearTimeout(timer);
}, []);
```

#### OverviewCard Component (`components/dashboard/OverviewCard.tsx`)

**Purpose**: Display high-level visibility metrics

**Props**:
```typescript
interface OverviewCardProps {
  score: number;
  totalQueries: number;
  mentions: number;
  models: string[];
}
```

**Structure**:
- Large Card component
- Grid layout with 4 sections:
  - Visibility Score with Progress ring (large, prominent)
  - Total Queries (numeric display)
  - Mentions (numeric display)
  - Selected Models (badge list)

**Progress Ring**:
- Uses shadcn/ui Progress component
- Circular variant with percentage in center
- Color coding:
  - 0-33%: red/destructive
  - 34-66%: yellow/warning
  - 67-100%: green/success

#### QueryBreakdown Component (`components/dashboard/QueryBreakdown.tsx`)

**Purpose**: Show visibility by query category

**Props**:
```typescript
interface CategoryBreakdown {
  category: string;
  totalQueries: number;
  mentioned: number;
  visibility: number;
  topCompetitors: Array<{
    name: string;
    mentions: number;
    percentage: number;
  }>;
}

interface QueryBreakdownProps {
  breakdown: CategoryBreakdown[];
}
```

**Structure**:
- Tabs component with 4 tabs (one per category)
- Each tab content shows:
  - Visibility percentage (large)
  - Mention count / Total queries
  - Top 3 competitors list with their mention counts

**Categories**:
1. Product Selection
2. Comparison Queries
3. How-To Queries
4. Best-Of Lists

#### CompetitorRankings Component (`components/dashboard/CompetitorRankings.tsx`)

**Purpose**: Display competitor comparison table

**Props**:
```typescript
interface Competitor {
  name: string;
  mentions: number;
  visibility: number;
}

interface CompetitorRankingsProps {
  competitors: Competitor[];
}
```

**Structure**:
- Card with table inside
- Columns: Rank, Competitor Name, Mentions, Visibility %, Visual Bar
- Sorted by mentions (descending)
- Visual bar uses Progress component (horizontal)
- Minimum 5 competitors displayed

**Table Implementation**:
- Uses shadcn/ui Table component
- Responsive: stacks on mobile
- Alternating row colors for readability

#### QueryLog Component (`components/dashboard/QueryLog.tsx`)

**Purpose**: Display complete searchable query results

**Props**:
```typescript
interface QueryResult {
  id: string;
  query: string;
  mentioned: boolean;
  rank: number | null;
  competitors: string[];
  model: string;
}

interface QueryLogProps {
  queries: QueryResult[];
}
```

**Structure**:
- Search input at top
- Data table with columns:
  - Query Text (sortable)
  - Mentioned (✓/✗ icon)
  - Rank/Position (sortable, shows "-" if not mentioned)
  - Competitors Found (comma-separated list)
  - AI Model (sortable)
- Pagination (20 rows per page)
- Sort functionality on all columns

**Search Implementation**:
```typescript
const [searchTerm, setSearchTerm] = useState('');
const [sortColumn, setSortColumn] = useState<string | null>(null);
const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

const filteredQueries = queries.filter(q => 
  q.query.toLowerCase().includes(searchTerm.toLowerCase())
);
```

### 3. UI Components (shadcn/ui)

The following shadcn/ui components need to be added to the project:

#### Button (`components/ui/button.tsx`)
- Variants: default, destructive, outline, secondary, ghost, link
- Sizes: default, sm, lg, icon
- Uses class-variance-authority for variants

#### Input (`components/ui/input.tsx`)
- Standard text input with focus states
- Error state styling
- Disabled state

#### Form (`components/ui/form.tsx`)
- Form context provider
- FormField, FormItem, FormLabel, FormControl, FormMessage components
- Integration with react-hook-form (to be added as dependency)

#### Label (`components/ui/label.tsx`)
- Accessible label component
- Peer styling support

#### Checkbox (`components/ui/checkbox.tsx`)
- Custom checkbox with check icon
- Indeterminate state support
- Accessible with proper ARIA attributes

#### Select (`components/ui/select.tsx`)
- Dropdown select component
- Keyboard navigation
- Search functionality (optional)

#### Table (`components/ui/table.tsx`)
- Table, TableHeader, TableBody, TableRow, TableHead, TableCell components
- Responsive design
- Hover states

#### Tabs (`components/ui/tabs.tsx`)
- Tabs, TabsList, TabsTrigger, TabsContent components
- Keyboard navigation
- Active state styling

#### Badge (`components/ui/badge.tsx`)
- Variants: default, secondary, destructive, outline
- Small, pill-shaped labels

#### Progress (`components/ui/progress.tsx`)
- Linear progress bar
- Circular progress ring (custom variant)
- Percentage display

#### Skeleton (`components/ui/skeleton.tsx`)
- Loading placeholder
- Pulse animation
- Various size variants

## Data Models

### TypeScript Interfaces (`lib/types.ts`)

```typescript
export interface CompanyData {
  name: string;
  website: string;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
}

export interface QueryResult {
  id: string;
  query: string;
  mentioned: boolean;
  rank: number | null;
  competitors: string[];
  model: string;
  category: QueryCategory;
}

export type QueryCategory = 
  | 'Product Selection'
  | 'Comparison Queries'
  | 'How-To Queries'
  | 'Best-Of Lists';

export interface CategoryBreakdown {
  category: QueryCategory;
  totalQueries: number;
  mentioned: number;
  visibility: number;
  topCompetitors: CompetitorSummary[];
}

export interface CompetitorSummary {
  name: string;
  mentions: number;
  percentage: number;
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
```

### Mock Data (`lib/mockData.ts`)

The mock data generator will create realistic visibility reports based on company name and selected models:

```typescript
export function generateMockReport(
  companyName: string,
  models: string[]
): VisibilityReport {
  // Generate 50-100 queries across 4 categories
  // Randomize mention status with ~30-40% visibility
  // Create 5-8 competitors with varying mention counts
  // Ensure data consistency across all sections
}
```

**Mock Data Characteristics**:
- 50-100 total queries distributed across 4 categories
- Overall visibility score: 30-45% (realistic for most brands)
- 5-8 competitors with varying performance
- Queries include realistic industry-specific examples
- Competitor names are generic but industry-appropriate
- Rank positions range from 1-5 when mentioned

## Error Handling

### Form Validation

- **Client-side validation**: All form inputs validated before submission
- **Visual feedback**: Error messages displayed below invalid fields
- **Disabled states**: Submit buttons disabled until forms are valid
- **Error styling**: Red border and text for invalid inputs

### Loading States

- **Skeleton screens**: Display during data "loading" (1-2 second delay)
- **Button loading states**: Spinner icon and disabled state during submission
- **Graceful transitions**: Smooth fade-in when content loads

### Edge Cases

- **Empty states**: Display helpful messages when no data available
- **Long text handling**: Truncate with ellipsis, show full text on hover
- **Mobile responsiveness**: Ensure all components work on small screens
- **Browser compatibility**: Test on modern browsers (Chrome, Firefox, Safari, Edge)

## Testing Strategy

### Component Testing

- **Unit tests**: Test individual components in isolation
- **Props validation**: Ensure components handle all prop combinations
- **User interactions**: Test button clicks, form submissions, selections
- **Conditional rendering**: Verify correct display based on state

### Integration Testing

- **Multi-step flow**: Test complete dashboard workflow from input to results
- **Navigation**: Verify routing between landing page and dashboard
- **State management**: Ensure data persists correctly through steps
- **Mock data generation**: Verify consistent and realistic data

### Visual Testing

- **Responsive design**: Test on mobile, tablet, and desktop viewports
- **Component variants**: Verify all shadcn/ui component variants render correctly
- **Loading states**: Ensure skeleton screens display properly
- **Accessibility**: Test keyboard navigation and screen reader compatibility

### Manual Testing Checklist

1. Landing page loads with hero and features
2. "Get Started" button navigates to dashboard
3. Company input form validates correctly
4. Model selector enforces exactly 2 selections
5. Loading state displays for 1-2 seconds
6. Results display with all sections populated
7. Query log search and sort functions work
8. Download button triggers CSV download
9. Back buttons return to previous steps
10. Mobile layout adapts correctly

## Performance Considerations

### Optimization Strategies

- **Code splitting**: Use Next.js dynamic imports for dashboard components
- **Image optimization**: Use Next.js Image component for any images
- **Lazy loading**: Load query log data progressively if needed
- **Memoization**: Use React.memo for expensive components
- **Virtual scrolling**: Consider for query log if >100 items

### Bundle Size

- **Tree shaking**: Ensure unused lucide-react icons are removed
- **Component imports**: Import only needed shadcn/ui components
- **CSS optimization**: Tailwind purges unused styles in production

## Accessibility

### WCAG 2.1 AA Compliance

- **Keyboard navigation**: All interactive elements accessible via keyboard
- **Focus indicators**: Visible focus states on all focusable elements
- **ARIA labels**: Proper labels for icons and interactive elements
- **Color contrast**: Minimum 4.5:1 ratio for text
- **Screen readers**: Semantic HTML and ARIA attributes

### Specific Implementations

- **Form labels**: All inputs have associated labels
- **Button text**: Clear, descriptive button text
- **Table headers**: Proper th elements with scope attributes
- **Loading states**: Announce loading status to screen readers
- **Error messages**: Associate error messages with form fields

## Styling and Theming

### Color Palette

Using Tailwind CSS 4 with shadcn/ui color system:

- **Primary**: Blue tones for CTAs and interactive elements
- **Secondary**: Gray tones for text and borders
- **Success**: Green for high visibility scores
- **Warning**: Yellow/orange for medium visibility scores
- **Destructive**: Red for low visibility scores and errors
- **Muted**: Light gray for backgrounds and disabled states

### Typography

- **Headings**: Font weight 600-700, responsive sizing
- **Body text**: Font weight 400, 16px base size
- **Small text**: 14px for descriptions and labels
- **Monospace**: For data tables and technical content

### Spacing

- **Consistent scale**: Use Tailwind spacing scale (4px increments)
- **Component padding**: 24px (p-6) for cards
- **Section gaps**: 32px (gap-8) between major sections
- **Grid gaps**: 16px (gap-4) for feature cards

### Responsive Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (sm to lg)
- **Desktop**: > 1024px (lg+)

## Deployment Considerations

### Build Configuration

- **Static export**: Consider using `output: 'export'` for static hosting
- **Environment variables**: None required (all mock data)
- **Build optimization**: Enable React Compiler for performance

### Hosting Options

- **Vercel**: Recommended for Next.js (zero-config deployment)
- **Netlify**: Alternative with similar Next.js support
- **Static hosting**: Can export to static HTML/CSS/JS

### Browser Support

- **Modern browsers**: Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile browsers**: iOS Safari, Chrome Mobile
- **No IE11 support**: Uses modern JavaScript features

## Future Enhancements

### Potential Features

1. **Real API integration**: Connect to actual AI model APIs
2. **Historical tracking**: Store and compare reports over time
3. **Custom query sets**: Allow users to define their own test queries
4. **Export formats**: PDF reports in addition to CSV
5. **Team collaboration**: Share reports with team members
6. **Scheduled reports**: Automatic weekly/monthly report generation
7. **Alert system**: Notify when visibility drops below threshold
8. **More AI models**: Add support for additional models

### Technical Improvements

1. **Database integration**: Store company data and reports
2. **Authentication**: User accounts and login system
3. **API routes**: Next.js API routes for backend logic
4. **Real-time updates**: WebSocket for live query testing
5. **Advanced analytics**: Trend analysis and predictions
6. **A/B testing**: Test different query sets
7. **Internationalization**: Multi-language support

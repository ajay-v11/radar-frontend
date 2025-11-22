'use client';

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {UnifiedDashboard} from '@/components/dashboard/UnifiedDashboard';
import {ApiModeToggle} from '@/components/dev/ApiModeToggle';
import {ErrorDisplay} from '@/components/dashboard/ErrorDisplay';
import type {CompanyData} from '@/lib/types';
import type {CompanyAnalysisData} from '@/lib/api/types';
import type {FormattedError} from '@/lib/api/errors';

export default function DashboardPage() {
  const router = useRouter();
  const [error, setError] = useState<FormattedError | null>(null);

  // Initialize state from sessionStorage
  const [companyData] = useState<CompanyData | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = sessionStorage.getItem('companyData');
    return stored ? JSON.parse(stored) : null;
  });

  const [companyAnalysisData] = useState<CompanyAnalysisData | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = sessionStorage.getItem('companyAnalysisData');
    return stored ? JSON.parse(stored) : null;
  });

  // Redirect if no data
  useEffect(() => {
    if (!companyData || !companyAnalysisData) {
      router.push('/company-input');
    }
  }, [companyData, companyAnalysisData, router]);

  const handleBackToInput = () => {
    // Clear session storage and redirect to company input
    sessionStorage.removeItem('companyData');
    sessionStorage.removeItem('companyAnalysisData');
    router.push('/company-input');
  };

  const handleRetry = () => {
    setError(null);
  };

  const handleDismissError = () => {
    setError(null);
  };

  if (!companyData || !companyAnalysisData) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      {error ? (
        <ErrorDisplay
          error={error}
          onRetry={handleRetry}
          onDismiss={handleDismissError}
        />
      ) : (
        <UnifiedDashboard
          companyData={companyData}
          companyAnalysis={companyAnalysisData}
          onBack={handleBackToInput}
        />
      )}

      {/* API mode toggle - only visible in development */}
      <ApiModeToggle />
    </div>
  );
}

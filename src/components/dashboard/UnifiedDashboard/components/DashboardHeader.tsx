'use client';

import {Button} from '@/components/ui/button';

interface DashboardHeaderProps {
  onBack: () => void;
}

export function DashboardHeader({onBack}: DashboardHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="font-akira text-2xl font-bold text-[#f59e0b] md:text-3xl">
        Dashboard
      </h1>
      <Button variant="outline" onClick={onBack}>
        Back
      </Button>
    </div>
  );
}

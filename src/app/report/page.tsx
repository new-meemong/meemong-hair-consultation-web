'use client';

import { useSearchParams } from 'next/navigation';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { SiteHeader } from '@/widgets/header';
import ReportForm from '@/features/report/ui/report-form';

export default function ReportPage() {
  const searchParams = useSearchParams();
  const reportTargetId = searchParams.get(SEARCH_PARAMS.REPORT_TARGET_ID);

  if (!reportTargetId) return null;

  return (
    <div className="h-screen flex flex-col">
      <SiteHeader showBackButton title="신고하기" />
      <ReportForm targetUserId={reportTargetId} />
    </div>
  );
}

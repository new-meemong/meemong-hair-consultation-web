'use client';

import PostBoard from '@/widgets/post/ui/post-board';
import { SiteHeader } from '@/widgets/header';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';

export default function ExperienceGroupBoardPage() {
  const { source } = useRouterWithUser();
  return (
    <PostBoard
      experienceOnly
      header={source !== 'app' ? <SiteHeader title="체험단 신청" /> : undefined}
    />
  );
}

'use client';

import PostBoard from '@/widgets/post/ui/post-board';
import { SiteHeader } from '@/widgets/header';
import { useOptionalBrand } from '@/shared/context/brand-context';

export default function PostsPage() {
  const brand = useOptionalBrand();
  return <PostBoard header={brand ? <SiteHeader title="헤어상담" /> : undefined} />;
}

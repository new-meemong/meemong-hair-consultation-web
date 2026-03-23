import { redirect } from 'next/navigation';

// 폼이 posts/create로 이동하여 complete는 더 이상 사용하지 않음
export default async function Page({
  params,
}: {
  params: Promise<{ brandSlug: string }>;
}) {
  const { brandSlug } = await params;
  redirect(`/${brandSlug}/posts/create`);
}

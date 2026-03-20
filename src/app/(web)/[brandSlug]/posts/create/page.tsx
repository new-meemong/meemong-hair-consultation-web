import { redirect } from 'next/navigation';

import { getBrandConfig } from '@/shared/config/brands';
import { getConsultationFlow } from '@/shared/lib/get-consultation-flow';
import { stepIdToPath } from '@/shared/constants/consultation-steps';
import { cookies } from 'next/headers';

// 컨설팅 create 엔트리: 항상 첫 번째 step으로 리다이렉트
export default async function Page({
  params,
}: {
  params: Promise<{ brandSlug: string }>;
}) {
  const { brandSlug } = await params;

  const devOverride =
    process.env.NODE_ENV === 'development' ? (await cookies()).get('brand_override')?.value : null;

  const slug = devOverride ?? brandSlug;
  const brand = getBrandConfig(slug);
  if (!brand) redirect(`/${brandSlug}/welcome`);

  const flow = getConsultationFlow(brand);
  const firstStep = flow[0];

  redirect(`/${slug}/posts/create/${stepIdToPath[firstStep.stepId]}`);
}

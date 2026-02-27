import { ROUTES } from '@/shared';
import { redirect } from 'next/navigation';

type LegacyPostDetailPageProps = {
  params: Promise<{ postingId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const toSearchParamString = (params: { [key: string]: string | string[] | undefined }) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, item));
      return;
    }

    if (typeof value === 'string') {
      searchParams.append(key, value);
    }
  });

  return searchParams.toString();
};

export default async function LegacyPostDetailPage({
  params,
  searchParams,
}: LegacyPostDetailPageProps) {
  const { postingId } = await params;
  const query = toSearchParamString(await searchParams);
  const destination = ROUTES.POSTS_DETAIL(postingId);

  redirect(query ? `${destination}?${query}` : destination);
}

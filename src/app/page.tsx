import { redirect } from 'next/navigation';

import { ROUTES } from '@/shared';

type HomePageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const userId = params.userId;

  // userId가 있으면 쿼리 파라미터를 유지하면서 리디렉션
  if (userId) {
    redirect(`${ROUTES.POSTS}?userId=${userId}`);
  }

  // userId가 없으면 기본 리디렉션
  redirect(ROUTES.POSTS);
}

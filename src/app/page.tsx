import { redirect } from 'next/navigation';

import { ROUTES } from '@/shared';

type HomePageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function Home({ searchParams }: HomePageProps) {
  const userId = searchParams.userId;

  // userId가 있으면 쿼리 파라미터를 유지하면서 리디렉션
  if (userId) {
    redirect(`${ROUTES.POSTS}?userId=${userId}`);
  }

  // userId가 없으면 기본 리디렉션
  redirect(ROUTES.POSTS);
}

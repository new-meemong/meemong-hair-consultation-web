import { ROUTES } from '@/shared';
import { redirect } from 'next/navigation';

type HomePageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const userId = params.userId;
  const source = params.source;

  const query = new URLSearchParams();
  if (typeof userId === 'string' && userId) {
    query.set('userId', userId);
  }
  if (typeof source === 'string' && source) {
    query.set('source', source);
  }

  redirect(query.toString() ? `${ROUTES.POSTS}?${query.toString()}` : ROUTES.POSTS);
}

import { redirect } from 'next/navigation';

import { ROUTES } from '@/shared';

export default function Home() {
  redirect(ROUTES.POSTS);
}

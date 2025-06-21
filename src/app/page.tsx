import { ROUTES } from '@/shared';
import { redirect } from 'next/navigation';

export default function Home() {
  redirect(ROUTES.POSTS);
}

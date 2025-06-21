'use server';

import { revalidatePath } from 'next/cache';
import { fetchPostsByTab, type TabType } from '../api/postApi';
import { ROUTES } from '@/shared';

/**
 * 피드 목록을 가져오는 서버 액션
 */
export async function getPostByTabAction(tab: TabType) {
  try {
    const posts = await fetchPostsByTab(tab);
    return { success: true, data: posts };
  } catch (error) {
    console.error('피드 목록 조회 실패:', error);
    return { success: false, error: '피드 목록을 불러오는데 실패했습니다.' };
  }
}

/**
 * 피드 페이지 재검증
 */
export async function revalidatePostsPage() {
  revalidatePath(ROUTES.POSTS);
}

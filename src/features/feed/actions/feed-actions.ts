'use server';

import { revalidatePath } from 'next/cache';
import { fetchFeedsByTab, type TabType } from '../api/feedApi';

/**
 * 피드 목록을 가져오는 서버 액션
 */
export async function getFeedsByTabAction(tab: TabType) {
  try {
    const feeds = await fetchFeedsByTab(tab);
    return { success: true, data: feeds };
  } catch (error) {
    console.error('피드 목록 조회 실패:', error);
    return { success: false, error: '피드 목록을 불러오는데 실패했습니다.' };
  }
}

/**
 * 피드 페이지 재검증
 */
export async function revalidateFeedPage() {
  revalidatePath('/feed');
}

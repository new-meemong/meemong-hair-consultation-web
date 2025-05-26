import { RECENT_FEEDS, POPULAR_FEEDS, MY_FEEDS } from '@/entities/feed';
import { Feed } from '@/entities/feed/model/types';

/**
 * 피드 탭 유형
 */
export type TabType = 'recent' | 'popular' | 'my' | 'commented' | 'liked';

/**
 * 피드 상세 정보 조회
 * @param feedId 피드 ID
 * @returns 피드 상세 정보 또는 null
 */
export const fetchFeedDetail = (feedId: string): Promise<Feed | null> => {
  return new Promise((resolve) => {
    // 개발용 지연 시간 (스켈레톤 확인용)
    const delay = process.env.NODE_ENV === 'development' ? 2000 : 300;

    setTimeout(() => {
      // 모든 피드 데이터를 합쳐서 중복을 제거
      const allFeeds = [...RECENT_FEEDS, ...POPULAR_FEEDS, ...MY_FEEDS].filter(
        (feed, index, self) => self.findIndex((f) => f.id === feed.id) === index,
      );

      // ID로 피드 찾기
      const foundFeed = allFeeds.find((item) => item.id === feedId);
      resolve(foundFeed || null);
    }, delay);
  });
};

/**
 * 피드 목록 조회 (탭 기준)
 * @param tab 탭 유형
 * @returns 피드 목록
 */
export const fetchFeedsByTab = (tab: TabType): Promise<Feed[]> => {
  return new Promise((resolve) => {
    // 개발용 지연 시간 (스켈레톤 확인용)
    const delay = process.env.NODE_ENV === 'development' ? 2000 : 300;

    setTimeout(() => {
      switch (tab) {
        case 'recent':
          resolve(RECENT_FEEDS);
          break;
        case 'popular':
          resolve(POPULAR_FEEDS);
          break;
        case 'my':
          resolve(MY_FEEDS);
          break;
        case 'commented':
          resolve([...RECENT_FEEDS].slice(0, 3)); // 임시 데이터
          break;
        case 'liked':
          resolve([...POPULAR_FEEDS].slice(0, 3)); // 임시 데이터
          break;
        default:
          resolve(RECENT_FEEDS);
      }
    }, delay);
  });
};

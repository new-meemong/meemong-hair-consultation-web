import { RECENT_POSTS, POPULAR_POSTS, MY_POSTS, type Post } from '@/entities/posts';
import { type TabType } from '../types/tabs';

/**
 * 게시글 상세 정보 조회
 * @param postId 게시글 ID
 * @returns 게시글 상세 정보 또는 null
 */
export const fetchPostDetail = (postId: string): Promise<Post | null> => {
  return new Promise((resolve) => {
    const delay = process.env.NODE_ENV === 'development' ? 2000 : 300;

    setTimeout(() => {
      const allPosts = [...RECENT_POSTS, ...POPULAR_POSTS, ...MY_POSTS].filter(
        (post, index, self) => self.findIndex((p) => p.id === post.id) === index,
      );

      const foundPost = allPosts.find((item) => item.id === postId);
      resolve(foundPost || null);
    }, delay);
  });
};

/**
 * 피드 목록 조회 (탭 기준)
 * @param tab 탭 유형
 * @returns 피드 목록
 */
export const fetchPostsByTab = (tab: TabType): Promise<Post[]> => {
  return new Promise((resolve) => {
    // 개발용 지연 시간 (스켈레톤 확인용)
    const delay = process.env.NODE_ENV === 'development' ? 2000 : 300;

    setTimeout(() => {
      switch (tab) {
        case 'recent':
          resolve(RECENT_POSTS);
          break;
        case 'popular':
          resolve(POPULAR_POSTS);
          break;
        case 'my':
          resolve(MY_POSTS);
          break;
        case 'commented':
          resolve([...RECENT_POSTS].slice(0, 3)); // 임시 데이터
          break;
        case 'liked':
          resolve([...POPULAR_POSTS].slice(0, 3)); // 임시 데이터
          break;
        default:
          resolve(RECENT_POSTS);
      }
    }, delay);
  });
};

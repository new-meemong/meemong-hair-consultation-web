import { FeedData } from './types';

// 예시 데이터
export const MOCK_FEEDS: FeedData[] = [
  {
    id: '1',
    author: {
      name: '김민수',
      avatar: 'https://picsum.photos/150/150',
    },
    content:
      '제 머리 스타일 어떤가요? 저는 좀 마음에 드는데 미용실에서 이정도 머리는 얼마인가요? 미용실에서 이정도 머리는 일마인가요?',
    imageUrl: 'https://picsum.photos/200/200',
    createdAt: '36분전',
    views: 36,
    likes: 36,
    comments: 36,
    location: '강남구 청담동',
  },
  {
    id: '2',
    author: {
      name: '이지연',
      avatar: 'https://picsum.photos/150/150',
    },
    content:
      '미용실에서 이정도 머리는 얼마인가요? 미용실에서 이정도 머리는 얼마인가요? 미용실에서 이정도 머리는 얼마인가요?',
    createdAt: '1시간전',
    views: 42,
    likes: 18,
    comments: 5,
  },
  {
    id: '3',
    author: {
      name: '박서준',
      avatar: 'https://picsum.photos/150/150',
    },
    content: '제 머리 스타일 어떤가요? 저는 좀 마음에 드는데 미용실에서 이정도 머리는 일마인가요?',
    imageUrl: 'https://picsum.photos/200/200',
    createdAt: '2시간전',
    views: 128,
    likes: 57,
    comments: 22,
    location: '서울시 마포구',
  },
];

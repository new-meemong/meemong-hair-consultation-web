import { Banner, Feed } from './types';

// 예시 데이터
export const MOCK_FEEDS: Feed[] = [
  {
    id: '1',
    author: '김민수',
    title: '제 머리 스타일 어떤가요? 저는 좀 마음에 드는데',
    content:
      '미용실에서 이정도 머리는 얼마인가요? 미용실에서 이정도 머리는 얼마인가요? 미용실에서 이정도 머리는 얼마인가요?미용실에서 이정도 머리는 얼마인가요?미용실에서 이정도 머리는 얼마인가요?',
    imageUrl: 'https://picsum.photos/200/200',
    createdAt: '36분전',
    views: 36,
    likes: 36,
    comments: 36,
  },
  {
    id: '2',
    author: '이지연',
    title: '제 머리 스타일 어떤가요? 저는 좀 마음에 드는데',
    content:
      '미용실에서 이정도 머리는 얼마인가요? 미용실에서 이정도 머리는 얼마인가요? 미용실에서 이정도 머리는 얼마인가요?',
    createdAt: '1시간전',
    views: 42,
    likes: 18,
    comments: 5,
  },
  {
    id: '3',
    author: '박서준',
    title: '제 머리 스타일 어떤가요? 저는 좀 마음에 드는데',
    content: '미용실에서 이정도 머리는 일마인가요?',
    imageUrl: 'https://picsum.photos/200/200',
    createdAt: '2시간전',
    views: 128,
    likes: 57,
    comments: 22,
  },
  {
    id: '4',
    author: '정다은',
    title: '머리 색상 추천해주세요! 염색하고 싶은데',
    content:
      '봄에 어울리는 머리 색상 추천해주세요. 밝은 갈색이나 핑크 브라운 중에 고민중인데 피부톤이 노란편이라서 걱정이에요.',
    imageUrl: 'https://picsum.photos/200/200',
    createdAt: '3시간전',
    views: 210,
    likes: 79,
    comments: 45,
  },
  {
    id: '5',
    author: '최우진',
    title: '남자 머리 투블럭 어떤가요?',
    content:
      '요즘 투블럭 스타일이 유행이라고 해서 시도해봤는데 괜찮은지 솔직한 평가 부탁드려요. 처음이라 어색한 것 같기도 하고...',
    imageUrl: 'https://picsum.photos/200/200',
    createdAt: '5시간전',
    views: 156,
    likes: 48,
    comments: 31,
  },
  {
    id: '6',
    author: '한소희',
    title: '앞머리 길이 이정도면 어울릴까요?',
    content: '앞머리를 처음 잘랐는데 좀 짧게 잘라진 것 같아요. 이 정도면 괜찮은지 의견 부탁드려요.',
    createdAt: '7시간전',
    views: 184,
    likes: 93,
    comments: 52,
  },
  {
    id: '7',
    author: '윤준호',
    title: '헤어 왁스 추천해주세요',
    content:
      '머리숱이 많고 뻣뻣한 머리인데 자연스럽게 스타일링할 수 있는 왁스나 제품 추천해주세요. 기존에 쓰던 것은 너무 뻣뻣하게 고정되어서...',
    createdAt: '12시간전',
    views: 98,
    likes: 27,
    comments: 35,
  },
  {
    id: '8',
    author: '송지원',
    title: '파마 유지하는 팁 있을까요?',
    content:
      '일주일 전에 파마했는데 벌써 많이 풀린 것 같아요. 파마 오래 유지하는 특별한 방법이나 제품 있으면 알려주세요.',
    imageUrl: 'https://picsum.photos/200/200',
    createdAt: '1일전',
    views: 245,
    likes: 104,
    comments: 67,
  },
  {
    id: '9',
    author: '강민재',
    title: '머리 기르는 중인데 중간 단계가 너무 힘드네요',
    content:
      '짧은 머리에서 긴 머리로 기르는 중인데 이 중간 단계가 정말 감당이 안되네요. 어떻게 스타일링하면 좋을지 조언 부탁드려요.',
    createdAt: '1일전',
    views: 133,
    likes: 42,
    comments: 28,
  },
];

// 최신글 데이터
export const RECENT_FEEDS: Feed[] = [
  {
    id: '1',
    author: '익명',
    title: '제 머리 스타일 어떤가요? 저는 좀 마음에 드는...',
    content:
      '미용실에서 이정도 머리는 얼마인가요? 미용실에서 이정도 머리는 얼마인가요?미용실에서 이정도 머리는 얼마인가요? 미용실에서 이정도 머리는 얼마인가요?',
    createdAt: '방금 전',
    views: 36,
    likes: 36,
    comments: 36,
  },
  {
    id: '2',
    author: '익명',
    title: '제 머리 스타일 어떤가요? 저는...',
    content:
      '미용실에서 이정도 머리는 얼마인가요? 미용실에서 이정도 머리는 얼마인가요?미용실에서 이정도 머리는 얼마인가요?',
    imageUrl: '/sample-hair.jpg',
    createdAt: '12분전',
    views: 36,
    likes: 36,
    comments: 36,
  },
  {
    id: '3',
    author: '익명',
    title: '제 머리 스타일 어떤가요? 저는 좀 마음에 드는...',
    content:
      '미용실에서 이정도 머리는 얼마인가요? 미용실에서 이정도 머리는 얼마인가요?미용실에서 이정도 머리는 얼마인가요? 미용실에서 이정도 머리는 얼마인가요?',
    createdAt: '18시간 전',
    views: 36,
    likes: 36,
    comments: 36,
  },
];

// 인기글 데이터
export const POPULAR_FEEDS: Feed[] = [
  {
    id: '4',
    author: '익명',
    title: '펌 했는데 어떤가요? 디자이너가 추천해줬어요',
    content:
      '오늘 미용실에서 디자이너분이 추천해주신 스타일로 했는데 어떤가요? 제 얼굴형에 어울리나요?',
    imageUrl: '/sample-hair.jpg',
    createdAt: '2일 전',
    views: 256,
    likes: 120,
    comments: 58,
  },
  {
    id: '5',
    author: '익명',
    title: '염색 색상 추천해주세요! 밝은 색상 vs 어두운 색상',
    content:
      '머리 염색하려고 하는데 밝은 색상과 어두운 색상 중에 고민이에요. 제 피부톤에는 어떤 게 어울릴까요?',
    createdAt: '3일 전',
    views: 189,
    likes: 95,
    comments: 42,
  },
  {
    id: '6',
    author: '익명',
    title: '남자 투블럭 길이 어느 정도가 적당할까요?',
    content: '투블럭 하려고 하는데 위에 얼마나 남겨야 할지 모르겠어요. 전문가분들 조언 부탁드려요!',
    createdAt: '1주일 전',
    views: 320,
    likes: 150,
    comments: 60,
  },
];

// 내 상담글 데이터
export const MY_FEEDS: Feed[] = [
  {
    id: '7',
    author: '나',
    title: '앞머리 어떻게 잘라야 할까요?',
    content:
      '앞머리를 바꾸고 싶은데 어떤 스타일이 좋을지 고민이에요. 제 얼굴형에 맞는 스타일 추천해주세요.',
    createdAt: '1일 전',
    views: 45,
    likes: 20,
    comments: 15,
  },
  {
    id: '8',
    author: '나',
    title: '파마 유지하는 방법 알려주세요',
    content: '일주일 전에 파마했는데 벌써 많이 풀려버렸어요. 파마를 오래 유지하는 방법 있을까요?',
    createdAt: '5일 전',
    views: 78,
    likes: 32,
    comments: 24,
  },
];

// 댓글 단 글 데이터
export const COMMENTED_FEEDS: Feed[] = [
  {
    id: '9',
    author: '익명',
    title: '댓글 단 글 제목',
    content: '댓글 단 글 내용',
    createdAt: '1일 전',
    views: 100,
    likes: 50,
    comments: 20,
  },
];

// 좋아한 글 데이터
export const LIKED_FEEDS: Feed[] = [
  {
    id: '10',
    author: '익명',
    title: '좋아한 글 제목',
    content: '좋아한 글 내용',
    createdAt: '1일 전',
    views: 100,
    likes: 50,
    comments: 20,
  },
];

export const BANNERS: Banner[] = [
  {
    id: '1',
    title: 'MEEMONG',
    subtitle: '우리동네 헤어상담은',
    bgColor: 'bg-emerald-500',
  },
  {
    id: '2',
    title: '헤어상담',
    subtitle: '디자이너에게 물어보세요',
    bgColor: 'bg-blue-500',
  },
  {
    id: '3',
    title: '머리 고민',
    subtitle: '다양한 스타일을 찾아보세요',
    bgColor: 'bg-purple-500',
  },
];

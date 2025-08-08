import type { ValueOf } from '@/shared/type/types';

import type { FaceTypeOption } from '../types/face-type';

export const FACE_TYPE = {
  OVAL: 'oval',
  DIAMOND: 'diamond',
  HEART: 'heart',
  PEANUT: 'peanut',
  HEXAGONAL: 'hexagonal',
  ROUND: 'round',
} as const;

export const FACE_TYPE_OPTION: Record<ValueOf<typeof FACE_TYPE>, FaceTypeOption> = {
  [FACE_TYPE.OVAL]: {
    label: '계란형',
    value: FACE_TYPE.OVAL,
    description: '광대/턱 부각 없는 얼굴형',
    emptyImage: '/oval-face.svg',
    selectedImage: '/selected-oval-face.svg',
  },
  [FACE_TYPE.DIAMOND]: {
    label: '마름모형',
    value: FACE_TYPE.DIAMOND,
    description: '광대 부각, 턱 부각 없음',
    emptyImage: '/diamond-face.svg',
    selectedImage: '/selected-diamond-face.svg',
  },
  [FACE_TYPE.HEART]: {
    label: '하트형',
    value: FACE_TYPE.HEART,
    description: '광대/턱 부각, 광대가 더 부각됨',
    emptyImage: '/heart-face.svg',
    selectedImage: '/selected-heart-face.svg',
  },
  [FACE_TYPE.PEANUT]: {
    label: '땅콩형',
    value: FACE_TYPE.PEANUT,
    description: '광대/턱 모두 비슷하게 부각',
    emptyImage: '/peanut-face.svg',
    selectedImage: '/selected-peanut-face.svg',
  },
  [FACE_TYPE.HEXAGONAL]: {
    label: '육각형',
    value: FACE_TYPE.HEXAGONAL,
    description: '광대 부각 없음, 턱 부각 있음',
    emptyImage: '/hexagonal-face.svg',
    selectedImage: '/selected-hexagonal-face.svg',
  },
  [FACE_TYPE.ROUND]: {
    label: '둥근형',
    value: FACE_TYPE.ROUND,
    description: '둥근 얼굴형',
    emptyImage: '/round-face.svg',
    selectedImage: '/selected-round-face.svg',
  },
} as const;

export const FACE_TYPE_OPTIONS = Object.values(FACE_TYPE_OPTION);

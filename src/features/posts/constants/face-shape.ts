import type { ValueOf } from '@/shared/type/types';

import type { FaceShapeOption } from '../types/face-shape';

export const FACE_SHAPE = {
  OVAL: 'oval',
  DIAMOND: 'diamond',
  HEART: 'heart',
  PEANUT: 'peanut',
  HEXAGONAL: 'hexagonal',
  ROUND: 'round',
} as const;

export const FACE_SHAPE_LABEL = {
  [FACE_SHAPE.OVAL]: '계란형',
  [FACE_SHAPE.DIAMOND]: '마름모형',
  [FACE_SHAPE.HEART]: '하트형',
  [FACE_SHAPE.PEANUT]: '땅콩형',
  [FACE_SHAPE.HEXAGONAL]: '육각형',
  [FACE_SHAPE.ROUND]: '둥근형',
} as const;

export const FACE_SHAPE_OPTION: Record<ValueOf<typeof FACE_SHAPE>, FaceShapeOption> = {
  [FACE_SHAPE.OVAL]: {
    label: FACE_SHAPE_LABEL[FACE_SHAPE.OVAL],
    value: FACE_SHAPE.OVAL,
    description: '광대/턱 부각 없는 얼굴형',
    emptyImage: '/oval-face.svg',
    selectedImage: '/selected-oval-face.svg',
  },
  [FACE_SHAPE.DIAMOND]: {
    label: FACE_SHAPE_LABEL[FACE_SHAPE.DIAMOND],
    value: FACE_SHAPE.DIAMOND,
    description: '광대 부각, 턱 부각 없음',
    emptyImage: '/diamond-face.svg',
    selectedImage: '/selected-diamond-face.svg',
  },
  [FACE_SHAPE.HEART]: {
    label: FACE_SHAPE_LABEL[FACE_SHAPE.HEART],
    value: FACE_SHAPE.HEART,
    description: '광대/턱 부각, 광대가 더 부각됨',
    emptyImage: '/heart-face.svg',
    selectedImage: '/selected-heart-face.svg',
  },
  [FACE_SHAPE.PEANUT]: {
    label: FACE_SHAPE_LABEL[FACE_SHAPE.PEANUT],
    value: FACE_SHAPE.PEANUT,
    description: '광대/턱 모두 비슷하게 부각',
    emptyImage: '/peanut-face.svg',
    selectedImage: '/selected-peanut-face.svg',
  },
  [FACE_SHAPE.HEXAGONAL]: {
    label: FACE_SHAPE_LABEL[FACE_SHAPE.HEXAGONAL],
    value: FACE_SHAPE.HEXAGONAL,
    description: '광대 부각 없음, 턱 부각 있음',
    emptyImage: '/hexagonal-face.svg',
    selectedImage: '/selected-hexagonal-face.svg',
  },
  [FACE_SHAPE.ROUND]: {
    label: FACE_SHAPE_LABEL[FACE_SHAPE.ROUND],
    value: FACE_SHAPE.ROUND,
    description: '둥근 얼굴형',
    emptyImage: '/round-face.svg',
    selectedImage: '/selected-round-face.svg',
  },
} as const;

export const FACE_TYPE_OPTIONS = Object.values(FACE_SHAPE_OPTION);

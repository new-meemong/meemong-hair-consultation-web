import type { ValueOf } from '@/shared/type/types';
import faceType1Select from '@/assets/face-type/face_type1_select.png';
import faceType1Unselect from '@/assets/face-type/face_type1_unselect.png';
import faceType2Select from '@/assets/face-type/face_type2_select.png';
import faceType2Unselect from '@/assets/face-type/face_type2_unselect.png';
import faceType3Select from '@/assets/face-type/face_type3_select.png';
import faceType3Unselect from '@/assets/face-type/face_type3_unselect.png';
import faceType4Select from '@/assets/face-type/face_type4_select.png';
import faceType4Unselect from '@/assets/face-type/face_type4_unselect.png';
import faceType5Select from '@/assets/face-type/face_type5_select.png';
import faceType5Unselect from '@/assets/face-type/face_type5_unselect.png';
import faceType6Select from '@/assets/face-type/face_type6_select.png';
import faceType6Unselect from '@/assets/face-type/face_type6_unselect.png';
import faceType7Select from '@/assets/face-type/face_type7_select.png';
import faceType7Unselect from '@/assets/face-type/face_type7_unselect.png';
import faceType8Select from '@/assets/face-type/face_type8_select.png';
import faceType8Unselect from '@/assets/face-type/face_type8_unselect.png';

import type { FaceShapeOption } from '../types/face-shape';

export const FACE_SHAPE = {
  OVAL: 'oval',
  DIAMOND: 'diamond',
  LONG: 'long',
  SQUARE: 'square',
  HEART: 'heart',
  PEANUT: 'peanut',
  HEXAGONAL: 'hexagonal',
  ROUND: 'round',
} as const;

export const FACE_SHAPE_LABEL = {
  [FACE_SHAPE.OVAL]: '계란형',
  [FACE_SHAPE.DIAMOND]: '마름모형',
  [FACE_SHAPE.LONG]: '긴 얼굴형',
  [FACE_SHAPE.SQUARE]: '네모형',
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
    emptyImage: faceType2Unselect,
    selectedImage: faceType2Select,
  },
  [FACE_SHAPE.LONG]: {
    label: FACE_SHAPE_LABEL[FACE_SHAPE.LONG],
    value: FACE_SHAPE.LONG,
    description: '세로로 길고 슬림한 턱 선',
    emptyImage: faceType3Unselect,
    selectedImage: faceType3Select,
  },
  [FACE_SHAPE.SQUARE]: {
    label: FACE_SHAPE_LABEL[FACE_SHAPE.SQUARE],
    value: FACE_SHAPE.SQUARE,
    description: '옆턱과 광대가 균형있게 발달',
    emptyImage: faceType5Unselect,
    selectedImage: faceType5Select,
  },
  [FACE_SHAPE.HEART]: {
    label: FACE_SHAPE_LABEL[FACE_SHAPE.HEART],
    value: FACE_SHAPE.HEART,
    description: '광대/턱 부각, 광대가 더 부각됨',
    emptyImage: faceType6Unselect,
    selectedImage: faceType6Select,
  },
  [FACE_SHAPE.PEANUT]: {
    label: FACE_SHAPE_LABEL[FACE_SHAPE.PEANUT],
    value: FACE_SHAPE.PEANUT,
    description: '광대/턱 모두 비슷하게 부각',
    emptyImage: faceType7Unselect,
    selectedImage: faceType7Select,
  },
  [FACE_SHAPE.HEXAGONAL]: {
    label: FACE_SHAPE_LABEL[FACE_SHAPE.HEXAGONAL],
    value: FACE_SHAPE.HEXAGONAL,
    description: '광대 부각 없음, 턱 부각 있음',
    emptyImage: faceType8Unselect,
    selectedImage: faceType8Select,
  },
  [FACE_SHAPE.ROUND]: {
    label: FACE_SHAPE_LABEL[FACE_SHAPE.ROUND],
    value: FACE_SHAPE.ROUND,
    description: '둥근 얼굴형',
    emptyImage: faceType4Unselect,
    selectedImage: faceType4Select,
  },
} as const;

export const FACE_TYPE_OPTIONS = [
  FACE_SHAPE_OPTION[FACE_SHAPE.OVAL],
  FACE_SHAPE_OPTION[FACE_SHAPE.DIAMOND],
  FACE_SHAPE_OPTION[FACE_SHAPE.HEART],
  FACE_SHAPE_OPTION[FACE_SHAPE.PEANUT],
  FACE_SHAPE_OPTION[FACE_SHAPE.HEXAGONAL],
  FACE_SHAPE_OPTION[FACE_SHAPE.ROUND],
];

export const FACE_TYPE_OPTIONS_NEW = [
  {
    ...FACE_SHAPE_OPTION[FACE_SHAPE.OVAL],
    description: '부각되는 부위 없음',
    emptyImage: faceType1Unselect,
    selectedImage: faceType1Select,
  },
  {
    ...FACE_SHAPE_OPTION[FACE_SHAPE.LONG],
    description: '세로로 길고 슬림한 턱 선',
    emptyImage: faceType3Unselect,
    selectedImage: faceType3Select,
  },
  {
    ...FACE_SHAPE_OPTION[FACE_SHAPE.SQUARE],
    description: '옆턱과 광대가 균형있게 발달',
    emptyImage: faceType5Unselect,
    selectedImage: faceType5Select,
  },
  {
    ...FACE_SHAPE_OPTION[FACE_SHAPE.ROUND],
    description: '가로세로 균형, 곡선형',
    emptyImage: faceType4Unselect,
    selectedImage: faceType4Select,
  },
  {
    ...FACE_SHAPE_OPTION[FACE_SHAPE.PEANUT],
    description: '들어간 볼, 옆 턱과 광대 발달',
    emptyImage: faceType7Unselect,
    selectedImage: faceType7Select,
  },
  {
    ...FACE_SHAPE_OPTION[FACE_SHAPE.DIAMOND],
    description: '광대 및 이마 발달, 슬림한 턱 선',
    emptyImage: faceType2Unselect,
    selectedImage: faceType2Select,
  },
  {
    ...FACE_SHAPE_OPTION[FACE_SHAPE.HEXAGONAL],
    description: '이마와 옆 턱 발달',
    emptyImage: faceType8Unselect,
    selectedImage: faceType8Select,
  },
  {
    ...FACE_SHAPE_OPTION[FACE_SHAPE.HEART],
    description: '광대 발달, 슬림한 턱선',
    emptyImage: faceType6Unselect,
    selectedImage: faceType6Select,
  },
] satisfies FaceShapeOption[];

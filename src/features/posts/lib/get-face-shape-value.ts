import type { ValueOf } from '@/shared/type/types';

import { FACE_SHAPE, FACE_SHAPE_LABEL } from '../constants/face-shape';

export default function getFaceShapeValue(faceShapeLabel: ValueOf<typeof FACE_SHAPE_LABEL>) {
  const value = Object.entries(FACE_SHAPE_LABEL).find(([, label]) => label === faceShapeLabel)?.[0];

  return value ? (value as ValueOf<typeof FACE_SHAPE>) : null;
}

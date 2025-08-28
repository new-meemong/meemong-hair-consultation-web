import type { ValueOf } from '@/shared/type/types';

import type { FACE_SHAPE, FACE_SHAPE_LABEL } from '../constants/face-shape';

export type FaceShapeOption = {
  label: ValueOf<typeof FACE_SHAPE_LABEL>;
  value: ValueOf<typeof FACE_SHAPE>;
  description: string;
  emptyImage: string;
  selectedImage: string;
};

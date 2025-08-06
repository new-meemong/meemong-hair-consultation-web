import type { ValueOf } from '@/shared/type/types';

import type { FACE_TYPE } from '../constants/face-type';

export type FaceTypeOption = {
  label: string;
  value: ValueOf<typeof FACE_TYPE>;
  description: string;
  emptyImage: string;
  selectedImage: string;
};

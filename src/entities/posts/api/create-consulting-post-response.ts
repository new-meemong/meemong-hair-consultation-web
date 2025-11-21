import type { SKIN_TONE_OPTION_LABEL } from '@/features/posts/constants/skin-tone';

import type { ValueOf } from '@/shared/type/types';

type NewHairConsultPosting = {
  id: number;
  userId: number;
  title: string;
  content: string;
  isPhotoVisibleToDesigner: boolean;
  consultType: 'consulting';
  currentStep: number;
  isCompleted: boolean;
  hairConcern: string;
  hasNoRecentTreatment: boolean;
  skinTone: ValueOf<typeof SKIN_TONE_OPTION_LABEL>;
  repImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

type Treatment = {
  id: number;
  hairConsultPostingId: number;
  treatmentName: string;
  treatmentDate: string;
  createdAt: string;
  updatedAt: string;
};

type MyImages = {
  id: number;
  hairConsultPostingId: number;
  frontLooseImageUrl: string;
  frontTiedImageUrl: string;
  sideTiedImageUrl: string;
  upperBodyImageUrl: string;
  createdAt: string;
  updatedAt: string;
};

type AspirationImage = {
  id: number;
  hairConsultPostingId: number;
  imageUrl: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateConsultingPostResponse = {
  data: {
    newHairConsultPosting: NewHairConsultPosting;
    treatments: Treatment[];
    myImages: MyImages;
    aspirationImages: AspirationImage[];
  };
};

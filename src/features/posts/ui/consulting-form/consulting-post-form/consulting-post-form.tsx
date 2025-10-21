import { useFormContext } from 'react-hook-form';

import { HAIR_CONCERN_OPTION_VALUE } from '@/features/posts/constants/hair-concern-option';
import type { FormStep } from '@/shared/type/form-step';
import type { KeyOf } from '@/shared/type/types';
import MultiStepForm from '@/shared/ui/multi-step-form';

import { CONSULTING_POST_FORM_FIELD_NAME } from '../../../constants/consulting-post-form-field-name';
import { type ConsultingPostFormValues } from '../../../types/consulting-post-form-values';

import ConsultingPostFormStepAspirationImages from './consulting-post-form-step-aspiration-images';
import ConsultingPostFormStepMyImages from './consulting-post-form-step-my-images';
import ConsultingPostFormStepPrice from './consulting-post-form-step-price';
import ConsultingPostFormStepSkinTone from './consulting-post-form-step-skin-tone';
import ConsultingPostFormStepTitleAndConcern from './consulting-post-form-step-title-and-concern';
import ConsultingPostFormStepTreatments from './consulting-post-form-step-treatments';

const CONSULTING_POST_FORM_STEPS: FormStep<ConsultingPostFormValues>[] = [
  {
    name: [CONSULTING_POST_FORM_FIELD_NAME.TITLE, CONSULTING_POST_FORM_FIELD_NAME.CONCERN],
    required: true,
    children: <ConsultingPostFormStepTitleAndConcern />,
  },
  {
    name: CONSULTING_POST_FORM_FIELD_NAME.SKIN_TONE,
    question: '피부톤을 알려주세요',
    required: false,
    children: <ConsultingPostFormStepSkinTone />,
  },
  {
    name: CONSULTING_POST_FORM_FIELD_NAME.ASPIRATION_IMAGES,
    question: '선호하는 스타일을 알려주세요',
    required: false,
    children: <ConsultingPostFormStepAspirationImages />,
  },
  {
    name: CONSULTING_POST_FORM_FIELD_NAME.MY_IMAGES,
    question: '내 사진을 업로드 해주세요',
    description: '올린 사진은 디자이너만 볼 수 있습니다',
    required: true,
    children: <ConsultingPostFormStepMyImages />,
  },
  {
    name: CONSULTING_POST_FORM_FIELD_NAME.TREATMENTS,
    question: '최근 받은 헤어시술을 알려주세요',
    description:
      ' • 필수작성: 탈색, 블랙계열 염색, 신데렐라 등 특수시술\n • 요구이력: 기장이 어깨선보다 긴 경우 3년 이상, 숏컷은 약 1년치 이력이 필요합니다.',
    required: true,
    children: <ConsultingPostFormStepTreatments />,
  },
];

type ConsultingPostFormProps = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onSubmit: (values: ConsultingPostFormValues) => void;
};

export default function ConsultingPostForm({
  currentStep,
  setCurrentStep,
  onSubmit,
}: ConsultingPostFormProps) {
  const method = useFormContext<ConsultingPostFormValues>();

  const canMoveNext = (name: KeyOf<ConsultingPostFormValues>): boolean => {
    if (name === CONSULTING_POST_FORM_FIELD_NAME.TITLE) {
      const formValue = method.getValues(name);
      return !!formValue && formValue.length > 0;
    }

    if (name === CONSULTING_POST_FORM_FIELD_NAME.CONCERN) {
      const formValue = method.getValues(name);
      return (
        (formValue?.value && formValue.value !== HAIR_CONCERN_OPTION_VALUE.ETC) ||
        (formValue?.value === HAIR_CONCERN_OPTION_VALUE.ETC && !!formValue?.additional)
      );
    }

    if (name === CONSULTING_POST_FORM_FIELD_NAME.TREATMENTS) {
      const formValue = method.getValues(name);
      return formValue === null || formValue?.length > 0;
    }

    if (name === CONSULTING_POST_FORM_FIELD_NAME.MY_IMAGES) {
      const formValue = method.getValues(name);
      return formValue && formValue.length === 4;
    }

    return true;
  };

  const canMoveNextStep = (
    name: KeyOf<ConsultingPostFormValues> | Array<KeyOf<ConsultingPostFormValues>>,
  ): boolean => {
    if (Array.isArray(name)) {
      return name.every((name) => canMoveNext(name));
    }

    return canMoveNext(name);
  };

  return (
    <MultiStepForm
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      steps={CONSULTING_POST_FORM_STEPS}
      canMoveNext={canMoveNextStep}
      onSubmit={onSubmit}
      lastStepButtonLabel="완료"
    />
  );
}

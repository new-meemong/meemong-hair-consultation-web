import { useFormContext } from 'react-hook-form';

import { HAIR_CONCERN_OPTION_VALUE } from '@/features/posts/constants/hair-concern-option';
import type { FormStep } from '@/shared/type/form-step';
import type { KeyOf } from '@/shared/type/types';
import MultiStepForm from '@/shared/ui/multi-step-form';

import { CONSULTING_POST_FORM_FIELD_NAME } from '../../../constants/consulting-post-form-field-name';
import { type ConsultingPostFormValues } from '../../../types/consulting-post-form-values';

import ConsultingPostFormStepAspirationImages from './consulting-post-form-step-aspiration-images';
import ConsultingPostFormStepContent from './consulting-post-form-step-content';
import ConsultingPostFormStepMyImages from './consulting-post-form-step-my-images';
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
    name: CONSULTING_POST_FORM_FIELD_NAME.TREATMENTS,
    question: '시술 이력을 알려주세요',
    description:
      ' • 자세히 작성할수록 답변받을 확률이 높아요\n • 기장이 길수록 자세한 이력이 필요해요\n   (가슴선 이상: 최소 3년 / 단발: 2년 / 숏컷 : 1년)',
    required: true,
    children: <ConsultingPostFormStepTreatments />,
  },
  {
    name: CONSULTING_POST_FORM_FIELD_NAME.MY_IMAGES,
    question: '내 사진을 업로드 해주세요',
    description: '올린 사진은 디자이너만 볼 수 있습니다',
    required: true,
    children: <ConsultingPostFormStepMyImages />,
  },
  {
    name: CONSULTING_POST_FORM_FIELD_NAME.ASPIRATION_IMAGES,
    question: '원하는 스타일을 알려주세요',
    required: false,
    children: <ConsultingPostFormStepAspirationImages />,
  },
  {
    name: CONSULTING_POST_FORM_FIELD_NAME.SKIN_TONE,
    question: '피부톤을 알려주세요',
    required: false,
    children: <ConsultingPostFormStepSkinTone />,
  },
  {
    name: CONSULTING_POST_FORM_FIELD_NAME.CONTENT,
    question: '기타 요청사항을 적어주세요',
    required: false,
    children: <ConsultingPostFormStepContent />,
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

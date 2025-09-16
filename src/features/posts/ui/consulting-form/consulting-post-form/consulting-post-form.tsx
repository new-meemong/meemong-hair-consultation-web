import { useFormContext } from 'react-hook-form';

import { HAIR_CONCERN_OPTION_VALUE } from '@/features/posts/constants/hair-concern-option';
import type { FormStep } from '@/shared/type/form-step';
import type { KeyOf } from '@/shared/type/types';
import MultiStepForm from '@/shared/ui/multi-step-form';

import { CONSULTING_POST_FORM_FIELD_NAME } from '../../../constants/consulting-post-form-field-name';
import { type ConsultingPostFormValues } from '../../../types/consulting-post-form-values';

import ConsultingPostFormStepAspirationImages from './consulting-post-form-step-aspiration-images';
import ConsultingPostFormStepConcern from './consulting-post-form-step-concern';
import ConsultingPostFormStepContent from './consulting-post-form-step-content';
import ConsultingPostFormStepMyImages from './consulting-post-form-step-my-images';
import ConsultingPostFormStepSkinTone from './consulting-post-form-step-skin-tone';
import ConsultingPostFormStepTitle from './consulting-post-form-step-title';
import ConsultingPostFormStepTreatments from './consulting-post-form-step-treatments';

const CONSULTING_POST_FORM_STEPS: FormStep<ConsultingPostFormValues>[] = [
  {
    name: CONSULTING_POST_FORM_FIELD_NAME.CONCERN,
    question: '어떤 헤어 고민이 있나요?',
    required: true,
    children: <ConsultingPostFormStepConcern />,
  },
  {
    name: CONSULTING_POST_FORM_FIELD_NAME.TREATMENTS,
    question: '최근 받은 헤어시술을 알려주세요',
    description: '탈색, 블랙염색 등 중요 시술은 2년전 이력도 필요해요',
    required: true,
    children: <ConsultingPostFormStepTreatments />,
  },
  {
    name: CONSULTING_POST_FORM_FIELD_NAME.MY_IMAGES,
    question: '최근 내 모습을 보여주세요',
    description: '올리신 사진은 디자이너들에게만 공개되며, 모델은 볼 수 없습니다.',
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
  {
    name: CONSULTING_POST_FORM_FIELD_NAME.TITLE,
    question: '글 제목을 입력하세요',
    description: '작성하지 않으면 고민 유형에 따라 자동으로 제목이 부여됩니다',
    required: false,
    children: <ConsultingPostFormStepTitle />,
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

  const canMoveNext = (name: KeyOf<ConsultingPostFormValues>) => {
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

  return (
    <MultiStepForm
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      steps={CONSULTING_POST_FORM_STEPS}
      canMoveNext={canMoveNext}
      onSubmit={onSubmit}
      lastStepButtonLabel="저장"
    />
  );
}

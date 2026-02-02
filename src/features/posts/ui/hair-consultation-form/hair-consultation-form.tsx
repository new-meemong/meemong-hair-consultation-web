import { AppTypography } from '@/shared/styles/typography';
import type { FormStep } from '@/shared/type/form-step';
import { HAIR_CONSULTATION_FORM_FIELD_NAME } from '../../constants/hair-consultation-form-field-name';
import HairConsultationFormStepAspirationImages from './hair-consultation-form-step-aspiration-images';
import HairConsultationFormStepMyImages from './hair-consultation-form-step-my-images';
import HairConsultationFormStepPrice from './hair-consultation-form-step-price';
import HairConsultationFormStepProfile from './hair-consultation-form-step-profile';
import HairConsultationFormStepTitleContent from './hair-consultation-form-step-title-content';
import HairConsultationFormStepTreatments from './hair-consultation-form-step-treatments';
import type { HairConsultationFormValues } from '../../types/hair-consultation-form-values';
import type { KeyOf } from '@/shared/type/types';
import MultiStepForm from '@/shared/ui/multi-step-form';
import { useFormContext } from 'react-hook-form';

const HAIR_CONSULTATION_FORM_STEPS: FormStep<HairConsultationFormValues>[] = [
  {
    name: [
      HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_LENGTH,
      HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_CONCERNS,
      HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_TEXTURE,
      HAIR_CONSULTATION_FORM_FIELD_NAME.SKIN_BRIGHTNESS,
      HAIR_CONSULTATION_FORM_FIELD_NAME.PERSONAL_COLOR,
    ],
    question: '현재 머리/피부 상태로 업데이트해주세요',
    description: '정보가 다르면 상담 결과가 달라질 수 있어요.',
    required: true,
    containerClassName: 'pt-7 gap-1.5',
    questionClassName: `${AppTypography.headlineSemiBold} text-label-default`,
    descriptionClassName: `${AppTypography.body2LongRegular} text-label-info`,
    hideRequired: true,
    children: <HairConsultationFormStepProfile />,
  },
  {
    name: HAIR_CONSULTATION_FORM_FIELD_NAME.TREATMENTS,
    question: '시술 이력',
    required: false,
    children: <HairConsultationFormStepTreatments />,
  },
  {
    name: HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES,
    question: '원하는 스타일 / 추구미',
    required: false,
    children: <HairConsultationFormStepAspirationImages />,
  },
  {
    name: HAIR_CONSULTATION_FORM_FIELD_NAME.PRICE,
    question: '희망 시술금액',
    required: true,
    children: <HairConsultationFormStepPrice />,
  },
  {
    name: HAIR_CONSULTATION_FORM_FIELD_NAME.MY_IMAGES,
    question: '내 사진 업로드',
    required: true,
    children: <HairConsultationFormStepMyImages />,
  },
  {
    name: [
      HAIR_CONSULTATION_FORM_FIELD_NAME.TITLE,
      HAIR_CONSULTATION_FORM_FIELD_NAME.CONTENT,
    ],
    question: '제목 및 내용 작성',
    required: true,
    children: <HairConsultationFormStepTitleContent />,
  },
];

type HairConsultationFormProps = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onSubmit: (values: HairConsultationFormValues) => void;
};

export default function HairConsultationForm({
  currentStep,
  setCurrentStep,
  onSubmit,
}: HairConsultationFormProps) {
  const method = useFormContext<HairConsultationFormValues>();

  const canMoveNext = (name: KeyOf<HairConsultationFormValues>): boolean => {
    if (name === HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_CONCERNS) {
      const formValue = method.getValues(name) as string[];
      return formValue?.length > 0;
    }

    if (name === HAIR_CONSULTATION_FORM_FIELD_NAME.TREATMENTS) {
      const formValue = method.getValues(name);
      return formValue === null || (Array.isArray(formValue) && formValue.length > 0);
    }

    if (name === HAIR_CONSULTATION_FORM_FIELD_NAME.MY_IMAGES) {
      const formValue = method.getValues(name);
      return formValue && formValue.length === 4;
    }

    if (name === HAIR_CONSULTATION_FORM_FIELD_NAME.PRICE) {
      const formValue = method.getValues(name);
      return formValue.minPaymentPrice !== null && formValue.maxPaymentPrice !== null;
    }

    if (name === HAIR_CONSULTATION_FORM_FIELD_NAME.TITLE) {
      const formValue = method.getValues(name);
      return !!formValue && formValue.length > 0;
    }

    if (name === HAIR_CONSULTATION_FORM_FIELD_NAME.CONTENT) {
      const formValue = method.getValues(name);
      return !!formValue && formValue.length > 0;
    }

    return !!method.getValues(name);
  };

  const canMoveNextStep = (
    name: KeyOf<HairConsultationFormValues> | Array<KeyOf<HairConsultationFormValues>>,
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
      steps={HAIR_CONSULTATION_FORM_STEPS}
      canMoveNext={canMoveNextStep}
      onSubmit={onSubmit}
      lastStepButtonLabel="완료"
    />
  );
}

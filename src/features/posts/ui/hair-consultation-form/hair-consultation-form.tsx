import { useFormContext, useWatch } from 'react-hook-form';

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
import { useAuthContext } from '@/features/auth/context/auth-context';

const BASE_FORM_STEPS: FormStep<HairConsultationFormValues>[] = [
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
    question: '최근 N개월 내 받은 시술을 입력해주세요',
    description: '각 시술을 누르면 세부사항을 입력할 수 있어요',
    required: true,
    questionClassName: `${AppTypography.headlineSemiBold} text-label-default`,
    children: <HairConsultationFormStepTreatments />,
  },
  {
    name: HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES,
    question: '원하는 스타일이나 추구미를 알려주세요',
    description: '자세히 적을수록 답변받을 확률이 높아요',
    required: true,
    questionClassName: `${AppTypography.headlineSemiBold} text-label-default`,
    children: <HairConsultationFormStepAspirationImages />,
  },
  {
    name: HAIR_CONSULTATION_FORM_FIELD_NAME.PRICE,
    question: '희망하는 최대 시술 금액을 알려주세요',
    required: true,
    questionClassName: `${AppTypography.headlineSemiBold} text-label-default`,
    containerClassName: 'gap-6',
    children: <HairConsultationFormStepPrice />,
  },
  {
    name: HAIR_CONSULTATION_FORM_FIELD_NAME.MY_IMAGES,
    required: true,
    children: <HairConsultationFormStepMyImages />,
  },
  {
    name: [HAIR_CONSULTATION_FORM_FIELD_NAME.TITLE, HAIR_CONSULTATION_FORM_FIELD_NAME.CONTENT],
    required: true,
    children: <HairConsultationFormStepTitleContent />,
  },
];

type HairConsultationFormProps = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onSubmit: (values: HairConsultationFormValues) => void;
  isSubmitting?: boolean;
};

export default function HairConsultationForm({
  currentStep,
  setCurrentStep,
  onSubmit,
  isSubmitting = false,
}: HairConsultationFormProps) {
  const method = useFormContext<HairConsultationFormValues>();
  const { user } = useAuthContext();
  const selectedHairLength = useWatch({
    control: method.control,
    name: HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_LENGTH,
  });

  const getTreatmentMonthsLabel = () => {
    const isMale = user.sex === '남자';
    const hairLength = selectedHairLength;

    if (!hairLength) return 'N개월';

    if (isMale) {
      switch (hairLength) {
        case '크롭':
        case '숏':
          return '1개월';
        case '미디엄':
          return '3개월';
        case '미디엄롱':
          return '6개월';
        case '롱':
          return '1년';
        case '장발':
          return '2년';
        default:
          return 'N개월';
      }
    }

    switch (hairLength) {
      case '숏컷':
        return '6개월';
      case '단발':
        return '1년';
      case '중단발':
        return '2년';
      case '미디엄':
      case '미디엄롱':
      case '롱':
        return '3년';
      default:
        return 'N개월';
    }
  };

  const treatmentQuestion = `최근 ${getTreatmentMonthsLabel()} 내 받은 시술을 입력해주세요`;

  const steps = BASE_FORM_STEPS.map((step) => {
    if (step.name === HAIR_CONSULTATION_FORM_FIELD_NAME.TREATMENTS) {
      return {
        ...step,
        question: treatmentQuestion,
      };
    }
    return step;
  });

  const canMoveNext = (name: KeyOf<HairConsultationFormValues>): boolean => {
    if (name === HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_CONCERNS) {
      const formValue = method.getValues(name) as string[];
      return formValue?.length > 0;
    }

    if (name === HAIR_CONSULTATION_FORM_FIELD_NAME.TREATMENTS) {
      const formValue = method.getValues(name) as HairConsultationFormValues['treatments'];
      if (!Array.isArray(formValue) || formValue.length === 0) return false;
      const isMale = user.sex === '남자';
      const specialTreatment = isMale ? '커트만 했어요' : '커트/드라이만 했어요';
      const type1Treatments = ['일반염색', '블랙염색', '블랙빼기'] as const;
      const type2Treatments = ['일반펌', '열펌/셋팅펌', '매직', '탈색'] as const;
      const type3FemaleTreatments = ['클리닉', '특수클리닉(신데렐라 등)'] as const;

      return formValue.every((item) => {
        if (item.treatmentType === specialTreatment) return true;
        if (type1Treatments.includes(item.treatmentType as (typeof type1Treatments)[number])) {
          return !!item.treatmentArea;
        }
        if (!isMale) {
          if (type2Treatments.includes(item.treatmentType as (typeof type2Treatments)[number])) {
            return !!item.treatmentArea;
          }
          if (
            type3FemaleTreatments.includes(
              item.treatmentType as (typeof type3FemaleTreatments)[number],
            )
          ) {
            return true;
          }
          return true;
        }
        return true;
      });
    }

    if (name === HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES) {
      const formValue = method.getValues(name) as HairConsultationFormValues['aspirationImages'];
      const hasImages = Array.isArray(formValue?.images) && formValue.images.length > 0;
      const hasDescription = !!formValue?.description?.trim();
      return hasImages || hasDescription;
    }

    if (name === HAIR_CONSULTATION_FORM_FIELD_NAME.MY_IMAGES) {
      const formValue = method.getValues(name);
      if (!Array.isArray(formValue)) return false;
      const hasFront = formValue.some((item) => item.type === 'FRONT');
      const hasSide = formValue.some((item) => item.type === 'SIDE');
      const hasRecent = formValue.some((item) => item.type === 'RECENT');
      return hasFront && hasSide && hasRecent;
    }

    if (name === HAIR_CONSULTATION_FORM_FIELD_NAME.PRICE) {
      const formValue = method.getValues(name);
      return formValue.maxPaymentPrice !== null && formValue.maxPaymentPrice >= 10000;
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
      steps={steps}
      canMoveNext={canMoveNextStep}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      lastStepButtonLabel="완료"
    />
  );
}

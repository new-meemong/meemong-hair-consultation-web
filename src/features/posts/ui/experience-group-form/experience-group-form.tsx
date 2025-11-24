import { useFormContext } from 'react-hook-form';

import type { FormStep } from '@/shared/type/form-step';
import type { KeyOf } from '@/shared/type/types';
import MultiStepForm from '@/shared/ui/multi-step-form';

import ExperienceGroupFormStepPriceType from './experience-group-form-step-price-type';
import ExperienceGroupFormStepSnsTypes from './experience-group-form-step-sns-types';
import ExperienceGroupFormStepTitleAndContent from './experience-group-form-step-title-and-content';
import { EXPERIENCE_GROUP_FORM_FIELD_NAME } from '../../constants/experience-group/experience-group-form-field-name';
import { EXPERIENCE_GROUP_PRICE_TYPE } from '../../constants/experience-group-price-type';
import type { ExperienceGroupFormValues } from '../../types/experience-group-form-values';


const EXPERIENCE_GROUP_FORM_STEPS: FormStep<ExperienceGroupFormValues>[] = [
  {
    name: EXPERIENCE_GROUP_FORM_FIELD_NAME.PRICE_TYPE,
    question: '원하는 비용 타입을 선택해주세요',
    required: true,
    children: <ExperienceGroupFormStepPriceType />,
  },
  {
    name: EXPERIENCE_GROUP_FORM_FIELD_NAME.SNS_TYPES,
    question: '협찬할 내 SNS와 링크를 입력하세요',
    required: true,
    children: <ExperienceGroupFormStepSnsTypes />,
  },
  {
    name: [EXPERIENCE_GROUP_FORM_FIELD_NAME.TITLE, EXPERIENCE_GROUP_FORM_FIELD_NAME.CONTENT],
    required: true,
    children: <ExperienceGroupFormStepTitleAndContent />,
  },
];

type ExperienceGroupFormProps = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onSubmit: (values: ExperienceGroupFormValues) => void;
};

export default function ExperienceGroupForm({
  currentStep,
  setCurrentStep,
  onSubmit,
}: ExperienceGroupFormProps) {
  const method = useFormContext<ExperienceGroupFormValues>();

  const canMoveNext = (name: KeyOf<ExperienceGroupFormValues>): boolean => {
    if (name === EXPERIENCE_GROUP_FORM_FIELD_NAME.PRICE_TYPE) {
      const formValue = method.getValues(name);
      const price = method.getValues(EXPERIENCE_GROUP_FORM_FIELD_NAME.PRICE);

      if (!formValue) return false;

      if (
        formValue === EXPERIENCE_GROUP_PRICE_TYPE.PAY ||
        formValue === EXPERIENCE_GROUP_PRICE_TYPE.MATERIAL_COST
      ) {
        return !!price;
      }

      return true;
    }

    if (name === EXPERIENCE_GROUP_FORM_FIELD_NAME.SNS_TYPES) {
      const formValue = method.getValues(name);
      return formValue && formValue.length > 0;
    }

    if (name === EXPERIENCE_GROUP_FORM_FIELD_NAME.TITLE) {
      const formValue = method.getValues(name);
      return !!formValue && formValue.length > 0;
    }

    if (name === EXPERIENCE_GROUP_FORM_FIELD_NAME.CONTENT) {
      const formValue = method.getValues(name);
      return !!formValue && formValue.length > 0;
    }

    return true;
  };

  const canMoveNextStep = (
    name: KeyOf<ExperienceGroupFormValues> | Array<KeyOf<ExperienceGroupFormValues>>,
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
      steps={EXPERIENCE_GROUP_FORM_STEPS}
      canMoveNext={canMoveNextStep}
      onSubmit={onSubmit}
      lastStepButtonLabel="완료"
    />
  );
}

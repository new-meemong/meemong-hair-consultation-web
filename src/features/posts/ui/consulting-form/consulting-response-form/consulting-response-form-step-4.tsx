import { useFormContext, useWatch } from 'react-hook-form';
import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../../constants/consulting-response-form-field-name';
import type { ConsultingResponseFormValues } from '../../../types/consulting-response-form-values';
import ConsultingFormOptionList from '../consulting-form-option-list';
import ConsultingResponseFormOptionNeedConsultation from './consulting-response-form-option-need-consultation';

export const MALE_BANG_STYLE = {
  COVERED_FOREHEAD: 'coveredForehead',
  EXPOSED_FOREHEAD: 'exposedForehead',
  ALL: 'all',
} as const;

export const FEMALE_BANG_STYLE = {
  NO_BANGS: 'noBangs',
  SIDE_SWEPT_BANGS: 'sideSweptBangs',
  STRAIGHT_BANGS: 'straightBangs',
  ALL: 'all',
} as const;

const BANG_STYLE_OPTIONS = {
  MALE: [
    {
      label: '이마를 가리는 스타일',
      value: MALE_BANG_STYLE.COVERED_FOREHEAD,
    },
    {
      label: '이마가 보이는 스타일',
      value: MALE_BANG_STYLE.EXPOSED_FOREHEAD,
    },
    {
      label: '모두 다 잘 어울려요',
      value: MALE_BANG_STYLE.ALL,
    },
  ],
  FEMALE: [
    {
      label: '앞머리 없는 스타일',
      value: FEMALE_BANG_STYLE.NO_BANGS,
    },
    {
      label: '앞머리 넘기는 스타일',
      value: FEMALE_BANG_STYLE.SIDE_SWEPT_BANGS,
    },
    {
      label: '앞머리 내리는 스타일',
      value: FEMALE_BANG_STYLE.STRAIGHT_BANGS,
    },
    {
      label: '모두 다 잘 어울려요',
      value: FEMALE_BANG_STYLE.ALL,
    },
  ],
};

export default function ConsultingResponseFormStep4() {
  const { control, setValue } = useFormContext<ConsultingResponseFormValues>();

  const formValue = useWatch({
    control,
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.option4,
  });

  const needStoreConsulting = formValue === null;

  const handleNeedStoreConsultingChange = () => {
    setValue(CONSULTING_RESPONSE_FORM_FIELD_NAME.option4, needStoreConsulting ? undefined : null, {
      shouldDirty: true,
    });
  };

  const isMale = false;
  const options = isMale ? BANG_STYLE_OPTIONS.MALE : BANG_STYLE_OPTIONS.FEMALE;

  return (
    <div className="flex flex-col gap-7">
      <ConsultingFormOptionList
        options={options}
        name={CONSULTING_RESPONSE_FORM_FIELD_NAME.option4}
      />
      <ConsultingResponseFormOptionNeedConsultation
        value={needStoreConsulting}
        onChange={handleNeedStoreConsultingChange}
      />
    </div>
  );
}

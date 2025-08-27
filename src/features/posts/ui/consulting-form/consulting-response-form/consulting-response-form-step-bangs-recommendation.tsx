import { useFormContext, useWatch } from 'react-hook-form';

import { isUserMale } from '@/entities/user/lib/user-sex';
import { BANG_STYLE_OPTIONS } from '@/features/posts/constants/bang-style';
import { usePostDetail } from '@/features/posts/context/post-detail-context';

import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../../constants/consulting-response-form-field-name';
import type { ConsultingResponseFormValues } from '../../../types/consulting-response-form-values';
import ConsultingFormOptionList from '../consulting-form-option-list';

import ConsultingResponseFormOptionNeedConsultation from './consulting-response-form-option-need-consultation';

export default function ConsultingResponseFormStepBangsRecommendation() {
  const { postDetail } = usePostDetail();

  const isMale = isUserMale(postDetail.hairConsultPostingCreateUserSex);

  const options = isMale ? BANG_STYLE_OPTIONS.MALE : BANG_STYLE_OPTIONS.FEMALE;

  const { control, setValue } = useFormContext<ConsultingResponseFormValues>();

  const formValue = useWatch({
    control,
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.BANGS_RECOMMENDATION,
  });

  const needStoreConsulting = formValue.needStoreConsulting;

  const handleNeedStoreConsultingChange = () => {
    setValue(
      CONSULTING_RESPONSE_FORM_FIELD_NAME.BANGS_RECOMMENDATION,
      { value: null, needStoreConsulting: !needStoreConsulting },
      {
        shouldDirty: true,
      },
    );
  };

  return (
    <div className="flex flex-col gap-7">
      <ConsultingFormOptionList
        options={options}
        name={CONSULTING_RESPONSE_FORM_FIELD_NAME.BANGS_RECOMMENDATION}
      />
      <ConsultingResponseFormOptionNeedConsultation
        value={needStoreConsulting}
        onChange={handleNeedStoreConsultingChange}
      />
    </div>
  );
}

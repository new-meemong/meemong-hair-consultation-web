import { Textarea } from '@/shared';
import FormItem from '@/shared/ui/form-item';
import { useFormContext } from 'react-hook-form';
import { CONSULTING_POST_FORM_FIELD_NAME } from '../../constants/consulting-post-form-field-name';
import type { ConsultingPostFormValues } from '../../types/consulting-post-form-values';
import ConsultingFormOptionList from '../consulting-form-option-list';
import type { ConsultingFormOption } from '../../types/consulting-form-option';

export default function ConsultingPostFormStep1() {
  const method = useFormContext<ConsultingPostFormValues>();

  const options: ConsultingFormOption[] = [
    {
      label: '원하는 스타일이 어울릴지/가능할지 궁금해요',
      value: '원하는 스타일이 어울릴지/가능할지 궁금해요',
    },
    {
      label: '어울리는 스타일을 추천 받고 싶어요',
      value: '어울리는 스타일을 추천 받고 싶어요',
    },
    {
      label: '기타',
      value: '기타',
      additional: (
        <FormItem label="기타 고민 상세 입력" required>
          <Textarea
            {...method.register(`${CONSULTING_POST_FORM_FIELD_NAME.option1}.additional`)}
            placeholder="어떤 고민이 있는지 상세히 설명해주세요"
            className="min-h-38"
            hasBorder
          />
        </FormItem>
      ),
    },
  ];

  return (
    <ConsultingFormOptionList
      options={options}
      name={`${CONSULTING_POST_FORM_FIELD_NAME.option1}.value`}
    />
  );
}

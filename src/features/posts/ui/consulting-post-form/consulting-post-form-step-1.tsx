import { Textarea } from '@/shared';
import FormItemWithLabel from '@/shared/ui/form-item-with-label';
import { useFormContext } from 'react-hook-form';
import { CONSULTING_POST_FORM_FIELD_NAME } from '../../constants/consulting-post-form-field-name';
import type { ConsultingPostFormValues } from '../../types/consulting-post-form-values';
import ConsultingPostFormOptionList from './consulting-post-form-option-list';

export default function ConsultingPostFormStep1() {
  const method = useFormContext<ConsultingPostFormValues>();

  const options = [
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
        <FormItemWithLabel label="기타 고민 상세 입력" required>
          <Textarea
            {...method.register(`${CONSULTING_POST_FORM_FIELD_NAME.option1}.additional`)}
            placeholder="어떤 고민이 있는지 상세히 설명해주세요"
            className="min-h-38"
            hasBorder
          />
        </FormItemWithLabel>
      ),
    },
  ];

  return (
    <ConsultingPostFormOptionList
      options={options}
      name={`${CONSULTING_POST_FORM_FIELD_NAME.option1}.value`}
    />
  );
}

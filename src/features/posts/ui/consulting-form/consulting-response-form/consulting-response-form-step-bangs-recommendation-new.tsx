import Image from 'next/image';
import { useFormContext, useWatch } from 'react-hook-form';

import { isUserMale } from '@/entities/user/lib/user-sex';
import {
  BANG_STYLE_OPTIONS_NEW,
  type BangStyleOptionNew,
} from '@/features/posts/constants/bang-style';
import { usePostDetail } from '@/features/posts/context/post-detail-context';
import { cn } from '@/lib/utils';

import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../../constants/consulting-response-form-field-name';
import type { ConsultingResponseFormValues } from '../../../types/consulting-response-form-values';
import ConsultingResponseFormOptionNeedConsultation from './consulting-response-form-option-need-consultation';

type BangStyleCardProps = {
  option: BangStyleOptionNew;
  selected: boolean;
  onClick: () => void;
};

function BangStyleCard({ option, selected, onClick }: BangStyleCardProps) {
  return (
    <button type="button" className="flex flex-col gap-2 text-left" onClick={onClick}>
      <div className="rounded-4 size-40 overflow-hidden bg-alternative">
        <Image
          src={selected ? option.selectedImage : option.unselectedImage}
          alt={option.title}
          width={160}
          height={160}
          className="size-40 object-cover"
          priority
        />
      </div>
      <div className="flex flex-col">
        <p
          className={cn(
            'typo-body-2-medium',
            selected ? 'text-cautionary' : 'text-label-default',
          )}
        >
          {option.title}
        </p>
        <p className="typo-body-2-regular text-label-sub">{option.description}</p>
      </div>
    </button>
  );
}

export default function ConsultingResponseFormStepBangsRecommendationNew() {
  const { postDetail } = usePostDetail();

  const isMale = isUserMale(postDetail.hairConsultPostingCreateUserSex);
  const options = isMale ? BANG_STYLE_OPTIONS_NEW.MALE : BANG_STYLE_OPTIONS_NEW.FEMALE;

  const { control, setValue } = useFormContext<ConsultingResponseFormValues>();

  const formValue = useWatch({
    control,
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.BANGS_RECOMMENDATION,
  });

  const selectedValues = formValue.values ?? [];
  const needStoreConsulting = formValue.needStoreConsulting;

  const handleNeedStoreConsultingChange = () => {
    setValue(
      CONSULTING_RESPONSE_FORM_FIELD_NAME.BANGS_RECOMMENDATION,
      { value: null, values: [], needStoreConsulting: !needStoreConsulting },
      {
        shouldDirty: true,
      },
    );
  };

  const handleSelect = (
    value: ConsultingResponseFormValues['bangsRecommendation']['values'][number],
  ) => {
    const nextValues = selectedValues.includes(value)
      ? selectedValues.filter((selectedValue) => selectedValue !== value)
      : [...selectedValues, value];

    setValue(
      CONSULTING_RESPONSE_FORM_FIELD_NAME.BANGS_RECOMMENDATION,
      { value: null, values: nextValues, needStoreConsulting: false },
      {
        shouldDirty: true,
      },
    );
  };

  return (
    <div className="flex flex-col gap-7">
      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        {options.map((option) => (
          <BangStyleCard
            key={option.value}
            option={option}
            selected={selectedValues.includes(option.value)}
            onClick={() => handleSelect(option.value)}
          />
        ))}
      </div>
      <ConsultingResponseFormOptionNeedConsultation
        value={needStoreConsulting}
        onChange={handleNeedStoreConsultingChange}
        id={CONSULTING_RESPONSE_FORM_FIELD_NAME.BANGS_RECOMMENDATION}
      />
    </div>
  );
}

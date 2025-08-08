import { useFormContext, useWatch } from 'react-hook-form';

import Image from 'next/image';

import { FACE_TYPE_OPTIONS, type FACE_TYPE } from '@/features/posts/constants/face-type';
import type { FaceTypeOption } from '@/features/posts/types/face-type';
import { cn } from '@/lib/utils';
import type { ValueOf } from '@/shared/type/types';

import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../../constants/consulting-response-form-field-name';
import type { ConsultingResponseFormValues } from '../../../types/consulting-response-form-values';


type FaceTypeOptionProps = {
  option: FaceTypeOption;
  selected: boolean;
  onClick: () => void;
};

function FaceTypeOption({ option, selected, onClick }: FaceTypeOptionProps) {
  const { label, description, emptyImage, selectedImage } = option;

  return (
    <button type="button" className="flex flex-col gap-2" onClick={onClick}>
      <div
        className={cn(
          'rounded-4 size-40 flex items-center justify-center',
          selected ? 'bg-label-default' : 'bg-alternative',
        )}
      >
        <Image
          src={selected ? selectedImage : emptyImage}
          alt={label}
          width={92}
          height={108}
          className="object-cover"
          style={{
            width: '92px',
            height: '108px',
          }}
          priority
        />
      </div>
      <div className="flex flex-col gap-1 w-full text-start">
        <p className="typo-body-2-medium text-label-default">{label}</p>
        <p className="typo-body-3-regular text-label-sub">{description}</p>
      </div>
    </button>
  );
}

export default function ConsultingResponseFormStep1() {
  const { control, setValue } = useFormContext<ConsultingResponseFormValues>();

  const selectedFaceType = useWatch({
    control,
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.option1,
  });

  const handleSelect = (faceType: ValueOf<typeof FACE_TYPE>) => {
    setValue(CONSULTING_RESPONSE_FORM_FIELD_NAME.option1, faceType, { shouldDirty: true });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {FACE_TYPE_OPTIONS.map((option) => (
        <FaceTypeOption
          key={option.label}
          option={option}
          selected={selectedFaceType === option.value}
          onClick={() => handleSelect(option.value)}
        />
      ))}
    </div>
  );
}

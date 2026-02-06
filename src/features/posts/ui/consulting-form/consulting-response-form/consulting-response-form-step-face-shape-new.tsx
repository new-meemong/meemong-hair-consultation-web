import Image from 'next/image';
import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { FACE_TYPE_OPTIONS_NEW, type FACE_SHAPE } from '@/features/posts/constants/face-shape';
import type { FaceShapeOption } from '@/features/posts/types/face-shape';
import { cn } from '@/lib/utils';
import Checkbox from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';
import type { ValueOf } from '@/shared/type/types';

import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../../constants/consulting-response-form-field-name';
import type { ConsultingResponseFormValues } from '../../../types/consulting-response-form-values';

type FaceTypeOptionProps = {
  option: FaceShapeOption;
  selected: boolean;
  onClick: () => void;
};

function FaceTypeOption({ option, selected, onClick }: FaceTypeOptionProps) {
  const { label, description, emptyImage, selectedImage } = option;

  return (
    <button type="button" className="flex flex-col gap-2 text-left" onClick={onClick}>
      <div
        className={cn(
          'rounded-4 size-40 flex items-center justify-center overflow-hidden',
          selected ? 'bg-label-default' : 'bg-alternative',
        )}
      >
        <Image
          src={selected ? selectedImage : emptyImage}
          alt={label}
          width={160}
          height={160}
          className="size-40 object-cover"
          priority
        />
      </div>
      <div className="flex flex-col w-full">
        <p className="typo-body-2-medium text-label-default">{label}</p>
        <p className="typo-body-3-regular text-label-sub">{description}</p>
      </div>
    </button>
  );
}

export default function ConsultingResponseFormStepFaceShapeNew() {
  const { control, setValue } = useFormContext<ConsultingResponseFormValues>();

  const [isNeedConsultation, setIsNeedConsultation] = useState(false);

  const selectedFaceType = useWatch({
    control,
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.FACE_SHAPE,
  });

  const handleSelect = (faceType: ValueOf<typeof FACE_SHAPE>) => {
    setValue(CONSULTING_RESPONSE_FORM_FIELD_NAME.FACE_SHAPE, faceType, { shouldDirty: true });
  };

  return (
    <div className="pb-28">
      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        {FACE_TYPE_OPTIONS_NEW.map((option) => (
          <FaceTypeOption
            key={option.value}
            option={option}
            selected={selectedFaceType === option.value}
            onClick={() => handleSelect(option.value)}
          />
        ))}
      </div>

      <div className="mt-7 flex items-center justify-end gap-2">
        <Label htmlFor="face-shape-new-need-consultation" className="typo-body-3-regular text-label-sub">
          매장 상담이 필요해요
        </Label>
        <Checkbox
          id="face-shape-new-need-consultation"
          shape="round"
          checked={isNeedConsultation}
          onChange={() => setIsNeedConsultation((prev) => !prev)}
        />
      </div>
    </div>
  );
}

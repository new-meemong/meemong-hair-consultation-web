import { cn } from '@/lib/utils';
import type { ValueOf } from '@/shared/type/types';
import Image from 'next/image';
import { useFormContext, useWatch } from 'react-hook-form';
import type { ConsultingResponseFormValues } from '../../types/consulting-response-form-values';
import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../constants/consulting-response-form-field-name';

export const FACE_TYPE = {
  OVAL: 'oval',
  DIAMOND: 'diamond',
  HEART: 'heart',
  PEANUT: 'peanut',
  HEXAGONAL: 'hexagonal',
  ROUND: 'round',
} as const;

type FaceTypeOption = {
  label: string;
  value: ValueOf<typeof FACE_TYPE>;
  description: string;
  emptyImage: string;
  selectedImage: string;
};

const FACE_TYPE_OPTION: Record<ValueOf<typeof FACE_TYPE>, FaceTypeOption> = {
  [FACE_TYPE.OVAL]: {
    label: '계란형',
    value: FACE_TYPE.OVAL,
    description: '광대/턱 부각 없는 얼굴형',
    emptyImage: '/oval-face.svg',
    selectedImage: '/selected-oval-face.svg',
  },
  [FACE_TYPE.DIAMOND]: {
    label: '마름모형',
    value: FACE_TYPE.DIAMOND,
    description: '광대 부각, 턱 부각 없음',
    emptyImage: '/diamond-face.svg',
    selectedImage: '/selected-diamond-face.svg',
  },
  [FACE_TYPE.HEART]: {
    label: '하트형',
    value: FACE_TYPE.HEART,
    description: '광대/턱 부각, 광대가 더 부각됨',
    emptyImage: '/heart-face.svg',
    selectedImage: '/selected-heart-face.svg',
  },
  [FACE_TYPE.PEANUT]: {
    label: '땅콩형',
    value: FACE_TYPE.PEANUT,
    description: '광대/턱 모두 비슷하게 부각',
    emptyImage: '/peanut-face.svg',
    selectedImage: '/selected-peanut-face.svg',
  },
  [FACE_TYPE.HEXAGONAL]: {
    label: '육각형',
    value: FACE_TYPE.HEXAGONAL,
    description: '광대 부각 없음, 턱 부각 있음',
    emptyImage: '/hexagonal-face.svg',
    selectedImage: '/selected-hexagonal-face.svg',
  },
  [FACE_TYPE.ROUND]: {
    label: '둥근형',
    value: FACE_TYPE.ROUND,
    description: '둥근 얼굴형',
    emptyImage: '/round-face.svg',
    selectedImage: '/selected-round-face.svg',
  },
} as const;

const FACE_TYPE_OPTIONS = Object.values(FACE_TYPE_OPTION);

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
        />
      </div>
      <div className="flex flex-col gap-1 w-full text-start">
        <p className="typo-body-2-medium text-label-default">{label}</p>
        <p className="typo-body-3-regular text-label-sub">{description}</p>
      </div>
    </button>
  );
}

export default function ConsultingResponseFormStep2() {
  const { control, setValue } = useFormContext<ConsultingResponseFormValues>();

  const selectedFaceType = useWatch({
    control,
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.option2,
  });

  const handleSelect = (faceType: ValueOf<typeof FACE_TYPE>) => {
    setValue(CONSULTING_RESPONSE_FORM_FIELD_NAME.option2, faceType, { shouldDirty: true });
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

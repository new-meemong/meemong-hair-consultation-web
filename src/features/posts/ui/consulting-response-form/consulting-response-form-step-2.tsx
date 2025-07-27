import { cn } from '@/lib/utils';
import Image from 'next/image';

type FaceTypeOption = {
  label: string;
  description: string;
  emptyImage: string;
  selectedImage: string;
};

const FACE_TYPE_OPTIONS: FaceTypeOption[] = [
  {
    label: '계란형',
    description: '광대/턱 부각 없는 얼굴형',
    emptyImage: '/oval-face.svg',
    selectedImage: '/selected-oval-face.svg',
  },
  {
    label: '마름모형',
    description: '광대 부각, 턱 부각 없음',
    emptyImage: '/diamond-face.svg',
    selectedImage: '/selected-diamond-face.svg',
  },
  {
    label: '하트형',
    description: '광대/턱 부각, 광대가 더 부각됨',
    emptyImage: '/heart-face.svg',
    selectedImage: '/selected-heart-face.svg',
  },
  {
    label: '땅콩형',
    description: '광대/턱 모두 비슷하게 부각',
    emptyImage: '/peanut-face.svg',
    selectedImage: '/selected-peanut-face.svg',
  },
  {
    label: '육각형',
    description: '광대 부각 없음, 턱 부각 있음',
    emptyImage: '/hexagonal-face.svg',
    selectedImage: '/selected-hexagonal-face.svg',
  },
  {
    label: '둥근형',
    description: '둥근 얼굴형',
    emptyImage: '/round-face.svg',
    selectedImage: '/selected-round-face.svg',
  },
];

type FaceTypeOptionProps = {
  option: FaceTypeOption;
  selected: boolean;
};

function FaceTypeOption({ option, selected }: FaceTypeOptionProps) {
  const { label, description, emptyImage, selectedImage } = option;

  return (
    <div className="flex flex-col gap-2">
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
      <div className="flex flex-col gap-1">
        <p className="typo-body-2-medium text-label-default">{label}</p>
        <p className="typo-body-3-regular text-label-sub">{description}</p>
      </div>
    </div>
  );
}

export default function ConsultingResponseFormStep2() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {FACE_TYPE_OPTIONS.map((option) => (
        <FaceTypeOption key={option.label} option={option} selected={false} />
      ))}
    </div>
  );
}

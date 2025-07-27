import PlusIcon from '@/assets/icons/plus.svg';
import { Button } from '@/shared';
import useShowConsultingPostImageGuideSheet from '../../hooks/use-show-consulting-post-image-guide-sheet';

type ImageUploaderProps = {
  onUpload: (file: File) => void;
  label: string;
};

function ImageUploader({ onUpload, label }: ImageUploaderProps) {
  const handleClick = () => {};

  return (
    <div className="flex flex-col gap-2">
      <button
        className="w-25 h-25 rounded-6 bg-alternative flex items-center justify-center"
        onClick={handleClick}
      >
        <PlusIcon className="w-7.5 h-7.5 fill-label-placeholder" />
      </button>
      <p className="typo-body-2-regular text-label-info text-center">{label}</p>
    </div>
  );
}

export default function ConsultingPostFormStep3() {
  const showConsultingPostImageGuideSheet = useShowConsultingPostImageGuideSheet();
  const handleGuideClick = () => {
    showConsultingPostImageGuideSheet();
  };

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-5 items-center justify-center">
        <div className="grid grid-cols-2 gap-6">
          <ImageUploader onUpload={() => {}} label="푼머리 정면" />
          <ImageUploader onUpload={() => {}} label="묶은 머리 정면" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <ImageUploader onUpload={() => {}} label="묶은 머리 측면" />
          <ImageUploader onUpload={() => {}} label="상반신 전체" />
        </div>
      </div>
      <Button theme="white" onClick={handleGuideClick}>
        사진 가이드 확인
      </Button>
    </div>
  );
}

import DuplicatedGalleryIcon from '@/assets/icons/duplicated-gallery.svg';

type ConsultingResponseSidebarButtonProps = {
  onClick: () => void;
};

export default function ConsultingResponseSidebarButton({
  onClick,
}: ConsultingResponseSidebarButtonProps) {
  return (
    <button
      type="button"
      className="size-14 rounded-full bg-white shadow-heavy flex items-center justify-center"
      onClick={onClick}
    >
      <DuplicatedGalleryIcon />
    </button>
  );
}

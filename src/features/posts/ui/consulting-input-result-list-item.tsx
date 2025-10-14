import TrashIcon from '@/assets/icons/trash.svg';
import Dot from '@/shared/ui/dot';

type ConsultingInputResultListItemProps = {
  name: string;
  description: string;
  onDelete?: () => void;
};

export default function ConsultingInputResultListItem({
  name,
  description,
  onDelete,
}: ConsultingInputResultListItemProps) {
  return (
    <div className="flex items-center justify-between bg-alternative rounded-4 gap-4 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="typo-body-2-semibold text-label-sub">{name}</span>
        <Dot size="0.75" className="bg-label-disable" />
        <span className="typo-body-2-regular text-label-info">{description}</span>
      </div>
      {onDelete && (
        <button onClick={onDelete}>
          <TrashIcon />
        </button>
      )}
    </div>
  );
}

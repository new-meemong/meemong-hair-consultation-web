import TrashIcon from '@/assets/icons/trash.svg';
import { format } from 'date-fns';

type ConsultingPostFormOperationListItemProps = {
  name: string;
  date: Date;
  onDelete: () => void;
};

export default function ConsultingPostFormOperationListItem({
  name,
  date,
  onDelete,
}: ConsultingPostFormOperationListItemProps) {
  return (
    <div className="flex items-center bg-alternative rounded-4 gap-4 px-4 py-3">
      <button onClick={onDelete}>
        <TrashIcon />
      </button>
      <div className="flex items-center gap-2">
        <span className="typo-body-2-semibold text-label-sub">{name}</span>
        <div className="h-0.75 w-0.75 rounded-full bg-label-disable" />
        <span className="typo-body-3-regular text-label-info">{format(date, 'yyyy.MM')}</span>
      </div>
    </div>
  );
}

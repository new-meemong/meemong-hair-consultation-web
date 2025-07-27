import TrashIcon from '@/assets/icons/trash.svg';
import Dot from '@/shared/ui/dot';
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
    <div className="flex items-center justify-between bg-alternative rounded-4 gap-4 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="typo-body-2-semibold text-label-sub">{name}</span>
        <Dot size="sm" className="bg-label-disable" />
        <span className="typo-body-3-regular text-label-info">{format(date, 'yyyy.MM')}</span>
      </div>
      <button onClick={onDelete}>
        <TrashIcon />
      </button>
    </div>
  );
}

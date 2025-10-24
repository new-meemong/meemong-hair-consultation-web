import CloseIcon from '@/assets/icons/close.svg';

type SelectedRegionItemProps = {
  regionKey: string;
  value: string;
  onDelete: (value: string) => void;
};

export default function SelectedRegionItem({
  regionKey,
  value,
  onDelete,
}: SelectedRegionItemProps) {
  const handleDelete = () => {
    onDelete(value);
  };

  return (
    <div className="flex items-center justify-between rounded-4 border-border-strong bg-white border-1 px-4 py-2">
      <p className="typo-body-1-regular text-label-info">{`${regionKey} > ${value}`}</p>
      <CloseIcon className="size-4 fill-label-info" onClick={handleDelete} />
    </div>
  );
}

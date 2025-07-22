import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import { cn } from '../lib';

type ProgressPaginationProps = {
  total: number;
  current: number;
  onPageChange: (page: number) => void;
};

type PageButtonProps = {
  direction: 'left' | 'right';
  isActive: boolean;
  onClick: () => void;
};

function PageButton({ direction, isActive, onClick }: PageButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn('p-2.5 rounded-4', 'bg-label-disable', isActive && 'bg-label-default')}
    >
      {direction === 'left' ? (
        <ChevronLeftIcon className="w-5 h-5 fill-white" />
      ) : (
        <ChevronRightIcon width={20} height={20} />
      )}
    </button>
  );
}

export default function ProgressPagination({
  total,
  current,
  onPageChange,
}: ProgressPaginationProps) {
  const progressPercentage = (current / total) * 100;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative h-1.5 w-full bg-alternative">
        <div
          className="h-full bg-cautionary transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="w-full flex items-center justify-between">
        <div className="bg-alternative rounded-99 px-6 py-[9.5px] typo-body-1-medium text-label-info">
          {current}/{total}
        </div>
        <div className="flex gap-3">
          <PageButton
            direction="left"
            isActive={current > 1}
            onClick={() => onPageChange(current - 1)}
          />
          <PageButton
            direction="right"
            isActive={current < total}
            onClick={() => onPageChange(current + 1)}
          />
        </div>
      </div>
    </div>
  );
}

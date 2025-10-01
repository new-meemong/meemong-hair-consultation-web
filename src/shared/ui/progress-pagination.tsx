import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg';

import { cn } from '../lib';

import { Button } from './button';

type ProgressPaginationProps = {
  total: number;
  current: number;
  onPageChange: (page: number) => void;
  disabledToNext?: boolean;
  disabledToPrevious?: boolean;
  nextButtonLabel?: string;
  previousButtonLabel?: string;
  onNextButtonClick?: () => void;
  onPreviousButtonClick?: () => void;
};

type PageButtonProps = {
  label?: string;
  direction: 'left' | 'right';
  isActive: boolean;
  onClick: () => void;
};

function PageButton({ direction, isActive, onClick, label }: PageButtonProps) {
  const renderIcon = () => {
    if (direction === 'left') {
      return <ChevronLeftIcon className="fill-white size-5" />;
    }

    return <ChevronRightIcon className="fill-white size-5" />;
  };

  return label ? (
    <Button variant="textWithIcon" size="textWithIcon" disabled={!isActive} onClick={onClick}>
      {label}
      {renderIcon()}
    </Button>
  ) : (
    <button
      onClick={onClick}
      className={cn('p-2.5 rounded-4', 'bg-label-disable', isActive && 'bg-label-default')}
    >
      {renderIcon()}
    </button>
  );
}

export default function ProgressPagination({
  total,
  current,
  onPageChange,
  disabledToNext,
  disabledToPrevious,
  nextButtonLabel,
  previousButtonLabel,
  onNextButtonClick,
  onPreviousButtonClick,
}: ProgressPaginationProps) {
  const progressPercentage = (current / total) * 100;

  const handleNextButtonClick = () => {
    if (disabledToNext) return;

    onNextButtonClick?.();

    if (current < total) {
      onPageChange(current + 1);
    }
  };

  const handlePreviousButtonClick = () => {
    if (disabledToPrevious) return;

    onPreviousButtonClick?.();

    if (current > 1) {
      onPageChange(current - 1);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative h-1.5 w-full bg-alternative">
        <div
          className="h-full bg-cautionary transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="w-full flex items-center justify-between">
        <div className="bg-alternative rounded-99 px-6 py-[9.5px] typo-body-2-medium text-label-info">
          {current}/{total}
        </div>
        <div className="flex gap-3">
          <PageButton
            direction="left"
            isActive={current > 1 && !disabledToPrevious}
            onClick={handlePreviousButtonClick}
            label={previousButtonLabel}
          />
          <PageButton
            direction="right"
            isActive={current <= total && !disabledToNext}
            onClick={handleNextButtonClick}
            label={nextButtonLabel}
          />
        </div>
      </div>
    </div>
  );
}

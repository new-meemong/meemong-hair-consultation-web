import { cn } from '@/lib/utils';

const PROGRESS_BAR_PADDING = '4px';
const PROGRESS_BAR_POINTER_SIZE = '32px';

const getProgressLeft = (index: number, total: number) => {
  if (index === 0) return PROGRESS_BAR_PADDING;
  if (index === total - 1) return `calc(100% - ${PROGRESS_BAR_PADDING})`;
  return `calc(${(index / (total - 1)) * 100}%)`;
};

function ProgressSliderLabel({ label }: { label: string }) {
  return <span className="typo-body-2-long-regular text-label-sub">{label}</span>;
}

function SelectedProgressPointer({
  value,
  total,
  onChange,
}: {
  value: number;
  total: number;
  onChange: (value: number) => void;
}) {
  const getProgressPointer = () => {
    if (value === 1) return '0px';
    if (value === total) return `calc(100% - ${PROGRESS_BAR_POINTER_SIZE})`;
    return `calc(${((value - 1) / (total - 1)) * 100}%)`;
  };

  const isLeftEnd = value === 1;
  const isRightEnd = value === total;

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!rect) return;

    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newValue = Math.round(percentage * (total - 1)) + 1;

    if (newValue !== value) {
      onChange(newValue);
    }
  };

  return (
    <div
      className={cn(
        'absolute rounded-full bg-label-default -translate-x-1/2 -bottom-2.5 z-100 flex items-center justify-center touch-none cursor-pointer',
        (isLeftEnd || isRightEnd) && 'translate-x-0',
      )}
      style={{
        width: PROGRESS_BAR_POINTER_SIZE,
        height: PROGRESS_BAR_POINTER_SIZE,
        left: getProgressPointer(),
      }}
      onTouchMove={handleTouchMove}
      onTouchEnd={(e) => e.preventDefault()}
    >
      <div className="size-4 rounded-full bg-white" />
    </div>
  );
}

function SelectedProgressBar({ total, value }: { total: number; value: number }) {
  return (
    <>
      <div
        className={cn(
          'absolute left-0 top-0 h-full bg-label-default rounded-12 transition-all duration-300 ease-out',
          value === 1 && 'hidden',
        )}
        style={{ width: getProgressLeft(value - 1, total) }}
      />
    </>
  );
}

function ProgressPointer({
  total,
  value,
  onChange,
}: {
  total: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="absolute  h-8 py-2.5 w-full flex justify-center">
      {Array.from({ length: total }).map((_, index) => {
        return (
          <button
            type="button"
            key={index}
            className={cn(
              'absolute py-3.25 px-1.5 -translate-y-2.5 z-10 -translate-x-1/2 ',
              index === 0 && 'pl-4.5',
            )}
            style={{
              left: getProgressLeft(index, total),
            }}
            onClick={() => onChange(index + 1)}
          >
            <div
              className={cn(
                'size-1.5 rounded-full bg-label-placeholder -translate-x-1/2',
                index < value && 'bg-label-sub',
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

type ProgressSliderProps = {
  total: number;
  value: number | null;
  leftLabel?: string;
  rightLabel?: string;
  onChange?: (value: number) => void;
};

export default function ProgressSlider({
  total,
  value,
  leftLabel,
  rightLabel,
  onChange,
}: ProgressSliderProps) {
  const handleChange = (value: number) => {
    onChange?.(value);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <ProgressPointer total={total} value={value ?? 0} onChange={handleChange} />
        <div
          className="bg-alternative h-3 rounded-12 relative my-2.5"
          style={{ paddingLeft: PROGRESS_BAR_PADDING, paddingRight: PROGRESS_BAR_PADDING }}
        >
          {value && (
            <div>
              <SelectedProgressBar total={total} value={value} />
              <SelectedProgressPointer value={value} total={total} onChange={handleChange} />
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        {leftLabel && <ProgressSliderLabel label={leftLabel} />}
        {rightLabel && <ProgressSliderLabel label={rightLabel} />}
      </div>
    </div>
  );
}

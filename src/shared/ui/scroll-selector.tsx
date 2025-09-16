import { cn } from '@/lib/utils';

import { useScrollSelector } from './hooks/use-scroll-selector';

type ScrollSelectorProps<T> = {
  options: T[];
  selectedOption: T;
  onSelect: (item: T) => void;
};

export default function ScrollSelector<T extends string | number>({
  options,
  selectedOption,
  onSelect,
}: ScrollSelectorProps<T>) {
  const { containerRef, setButtonRef, handleButtonClick } = useScrollSelector({
    options,
    selectedOption,
    onSelect,
  });

  return (
    <div className="relative h-50">
      <div
        className="h-50 overflow-y-scroll scrollbar-hide"
        ref={containerRef}
      >
        {/* 상단 여백 - 첫번째 옵션을 가운데로 스크롤할 수 있도록 */}
        <div className="h-20" />

        {options.map((option, index) => {
          const selectedIndex = options.findIndex((option) => option === selectedOption);
          const selected = selectedOption === option;

          return (
            <button
              key={`${option}-${index}`}
              ref={setButtonRef(index)}
              onClick={() => handleButtonClick(index)}
              className={cn(
                'w-full h-10 flex items-center justify-center transition-colors cursor-pointer hover:bg-alternative/50',
                selected && 'typo-headline-bold text-label-default rounded-4 bg-alternative',
                Math.abs(selectedIndex - index) === 1 && 'typo-body-2-regular text-label-info',
                Math.abs(selectedIndex - index) === 2 && 'typo-body-3-regular text-label-sub',
              )}
            >
              {option}
            </button>
          );
        })}

        {/* 하단 여백 - 마지막 옵션을 가운데로 스크롤할 수 있도록 */}
        <div className="h-20" />
      </div>
    </div>
  );
}

import { cn } from '../lib';
import type { TabOption } from '../type/tab-option';

type TabProps<T> = {
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export default function Tab<T>({ options, value, onChange }: TabProps<T>) {
  const selected = (option: TabOption<T>) => option.value === value;

  return (
    <div className="px-5 flex items-center justify-stretch border-b-1 border-border-default">
      {options.map((option) => (
        <button
          key={String(option.value)}
          className={cn(
            'flex-1 py-[17.5px]',
            selected(option) && 'border-b-2 border-label-default py-4',
          )}
          onClick={() => onChange(option.value)}
        >
          <span
            className={cn(
              'text-label-default',
              selected(option) ? 'typo-body-1-semibold' : 'typo-body-1-medium',
            )}
          >
            {option.name}
          </span>
        </button>
      ))}
    </div>
  );
}

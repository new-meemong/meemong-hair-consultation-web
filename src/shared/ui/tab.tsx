import type { Option } from '../type/option';
import { cn } from '../lib';

type TabProps<T> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export default function Tab<T>({ options, value, onChange }: TabProps<T>) {
  const selected = (option: Option<T>) => option.value === value;

  return (
    <div className="px-5 flex items-center justify-stretch border-b-1 border-border-default">
      {options.map((option, index) => (
        <button
          key={`${String(option.value)}-${option.label}-${index}`}
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
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
}

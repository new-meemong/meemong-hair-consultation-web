import RoundCheckboxEmptyIcon from '@/assets/icons/round-checkbox-empty.svg';
import RoundCheckboxIcon from '@/assets/icons/round-checkbox.svg';
import SquareCheckboxEmptyIcon from '@/assets/icons/square-checkbox-empty.svg';
import SquareCheckboxIcon from '@/assets/icons/square-checkbox.svg';

import { cn } from '@/shared/lib/utils';

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  shape: 'square' | 'round';
};

export default function Checkbox({ className, shape = 'square', id, ...props }: CheckboxProps) {
  return (
    <label htmlFor={id} className="size-6 flex items-center justify-center relative cursor-pointer">
      <input type="checkbox" id={id} className={cn('sr-only', className)} {...props} />
      <div className="absolute inset-0 flex items-center justify-center">
        {shape === 'round' && (
          <>{props.checked ? <RoundCheckboxIcon /> : <RoundCheckboxEmptyIcon />}</>
        )}
        {shape === 'square' && (
          <>{props.checked ? <SquareCheckboxIcon /> : <SquareCheckboxEmptyIcon />}</>
        )}
      </div>
    </label>
  );
}

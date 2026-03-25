import type React from 'react';
import RoundCheckboxEmptyIcon from '@/assets/icons/round-checkbox-empty.svg';
import RoundCheckboxIcon from '@/assets/icons/round-checkbox.svg';
import SquareCheckboxEmptyIcon from '@/assets/icons/square-checkbox-empty.svg';
import SquareCheckboxIcon from '@/assets/icons/square-checkbox.svg';
import { cn } from '@/shared/lib/utils';

export type CheckboxProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange' | 'onClick'
> & {
  checked?: boolean;
  disabled?: boolean;
  id?: string;
  label?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
  shape: 'square' | 'round';
};

export default function Checkbox({
  className,
  shape = 'square',
  id,
  checked = false,
  disabled = false,
  onChange,
  onClick,
}: CheckboxProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onClick?.(event as unknown as React.MouseEvent<HTMLInputElement>);

    if (disabled) return;

    onChange?.({
      target: { checked: !checked, id },
      currentTarget: { checked: !checked, id },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <button
      type="button"
      id={id}
      aria-pressed={checked}
      aria-checked={checked}
      disabled={disabled}
      className={cn('relative flex size-6 cursor-pointer items-center justify-center', className)}
      onClick={handleClick}
    >
      {shape === 'round' && <>{checked ? <RoundCheckboxIcon /> : <RoundCheckboxEmptyIcon />}</>}
      {shape === 'square' && <>{checked ? <SquareCheckboxIcon /> : <SquareCheckboxEmptyIcon />}</>}
    </button>
  );
}

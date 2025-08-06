'use client';

import React from 'react';

import { cn } from '@/shared/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

export type OptionItem = {
  label: string;
  onClick: () => void;
  className?: string;
};

interface MoreOptionsMenuProps {
  trigger?: React.ReactNode;
  options: OptionItem[];
  triggerClassName?: string;
  contentClassName?: string;
  onOpenChange?: (open: boolean) => void;
}

export const MoreOptionsMenu = ({
  trigger,
  options,
  triggerClassName,
  contentClassName,
  onOpenChange,
}: MoreOptionsMenuProps) => {
  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger className={cn('outline-none', triggerClassName)}>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={contentClassName}>
        {options.map((option, index) => (
          <div key={option.label}>
            <DropdownMenuItem
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                option.onClick();
              }}
              className={cn(option.className)}
            >
              {option.label}
            </DropdownMenuItem>
            {index < options.length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

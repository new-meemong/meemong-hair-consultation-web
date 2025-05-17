'use client';
import React, { useState } from 'react';
import { Button } from './button';
import { Textarea } from './textarea';
import LockIcon from '@/assets/icons/lock.svg';
import ArrowUpIcon from '@/assets/icons/arrow-up.svg';
import { Separator } from '@radix-ui/react-separator';
import { Checkbox } from './checkbox';
import { Label } from './label';
import { CheckedState } from '@radix-ui/react-checkbox';

interface PrivateChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onCheckedChange?: (checked: CheckedState) => void;
}

export const PrivateChatInput = React.forwardRef<HTMLDivElement, PrivateChatInputProps>(
  (
    {
      onSend,
      placeholder = '댓글을 입력하세요',
      disabled = false,
      className = '',
      onCheckedChange,
    },
    ref,
  ) => {
    const [message, setMessage] = useState('');
    const [isLocked, setIsLocked] = useState<CheckedState>(false);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (message.trim()) {
        onSend(message);
        setMessage('');
      }
    };

    const handleCheckedChange = (checked: CheckedState) => {
      setIsLocked(checked === true);
      onCheckedChange?.(checked);
    };

    return (
      <>
        <div className="flex flex-col px-5 py-3 shrink-0">
          <div
            ref={ref}
            className={`flex w-full p-2.5 rounded-6 bg-alternative items-center gap-2 outline-none ${className}`}
          >
            <LockIcon
              className={`size-3.5 ${isLocked ? 'fill-negative' : 'fill-label-placeholder'}`}
            />
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Textarea
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                placeholder={placeholder}
                disabled={disabled}
              />
              <Button type="submit" size="icon" variant="icon" className="px-1">
                <ArrowUpIcon className="fill-white" />
              </Button>
            </form>
          </div>
        </div>
        <Separator className="w-full bg-border-default h-0.25" />
        <div className="flex items-center px-5 py-3">
          <Checkbox id="lock" checked={isLocked} onCheckedChange={handleCheckedChange} />
          <Label htmlFor="lock" className="typo-body-3-regular">
            모델에게만 공개할게요
          </Label>
        </div>
      </>
    );
  },
);

PrivateChatInput.displayName = 'PrivateChatInput';

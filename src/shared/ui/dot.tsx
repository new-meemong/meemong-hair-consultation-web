import { cn } from '@/lib/utils';

type DotProps = {
  size: 'size-[3px]' | 'size-[5px]';
};

export default function Dot({ size }: DotProps) {
  return <div className={cn('rounded-full bg-label-placeholder', size)} />;
}

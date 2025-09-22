import { cn } from '@/lib/utils';

type DotProps = {
  size: '0.5' | '0.75' | '1' | '1.25';
  className?: string;
};

const sizeMap = {
  0.5: 'size-0.5',
  0.75: 'size-0.75',
  1: 'size-1',
  1.25: 'size-1.25',
};

export default function Dot({ size, className }: DotProps) {
  return <div className={cn('rounded-full bg-label-placeholder', sizeMap[size], className)} />;
}

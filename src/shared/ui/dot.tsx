import { cn } from '@/lib/utils';

type DotProps = {
  size: 'sm' | 'md';
  className?: string;
};

const sizeMap = {
  sm: 'size-0.75',
  md: 'size-1.25',
};

export default function Dot({ size, className }: DotProps) {
  return <div className={cn('rounded-full bg-label-placeholder', sizeMap[size], className)} />;
}

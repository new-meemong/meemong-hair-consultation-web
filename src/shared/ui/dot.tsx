import { cn } from '@/lib/utils';

type DotProps = {
  size: 'xs' | 'sm' | 'md';
  className?: string;
};

const sizeMap = {
  xs: 'size-0.5',
  sm: 'size-0.75',
  md: 'size-1.25',
};

export default function Dot({ size, className }: DotProps) {
  return <div className={cn('rounded-full bg-label-placeholder', sizeMap[size], className)} />;
}

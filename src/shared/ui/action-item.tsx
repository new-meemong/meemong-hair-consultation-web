import { cn } from '@/lib/utils';

type ActionItemProps = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
  labelClassName?: string;
};

export default function ActionItem({
  icon,
  label,
  onClick,
  labelClassName,
  className,
}: ActionItemProps) {
  return (
    <div
      className={cn(
        'flex justify-center items-center gap-1 flex-1 py-3.5',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      {icon}
      <span className={cn('typo-body-1-medium text-label-info', labelClassName)}>{label}</span>
    </div>
  );
}

import CheckCircleFillIcon from '@/assets/icons/meemong-check-circle-fill.svg';
import { cn } from '@/shared/lib/utils';
import { MeemongTypography } from '@/shared/styles/typography';

type MeemongCalloutProps = {
  title: string;
  description?: string;
  className?: string;
};

export function MeemongCallout({ title, description, className }: MeemongCalloutProps) {
  return (
    <div
      className={cn(
        'flex w-full items-start gap-1.5 rounded-12 bg-status-information-weak p-3',
        className,
      )}
    >
      <span
        className="flex size-4 shrink-0 items-center justify-center pt-0.5 text-status-information-regular"
        aria-hidden="true"
      >
        <CheckCircleFillIcon className="size-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className={cn('text-status-information-regular', MeemongTypography.title3SemiBold)}>
          {title}
        </p>
        {description && (
          <p className={cn('text-text-secondary', MeemongTypography.body4Regular)}>{description}</p>
        )}
      </div>
    </div>
  );
}

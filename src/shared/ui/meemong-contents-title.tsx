import { cn } from '@/shared/lib/utils';
import { MeemongTypography } from '@/shared/styles/typography';

type MeemongContentsTitleProps = {
  title: string;
  description?: string;
  className?: string;
};

export function MeemongContentsTitle({ title, description, className }: MeemongContentsTitleProps) {
  return (
    <div className={cn('flex w-full flex-col px-1', className)}>
      <h2 className={cn('text-text-primary', MeemongTypography.title1SemiBold)}>{title}</h2>
      {description && (
        <p className={cn('text-text-secondary', MeemongTypography.body4Regular)}>{description}</p>
      )}
    </div>
  );
}

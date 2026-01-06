import { cn } from '@/shared/lib/utils';

type RankBadgeProps = {
  rank: number;
  badgeOuterBackground: string;
  badgeInnerBackground: string;
  className?: string;
};

export default function RankBadge({
  rank,
  badgeOuterBackground,
  badgeInnerBackground,
  className,
}: RankBadgeProps) {
  return (
    <div
      className={cn(
        badgeOuterBackground,
        'rounded-99 size-11 flex items-center justify-center shadow-heavy',
        className,
      )}
    >
      <div
        className={cn(badgeInnerBackground, 'rounded-99 size-9.5 flex items-center justify-center')}
      >
        <p className="typo-body-3-semibold text-white">{rank}위</p>
      </div>
    </div>
  );
}

import { cn } from '@/shared/lib/utils';

const RANK_COLOR: Record<number, string> = {
  1: 'bg-rank-first',
  2: 'bg-rank-second',
  3: 'bg-rank-third',
} as const;

export default function RankBadge({ rank }: { rank: number }) {
  const rankColor = RANK_COLOR[rank] ?? 'bg-rank-etc';

  return (
    <div className={cn('text-white px-1.5 py-0.5 rounded-99', rankColor)}>
      <p className="typo-body-3-medium text-white px-3 py-0.5">{rank}위</p>
    </div>
  );
}

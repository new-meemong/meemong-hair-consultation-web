import Image from 'next/image';

import CrownIcon from '@/assets/icons/crown.svg';
import { type TopAdvisor } from '@/entities/user/model/top-advisor';
import { cn } from '@/shared';
import { goDesignerProfilePage } from '@/shared/lib/go-designer-profile-page';
import { CarouselItem } from '@/shared/ui/carousel';

import RankBadge from './rank-badge';
import { useAuthContext } from '../context/auth-context';

type RankTier = 'top' | 'middle' | 'bottom';

const RANK_TIER_STYLES = {
  top: {
    background: 'bg-[linear-gradient(93deg,#FFF8EF,#FFE9CC)]',
    topAdvisorColor: 'text-rank-first',
    badgeOuterBackground: 'bg-[#FFCA75]',
    badgeInnerBackground: 'bg-[linear-gradient(150deg,#FFB742,#EF7B00)]',
  },
  middle: {
    background: 'bg-[linear-gradient(93deg,#F0F0F0,#DFDFDF)]',
    topAdvisorColor: 'text-rank-second',
    badgeOuterBackground: 'bg-label-placeholder',
    badgeInnerBackground: 'bg-[linear-gradient(145deg,#DDDDDD,#555555)]',
  },
  bottom: {
    background: 'bg-[linear-gradient(93deg,#F4EAE3,#E0C5B0)]',
    topAdvisorColor: 'text-rank-third',
    badgeOuterBackground: 'bg-rank-third',
    badgeInnerBackground: 'bg-[linear-gradient(145deg,#DAB89F,#A7866E)]',
  },
} as const;

const getRankTier = (rank: number): RankTier => {
  if (rank >= 1 && rank <= 3) return 'top';
  if (rank >= 4 && rank <= 6) return 'middle';
  return 'bottom';
};

type TopAdvisorCarouselItemProps = {
  topAdvisor: TopAdvisor;
  rank: number;
};

export default function TopAdvisorCarouselItem({ topAdvisor, rank }: TopAdvisorCarouselItemProps) {
  const { isUserDesigner } = useAuthContext();

  const { profilePictureURL, displayName, companyName, userId } = topAdvisor;

  const handleCarouselClick = () => {
    if (isUserDesigner) return;

    goDesignerProfilePage(userId.toString());
  };

  const rankTier = getRankTier(rank);

  const { background, topAdvisorColor, badgeOuterBackground, badgeInnerBackground } =
    RANK_TIER_STYLES[rankTier];

  return (
    <CarouselItem className="px-1 basis-[85%]" onClick={handleCarouselClick}>
      <div className={cn(background, 'p-3 gap-4 items-center flex rounded-6')}>
        <div className="flex gap-3 flex-1 min-w-0">
          <Image
            src={profilePictureURL ? profilePictureURL : '/today-consultant-default-profile.png'}
            alt={displayName}
            width={65}
            height={65}
            className="object-cover rounded-4 w-[65px] h-[65px] flex-shrink-0"
          />
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex gap-0.25">
              <CrownIcon className={topAdvisorColor} />
              <p className={cn('typo-body-3-medium', topAdvisorColor)}>오늘의 상담왕</p>
            </div>
            <p className="typo-headline-bold text-label-sub truncate">{displayName}</p>
            <p className="typo-body-3-medium text-label-info truncate">{companyName}</p>
          </div>
        </div>
        <RankBadge
          rank={rank}
          badgeOuterBackground={badgeOuterBackground}
          badgeInnerBackground={badgeInnerBackground}
          className="flex-shrink-0"
        />
      </div>
    </CarouselItem>
  );
}

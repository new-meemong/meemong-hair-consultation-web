import Image from 'next/image';

import CrownIcon from '@/assets/icons/crown.svg';
import { type TopAdvisor } from '@/entities/user/model/top-advisor';
import { goDesignerProfilePage } from '@/shared/lib/go-designer-profile-page';
import { CarouselItem } from '@/shared/ui/carousel';

import { useAuthContext } from '../context/auth-context';

import RankBadge from './rank-badge';

const formatCompanyName = (companyName: string) => {
  if (companyName.length <= 15) return companyName;

  return companyName.slice(0, 14) + '...';
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

  return (
    <CarouselItem className="px-1 basis-[85%]" onClick={handleCarouselClick}>
      <div className="bg-alternative py-3 pl-3 pr-2.5 flex gap-4 items-center">
        <div className="flex gap-3 flex-1">
          <Image
            src={profilePictureURL ? profilePictureURL : '/today-consultant-default-profile.png'}
            alt={displayName}
            width={65}
            height={65}
            className="object-cover rounded-4 w-[65px] h-[65px]"
          />
          <div className="flex flex-col gap-1 flex-1">
            <div className="flex gap-0.25">
              <CrownIcon />
              <p className="typo-body-3-medium text-cautionary">오늘의 상담왕</p>
            </div>
            <p className="typo-headline-bold text-label-sub">{displayName}</p>
            <p className="typo-body-3-medium text-label-info">{formatCompanyName(companyName)}</p>
          </div>
        </div>
        <RankBadge rank={rank} />
      </div>
    </CarouselItem>
  );
}

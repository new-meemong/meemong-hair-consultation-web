import Image from 'next/image';

import CrownIcon from '@/assets/icons/crown.svg';
import { type ConsultingKing } from '@/entities/user/model/consulting-king';
import { CarouselItem } from '@/shared/ui/carousel';

import RankBadge from './rank-badge';

type TodayConsultantBannerCarouselItemProps = {
  consultingKing: ConsultingKing;
};

export default function TodayConsultantBannerCarouselItem({
  consultingKing,
}: TodayConsultantBannerCarouselItemProps) {
  const { user, rank } = consultingKing;

  const { profileImageUrl, name, companyName } = user;

  return (
    <CarouselItem className="px-1 basis-[85%]">
      <div className="bg-alternative py-3 pl-3 pr-2.5 flex gap-4 items-center">
        <div className="flex gap-3 flex-1">
          <Image
            src={profileImageUrl ?? '/today-consultant-default-profile.png'}
            alt={name}
            width={65}
            height={65}
            className="object-cover rounded-4 w-[65px] h-[65px]"
          />
          <div className="flex flex-col gap-1 flex-1">
            <div className="flex gap-0.25">
              <CrownIcon />
              <p className="typo-body-3-medium text-cautionary">오늘의 상담왕</p>
            </div>
            <p className="typo-headline-bold text-label-sub">{name}</p>
            <p className="typo-body-3-medium text-label-info">{companyName}</p>
          </div>
        </div>
        <RankBadge rank={rank} />
      </div>
    </CarouselItem>
  );
}

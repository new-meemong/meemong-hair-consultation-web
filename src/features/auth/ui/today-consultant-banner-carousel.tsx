import Image from 'next/image';

import CrownIcon from '@/assets/icons/crown.svg';
import { Carousel } from '@/shared';
import { CarouselContent, CarouselItem } from '@/shared/ui/carousel';

import useGetTopAdvisors from '../api/use-get-top-advisors';

import RankBadge from './rank-badge';
import TodayConsultantBannerCarouselItem from './today-consultant-banner-carousel-item';

function TodayConsultantBannerCarouselExample() {
  return (
    <div className="bg-alternative py-3 pl-3 pr-2.5 flex gap-4 items-center">
      <div className="flex gap-3 flex-1">
        <Image
          src={'/today-consultant-default-profile.png'}
          alt="오늘의 상담와 예시 이미지"
          width={65}
          height={65}
          className="object-cover rounded-4 w-[65px] h-[65px]"
        />
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex gap-0.25">
            <CrownIcon />
            <p className="typo-body-3-medium text-cautionary">오늘의 상담왕</p>
          </div>
          <p className="typo-body-1-semibold text-label-sub">
            정성스런 상담을 통해 오늘의
            <br />
            상담왕이 되어보세요!
          </p>
        </div>
      </div>
      <RankBadge rank={1} />
    </div>
  );
}
export default function TodayConsultantBannerCarousel() {
  const { data: response } = useGetTopAdvisors();

  const topAdvisors = response?.dataList ?? [];

  const hasTopAdvisors = !!(topAdvisors.length ?? 0);

  return (
    <Carousel
      opts={{
        loop: hasTopAdvisors,
        align: 'center',
        containScroll: false,
        watchDrag: hasTopAdvisors,
      }}
      className="w-full"
    >
      <CarouselContent className="-mx-4">
        {hasTopAdvisors ? (
          topAdvisors.map(({ rank, designer }) => (
            <TodayConsultantBannerCarouselItem key={rank} topAdvisor={designer} rank={rank} />
          ))
        ) : (
          <CarouselItem className="px-1 basis-[85%]">
            <TodayConsultantBannerCarouselExample />
          </CarouselItem>
        )}
      </CarouselContent>
    </Carousel>
  );
}

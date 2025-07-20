import { Carousel, cn } from '@/shared';
import { CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import Image from 'next/image';
import CrownIcon from '@/assets/icons/crown.svg';

type Banner = {
  id: number;
  rank: number;
  name: string;
  avatarUrl: string | null;
  shop: string;
};

type TodayConsultantBannerProps = {
  banners: Banner[];
};

function Avatar({ avatarUrl, name }: { avatarUrl: string | null; name: string }) {
  return (
    <Image
      src={avatarUrl ?? '/profile.svg'}
      alt={name}
      width={65}
      height={65}
      className="object-cover rounded-4 w-[65px] h-[65px]"
    />
  );
}

const RANK_COLOR: Record<number, string> = {
  1: 'bg-rank-first',
  2: 'bg-rank-second',
  3: 'bg-rank-third',
} as const;

function RankBadge({ rank }: { rank: number }) {
  const rankColor = RANK_COLOR[rank] ?? 'bg-rank-etc';

  return (
    <div className={cn('text-white px-1.5 py-0.5 rounded-99', rankColor)}>
      <p className="typo-body-3-medium text-white px-3 py-0.5">{rank}위</p>
    </div>
  );
}

export default function TodayConsultantBanner({ banners }: TodayConsultantBannerProps) {
  return (
    <Carousel
      opts={{
        loop: true,
        align: 'center',
        containScroll: false,
      }}
      className="w-full"
    >
      <CarouselContent className="-mx-4">
        {banners.map(({ id, name, avatarUrl, shop, rank }) => (
          <CarouselItem key={id} className="px-1 basis-[85%]">
            <div className="bg-alternative py-3 pl-3 pr-2.5 flex gap-4 items-center">
              <div className="flex gap-3 flex-1">
                <Avatar avatarUrl={avatarUrl} name={name} />
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex gap-0.25">
                    <CrownIcon />
                    <p className="typo-body-3-medium text-cautionary">오늘의 상담왕</p>
                  </div>
                  <p className="typo-headline-bold text-label-sub">{name}</p>
                  <p className="typo-body-3-medium text-label-info">{shop}</p>
                </div>
              </div>
              <RankBadge rank={rank} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

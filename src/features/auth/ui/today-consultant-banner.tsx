import { Carousel } from '@/shared';
import { CarouselContent, CarouselItem } from '@/shared/ui/carousel';

type Banner = {
  id: number;
  rank: number;
  name: string;
  avatarUrl: string;
  shop: string;
};

type TodayConsultantBannerProps = {
  banners: Banner[];
};

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
        {banners.map((banner) => (
          <CarouselItem key={banner.id} className="px-1 basis-[85%]">
            <div className="h-10 bg-amber-200">ggg</div>
            {/* <div className={`${banner.bgColor} text-white p-6 rounded-lg w-full`}>
                <p className="text-sm mb-1">{banner.subtitle}</p>
                <h2 className="text-3xl font-bold">{banner.title}</h2>
              </div> */}
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

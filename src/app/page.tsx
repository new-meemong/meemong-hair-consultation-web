import { Button } from "@/components/ui/button";
import { DrawerClose } from "@/components/ui/drawer";
import { BottomSheet } from "@/components/ui/bottom-sheet";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-pretendard)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center max-w-4xl w-full">
        <div className="text-display-large text-center mb-8">디자인 시스템</div>
        {/* 타이포그래피 섹션 */}
        <section className="w-full">
          <h2 className="text-title-1 mb-6">타이포그래피</h2>
          <div className="grid gap-4 p-6 rounded-10 bg-white border border-border">
            <h1 className="text-display-large">Display Large (32px Bold)</h1>
            <h2 className="text-title-1">Title 1 (28px Bold)</h2>
            <h3 className="text-title-2">Title 2 (22px Bold)</h3>
            <h4 className="text-title-3">Title 3 (20px Bold)</h4>
            <p className="text-headline">Headline (18px Bold)</p>
            <p className="text-body-1-semibold">
              Body 1 Semibold (16px Semibold)
            </p>
            <p className="text-body-1-medium">Body 1 Medium (16px Medium)</p>
            <p className="text-body-1-regular">Body 1 Regular (16px Regular)</p>
            <p className="text-body-1-long-medium">
              Body 1 Long Medium (16px Medium, 170% 행간)
            </p>
          </div>
        </section>
        {/* 버튼(Button) 섹션 */}
        <section className="w-full">
          <h2 className="text-title-1 mb-6">버튼 (Button)</h2>
          <div className="grid gap-4 p-6 rounded-10 bg-white border border-border">
            <Button>CTA Button</Button>
            <Button disabled> CTA Button (Disabled)</Button>
          </div>
        </section>
        {/* 바텀시트 섹션 */}
        <section className="w-full">
          <h2 className="text-title-1 mb-6">바텀시트 (Bottom Sheet)</h2>
          {/* 공통화된 방식: BottomSheet 컴포넌트 사용 */}

          <div className="flex flex-wrap gap-4">
            <BottomSheet
              trigger={<Button>기본 바텀시트</Button>}
              title="Move Goal"
              description="Set your daily activity goal."
            >
              바텀 시트 내용 <br />
              온보딩
            </BottomSheet>
            <BottomSheet
              trigger={<Button>바텀시트 커스텀</Button>}
              title="바텀시트 커스텀"
              description="기본 설정에서 변형하고 싶을 경우 className을 사용해 커스텀"
              showCloseButton={false}
              footerContent={
                <div className="flex gap-2 w-full">
                  <DrawerClose asChild>
                    <Button variant="secondary" className="flex-1">
                      취소
                    </Button>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Button className="flex-1">확인</Button>
                  </DrawerClose>
                </div>
              }
            >
              바텀시트 커스텀 예시
            </BottomSheet>
          </div>
        </section>

        {/* 반경(Radius) 섹션 */}
        <section className="w-full">
          <h2 className="text-title-1 mb-6">반경 (Radius)</h2>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-0 bg-alternative mb-2"></div>
              <span className="text-body-2-medium">rounded-0</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-4 bg-alternative mb-2"></div>
              <span className="text-body-2-medium">rounded-4</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-10 bg-alternative mb-2"></div>
              <span className="text-body-2-medium">rounded-10</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-alternative mb-2"></div>
              <span className="text-body-2-medium">rounded-full</span>
            </div>
          </div>
        </section>
        {/* 투명도(Opacity) 섹션 */}
        <section className="w-full">
          <h2 className="text-title-1 mb-6">투명도 (Opacity)</h2>
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-6 bg-alternative opacity-20 mb-2"></div>
              <span className="text-body-2-medium">opacity-20</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-6 bg-alternative opacity-40 mb-2"></div>
              <span className="text-body-2-medium">opacity-40</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-6 bg-alternative opacity-60 mb-2"></div>
              <span className="text-body-2-medium">opacity-60</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-6 bg-alternative opacity-80 mb-2"></div>
              <span className="text-body-2-medium">opacity-80</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-6 bg-alternative opacity-100 mb-2"></div>
              <span className="text-body-2-medium">opacity-100</span>
            </div>
          </div>
        </section>
        {/* 반응형 */}
        <section className="w-full">
          <h2 className="text-title-1 mb-6">반응형</h2>
          <div className="rounded-6 bg-white border border-border p-6">
            <p className="text-body-2-medium sm:text-body-1-medium md:text-headline lg:text-title-3">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quos. Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Quisquam, quos.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

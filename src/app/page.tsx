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

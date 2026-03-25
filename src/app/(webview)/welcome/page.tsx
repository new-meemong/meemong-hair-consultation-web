export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 pb-56">
        <div className="absolute bottom-0 left-0 right-0 pb-8">
          <div className="flex flex-col gap-3">
            <button
              type="button"
              className="flex w-full items-center justify-center rounded-[4px] border border-border-default bg-white px-5 py-4 typo-body-1-medium text-label-default"
            >
              샘플보기
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center rounded-[4px] border border-border-default bg-white px-5 py-4 typo-body-1-medium text-label-default"
            >
              내 컨설팅 목록
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center rounded-[4px] bg-cautionary px-5 py-4 typo-body-1-medium text-white"
            >
              컨설팅 시작하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { ROUTES } from '@/shared/lib/routes';
import { useBrand } from '@/shared/context/brand-context';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';

export default function Page() {
  const { config: brand } = useBrand();
  const { replace } = useRouterWithUser();

  return (
    <div className="flex h-screen flex-col bg-white">
      <header className="flex h-[50px] shrink-0 items-center justify-center border-b border-border-default px-5">
        <h1 className="typo-title-3-semibold text-center text-label-default">작성완료</h1>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-5 text-center">
        <p className="typo-body-2-long-regular text-label-info">{brand.name}</p>
        <p className="mt-0 typo-body-2-long-regular text-label-info">
          헤어컨설팅 작성이 완료되었습니다!
        </p>
        <p className="mt-2 whitespace-pre-line typo-title-3-semibold text-static-black">
          답변이 도착하면 입력하신 번호로{'\n'}알림톡을 보내드릴게요
        </p>
      </div>

      <div className="shrink-0 px-5 pb-8">
        <button
          type="button"
          className="w-full rounded-[4px] bg-label-default py-4 typo-body-1-medium text-white"
          onClick={() => replace(ROUTES.WEB_MY(brand.slug))}
        >
          내 상담지 확인
        </button>
      </div>
    </div>
  );
}

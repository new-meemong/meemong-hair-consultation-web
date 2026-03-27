'use client';

import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer';
import { useRef, useState } from 'react';

import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import Image from 'next/image';
import { ROUTES } from '@/shared/lib/routes';
import { useBrand } from '@/shared/context/brand-context';
import { useRouter } from 'next/navigation';

// layout에서 BrandProvider가 dev override를 반영한 brand를 주입하므로
// 여기서 getBrandConfig를 별도 호출하지 않음 (테마/로고/브랜드명 일치 보장)
export default function BrandWelcomePage() {
  const { config: brand } = useBrand();
  const router = useRouter();

  const [historySheetOpen, setHistorySheetOpen] = useState(false);
  const [newConsultationSheetOpen, setNewConsultationSheetOpen] = useState(false);
  const openNewSheetAfterClose = useRef(false);

  const goToPhoneAuth = () => {
    router.push(ROUTES.WEB_AUTH_PHONE(brand.slug));
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <div
          className={cn(
            'relative mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 pb-56',
            (historySheetOpen || newConsultationSheetOpen) && 'pointer-events-none',
          )}
        >
          <div className="flex flex-1 flex-col items-center justify-center">
            <Image
              src={brand.logo.src}
              width={brand.logo.width}
              height={brand.logo.height}
              alt={brand.name}
              priority
            />
            <div className="my-4 h-0.5 w-5 bg-border-default" />
            <p className="typo-body-1-regular text-label-info">{brand.displayName}</p>
          </div>

          <div className="absolute bottom-0 left-0 right-0 px-5 pb-8">
            <div className="flex flex-col gap-3">
              <button
                type="button"
                className="flex w-full items-center justify-center rounded-[4px] border border-border-default bg-white px-5 py-4 typo-body-1-medium text-label-default"
                onClick={() => router.push(ROUTES.WEB_SAMPLE(brand.slug))}
              >
                샘플보기
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center rounded-[4px] border border-border-default bg-white px-5 py-4 typo-body-1-medium text-label-default"
                onClick={() => setHistorySheetOpen(true)}
              >
                내 컨설팅 목록
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center rounded-[4px] bg-cautionary px-5 py-4 typo-body-1-medium text-white"
                onClick={goToPhoneAuth}
              >
                컨설팅 시작하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sheet 1: 이전에 컨설팅을 받으신 적이 있나요? */}
      <BottomSheet
        id="history-check-sheet"
        open={historySheetOpen}
        onClose={() => {
          setHistorySheetOpen(false);
          if (openNewSheetAfterClose.current) {
            openNewSheetAfterClose.current = false;
            setNewConsultationSheetOpen(true);
          }
        }}
        hideHandle
        className="gap-8 pt-8"
      >
        <DrawerHeader className="gap-2">
          <DrawerTitle>이전에 컨설팅을 받으신 적이 있나요?</DrawerTitle>
          <DrawerDescription>기존 상담 기록을 불러오기 위해 본인인증이 필요해요.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter
          className="pb-6"
          buttons={[
            <DrawerClose asChild key="no">
              <Button
                theme="white"
                size="lg"
                className="w-full rounded-[4px]"
                onClick={() => {
                  openNewSheetAfterClose.current = true;
                }}
              >
                아뇨 처음입니다!
              </Button>
            </DrawerClose>,
            <DrawerClose asChild key="auth">
              <Button
                theme="black"
                size="lg"
                className="w-full rounded-[4px]"
                onClick={goToPhoneAuth}
              >
                인증하기
              </Button>
            </DrawerClose>,
          ]}
        />
      </BottomSheet>

      {/* Sheet 2: 새로운 컨설팅을 시작할까요? */}
      <BottomSheet
        id="new-consultation-sheet"
        open={newConsultationSheetOpen}
        onClose={() => setNewConsultationSheetOpen(false)}
        hideHandle
        className="gap-8 pt-8"
      >
        <DrawerHeader>
          <DrawerTitle>새로운 컨설팅을 시작할까요?</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter
          className="pb-6"
          buttons={[
            <DrawerClose asChild key="close">
              <Button
                theme="white"
                size="lg"
                className="w-full rounded-[4px]"
              >
                닫기
              </Button>
            </DrawerClose>,
            <DrawerClose asChild key="start">
              <Button
                theme="black"
                size="lg"
                className="w-full rounded-[4px]"
                onClick={goToPhoneAuth}
              >
                시작하기
              </Button>
            </DrawerClose>,
          ]}
        />
      </BottomSheet>
    </>
  );
}

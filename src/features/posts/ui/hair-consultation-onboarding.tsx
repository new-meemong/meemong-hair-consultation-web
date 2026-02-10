'use client';

import Image, { type StaticImageData } from 'next/image';
import { useMemo, useState } from 'react';

import hairConsultationOnboadingDesigner1 from '@/assets/hair-consultation-onboarding/hair_consultation_onboading_designer_1.png';
import hairConsultationOnboadingDesigner2 from '@/assets/hair-consultation-onboarding/hair_consultation_onboading_designer_2.png';
import hairConsultationOnboadingDesigner3 from '@/assets/hair-consultation-onboarding/hair_consultation_onboading_designer_3.png';
import hairConsultationOnboadingDesigner4_1 from '@/assets/hair-consultation-onboarding/hair_consultation_onboading_designer_4_1.png';
import hairConsultationOnboadingDesigner4_2 from '@/assets/hair-consultation-onboarding/hair_consultation_onboading_designer_4_2.png';
import hairConsultationOnboadingDesigner5 from '@/assets/hair-consultation-onboarding/hair_consultation_onboading_designer_5.png';
import hairConsultationOnboardingModel1 from '@/assets/hair-consultation-onboarding/hair_consultation_onboarding_model_1.png';
import hairConsultationOnboadingModel2 from '@/assets/hair-consultation-onboarding/hair_consultation_onboading_model_2.png';
import hairConsultationOnboadingModel3_1 from '@/assets/hair-consultation-onboarding/hair_consultation_onboading_model_3_1.png';
import hairConsultationOnboadingModel3_2 from '@/assets/hair-consultation-onboarding/hair_consultation_onboading_model_3_2.png';
import hairConsultationOnboadingModel4 from '@/assets/hair-consultation-onboarding/hair_consultation_onboading_model_4.png';
import { Button } from '@/shared';
import { SiteHeader } from '@/widgets/header';

type HairConsultationOnboardingRole = 'model' | 'designer';

type HairConsultationOnboardingPage = {
  title: string;
  description: string;
  images: StaticImageData[];
  stackedImages?: boolean;
};

type HairConsultationOnboardingProps = {
  role: HairConsultationOnboardingRole;
  onComplete: () => void;
};

const MODEL_ONBOARDING_PAGES: HairConsultationOnboardingPage[] = [
  {
    title: '인생머리 해 줄 디자이너 찾기!',
    description: '마음에 드는 답변을 써준 디자이너에게\n먼저 채팅을 걸 수 있어요',
    images: [hairConsultationOnboardingModel1],
  },
  {
    title: '사진 올리고 더 많은 답변 받아보세요',
    description:
      '헤어상담에서 가장 중요한 것은 사진이에요\n가이드에 맞는 사진을 올리면 더 많은\n답변을 받아볼 수 있어요',
    images: [hairConsultationOnboadingModel2],
  },
  {
    title: '이런 글/활동은 안돼요!',
    description: '부적절한 사용이 반복되면 계정이 정지될 수 있습니다.',
    images: [hairConsultationOnboadingModel3_1, hairConsultationOnboadingModel3_2],
    stackedImages: true,
  },
  {
    title: '이런 글/활동은 안돼요!',
    description: '부적절한 사용이 반복되면 계정이 정지될 수 있습니다.',
    images: [hairConsultationOnboadingModel4],
  },
];

const DESIGNER_ONBOARDING_PAGES: HairConsultationOnboardingPage[] = [
  {
    title: '고객을 모집하고 싶어요!',
    description: '답변이 마음에 들면 고객이 먼저 채팅해요.\n디자이너는 먼저 채팅할 수 없어요',
    images: [hairConsultationOnboadingDesigner1],
  },
  {
    title: '성실 답변으로 10몽 리워드 받기',
    description:
      '4개 이상 항목에 "매장상담이 필요해요"가 아닌,\n참고 이미지가 들어간 정성스러운 답변을 달아주세요.',
    images: [hairConsultationOnboadingDesigner2],
  },
  {
    title: '상담왕이 되어보세요',
    description:
      '성실답변, 일반답변, 일반댓글은 점수가 달라요.\n더 많이, 더 높은 퀄리티의 답변을 제공할수록\n많은 상담왕 점수를 제공합니다!',
    images: [hairConsultationOnboadingDesigner3],
  },
  {
    title: '이런 글/활동은 안돼요!',
    description: '부적절한 사용이 반복되면 계정이 정지될 수 있습니다.',
    images: [hairConsultationOnboadingDesigner4_1, hairConsultationOnboadingDesigner4_2],
    stackedImages: true,
  },
  {
    title: '이런 글/활동은 안돼요!',
    description:
      '부적절한 사용이 반복되면 계정이 정지될 수 있습니다.\n신고가 접수된 답변은 미몽팀에서 확인해요.',
    images: [hairConsultationOnboadingDesigner5],
  },
];

function OnboardingImages({ page }: { page: HairConsultationOnboardingPage }) {
  if (page.stackedImages && page.images.length > 1) {
    return (
      <div className="mt-8 flex w-full flex-col gap-5">
        {page.images.map((image, index) => (
          <Image
            key={`${page.title}-stacked-${index}`}
            src={image}
            alt={`${page.title} ${index + 1}`}
            className="h-auto w-full object-contain"
            priority={index === 0}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-8 flex w-full flex-col">
      {page.images.map((image, index) => (
        <Image
          key={`${page.title}-${index}`}
          src={image}
          alt={page.title}
          className="h-auto w-full object-contain"
          priority={index === 0}
        />
      ))}
    </div>
  );
}

export default function HairConsultationOnboarding({
  role,
  onComplete,
}: HairConsultationOnboardingProps) {
  const pages = useMemo(
    () => (role === 'model' ? MODEL_ONBOARDING_PAGES : DESIGNER_ONBOARDING_PAGES),
    [role],
  );
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const isFirstPage = currentPageIndex === 0;
  const isLastPage = currentPageIndex === pages.length - 1;
  const currentPage = pages[currentPageIndex];

  const handlePrev = () => {
    if (isFirstPage) return;
    setCurrentPageIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if (isLastPage) return;
    setCurrentPageIndex((prev) => Math.min(prev + 1, pages.length - 1));
  };

  return (
    <div className="h-screen w-full bg-white">
      <div className="mx-auto flex h-full w-full max-w-screen-sm flex-col">
        <SiteHeader title="" />
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="flex min-h-full flex-col justify-center py-8">
            <div className="px-5">
              <div className="min-h-[120px]">
                <p className="whitespace-pre-line text-left typo-title-2-semibold text-label-default">
                  {currentPage.title}
                </p>
                <p className="mt-3 whitespace-pre-line text-left typo-body-2-long-regular text-label-sub">
                  {currentPage.description}
                </p>
              </div>
            </div>
            <OnboardingImages page={currentPage} />
          </div>
        </div>

        <div className="px-5 pb-8 pt-6">
          <div className="flex items-center justify-center gap-2">
            {pages.map((_, index) => (
              <span
                key={`onboarding-dot-${index}`}
                className={`size-1.5 rounded-full ${
                  index === currentPageIndex ? 'bg-cautionary' : 'bg-label-disable'
                }`}
              />
            ))}
          </div>

          {isLastPage ? (
            <Button size="lg" className="mt-6 w-full rounded-4" onClick={onComplete}>
              헤어 상담 시작하기
            </Button>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-2">
              <Button
                size="lg"
                theme="white"
                className="rounded-4"
                disabled={isFirstPage}
                onClick={handlePrev}
              >
                이전
              </Button>
              <Button size="lg" className="rounded-4" onClick={handleNext}>
                다음
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

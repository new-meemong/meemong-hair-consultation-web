import { useState } from 'react';

import Image from 'next/image';

import { DrawerClose , DrawerFooter , DrawerDescription, DrawerHeader, DrawerTitle } from '@/shared/ui/drawer';

import { Button } from '@/shared';

type DesignerOnboardingGuideContent = {
  title: string;
  description: string;
  image: string;
  buttonLabel: string;
};

const DESIGNER_ONBOARDING_GUIDE_CONTENT: Record<number, DesignerOnboardingGuideContent> = {
  0: {
    title: '헤어 상담 댓글로 고객을 모집해요',
    description: '디자이너 댓글이 마음에 들면 고객이 먼저 채팅을 걸어요',
    image: '/designer-onboarding-guide1.png',
    buttonLabel: '다음',
  },
  1: {
    title: '비밀 댓글로 자유롭게 상담해요',
    description: '다른 디자이너가 내 댓글을 볼 수 없게 선택할 수 있어요',
    image: '/designer-onboarding-guide2.png',
    buttonLabel: '다음',
  },
  2: {
    title: '미몽 안에서 상담해요',
    description: '댓글로 연락처, SNS 계정을 공유하면 계정이 정지될 수 있어요',
    image: '/designer-onboarding-guide3.png',
    buttonLabel: '확인',
  },
} as const;

function DesignerOnboardingSheetContent() {
  const [step, setStep] = useState(0);

  const { title, description, image, buttonLabel } = DESIGNER_ONBOARDING_GUIDE_CONTENT[step];

  const handleNextClick = () => {
    setStep((prev) => prev + 1);
  };

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>{title}</DrawerTitle>
        <DrawerDescription>{description}</DrawerDescription>
      </DrawerHeader>
      <Image
        className="object-cover"
        style={{ width: 'auto', height: '172px' }}
        src={image}
        alt="디자이너 온보딩 이미지"
        width={329}
        height={172}
        priority={step === 0}
        loading={step === 0 ? 'eager' : 'lazy'}
      />
      <DrawerFooter
        buttons={
          step < 2
            ? [
                <Button size="lg" key="next" onClick={handleNextClick}>
                  {buttonLabel}
                </Button>,
              ]
            : [
                <DrawerClose asChild key="close">
                  <Button size="lg">{buttonLabel}</Button>
                </DrawerClose>,
              ]
        }
      ></DrawerFooter>
    </>
  );
}

export default DesignerOnboardingSheetContent;

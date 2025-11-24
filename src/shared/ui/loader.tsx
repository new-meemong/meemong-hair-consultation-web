'use client';

import Lottie, { type LottieRefCurrentProps } from 'lottie-react';
import { forwardRef, useRef, useEffect } from 'react';



import loaderDark from '@/assets/lottie/Loader_final_dark.json';
import loaderShort from '@/assets/lottie/Loader_final_short.json';
import loaderWhite from '@/assets/lottie/Loader_final_white.json';
import { cn } from '@/shared/lib/utils';

interface LoaderProps {
  /** 로더 크기 */
  size: 'sm' | 'md';
  /** 테마 (dark/light/short) */
  theme: 'dark' | 'light' | 'short';
  /** 추가 CSS 클래스 */
  className?: string;
  /** 애니메이션 속도 (1이 기본값) */
  speed?: number;
}

const sizeClasses = {
  sm: 'w-7 h-7',
  md: 'w-9 h-9',
};

const Loader = forwardRef<HTMLDivElement, LoaderProps>(
  ({ size, theme, className, speed = 1 }, ref) => {
    const lottieRef = useRef<LottieRefCurrentProps>(null);

    const getAnimationData = () => {
      switch (theme) {
        case 'short':
          return loaderShort;
        case 'light':
          return loaderWhite;
        case 'dark':
          return loaderDark;
      }
    };

    useEffect(() => {
      if (lottieRef.current) {
        lottieRef.current.setSpeed(speed);
      }
    }, [speed]);

    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center justify-center', sizeClasses[size], className)}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={getAnimationData()}
          loop
          autoplay
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    );
  },
);

Loader.displayName = 'Loader';

export { Loader };
export type { LoaderProps };

'use client';

import { forwardRef, useRef, useEffect } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { cn } from '@/shared/lib/utils';

import loaderDark from '@/assets/lottie/Loader_final_dark.json';
import loaderWhite from '@/assets/lottie/Loader_final_white.json';
import loaderShort from '@/assets/lottie/Loader_final_short.json';

interface LoaderProps {
  /** 로더 크기 */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** 테마 (dark/light) */
  theme?: 'dark' | 'light';
  /** 짧은 애니메이션 사용 여부 */
  variant?: 'default' | 'short';
  /** 추가 CSS 클래스 */
  className?: string;
  /** 애니메이션 속도 (1이 기본값) */
  speed?: number;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

const Loader = forwardRef<HTMLDivElement, LoaderProps>(
  ({ size = 'md', theme = 'dark', variant = 'default', className, speed = 1 }, ref) => {
    const lottieRef = useRef<LottieRefCurrentProps>(null);

    const getAnimationData = () => {
      if (variant === 'short') {
        return loaderShort;
      }
      return theme === 'light' ? loaderWhite : loaderDark;
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

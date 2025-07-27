import { useEffect, useRef, useCallback } from 'react';

type UseScrollSelectorProps<T> = {
  options: T[];
  selectedOption: T;
  onSelect: (item: T) => void;
};

export function useScrollSelector<T extends string | number>({
  options,
  selectedOption,
  onSelect,
}: UseScrollSelectorProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 스크롤을 중앙으로 이동시키는 함수
  const scrollToCenter = useCallback((index: number) => {
    if (!containerRef.current || !buttonRefs.current[index]) return;

    const container = containerRef.current;
    const button = buttonRefs.current[index];
    const containerHeight = container.offsetHeight;
    const buttonHeight = button.offsetHeight;
    const scrollTop = button.offsetTop - containerHeight / 2 + buttonHeight / 2;

    isScrollingRef.current = true;
    container.scrollTo({
      top: Math.max(0, scrollTop),
      behavior: 'smooth',
    });

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 300);
  }, []);

  // 선택된 옵션이 항상 중앙으로 오도록 스크롤 처리
  useEffect(() => {
    const selectedIdx = options.findIndex((option) => option === selectedOption);
    if (selectedIdx !== -1) {
      scrollToCenter(selectedIdx);
    }
  }, [selectedOption, options, scrollToCenter]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // 스크롤할 때 중앙에 선택된 옵션이 onSelect 되도록 함
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;

        let maxRatio = 0;
        let mostVisibleButton: HTMLButtonElement | null = null;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisibleButton = entry.target as HTMLButtonElement;
          }
        });

        if (mostVisibleButton && maxRatio > 0.5) {
          const optionIndex = buttonRefs.current.findIndex((btn) => btn === mostVisibleButton);
          if (optionIndex !== -1 && optionIndex < options.length) {
            const currentSelected = options[optionIndex];
            if (currentSelected !== selectedOption) {
              onSelect(currentSelected);
            }
          }
        }
      },
      {
        root: containerRef.current,
        rootMargin: '-40% 0px -40% 0px',
        threshold: [0, 0.3, 0.5, 0.7, 1.0],
      },
    );

    buttonRefs.current.forEach((button) => {
      if (button) {
        observer.observe(button);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [options, onSelect, selectedOption]);

  const setButtonRef = useCallback(
    (index: number) => (el: HTMLButtonElement | null) => {
      if (!el) return;
      buttonRefs.current[index] = el;
    },
    [],
  );

  return {
    containerRef,
    setButtonRef,
  };
}

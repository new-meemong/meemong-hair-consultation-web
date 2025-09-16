import { useCallback, useEffect, useRef } from 'react';

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
    }, 500);
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

  // 가장 중앙에 가까운 옵션을 찾는 함수
  const findCenterOption = useCallback(() => {
    if (!containerRef.current) return -1;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.top + containerRect.height / 2;

    let closestIndex = -1;
    let minDistance = Infinity;

    buttonRefs.current.forEach((button, index) => {
      if (!button) return;

      const buttonRect = button.getBoundingClientRect();
      const buttonCenter = buttonRect.top + buttonRect.height / 2;
      const distance = Math.abs(buttonCenter - containerCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }, []);

  // 스크롤 종료 후 중앙 정렬
  const handleScrollEnd = useCallback(() => {
    if (isScrollingRef.current) return;

    const centerIndex = findCenterOption();
    if (centerIndex !== -1 && centerIndex < options.length) {
      const centerOption = options[centerIndex];
      if (centerOption !== selectedOption) {
        onSelect(centerOption);
        scrollToCenter(centerIndex);
      }
    }
  }, [findCenterOption, options, selectedOption, onSelect, scrollToCenter]);

  // 스크롤 이벤트 처리 - 부드러운 디바운싱
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let scrollEndTimer: NodeJS.Timeout;

    const handleScroll = () => {
      if (isScrollingRef.current) return;

      // 스크롤 종료를 감지하기 위한 디바운싱
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        handleScrollEnd();
      }, 200); // 200ms 후 스크롤이 끝났다고 가정
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollEndTimer);
    };
  }, [handleScrollEnd]);

  const setButtonRef = useCallback(
    (index: number) => (el: HTMLButtonElement | null) => {
      if (!el) return;
      buttonRefs.current[index] = el;
    },
    [],
  );

  const handleButtonClick = useCallback((index: number) => {
    if (index < 0 || index >= options.length) return;
    
    const clickedOption = options[index];
    onSelect(clickedOption);
    scrollToCenter(index);
  }, [options, onSelect, scrollToCenter]);

  return {
    containerRef,
    setButtonRef,
    handleButtonClick,
  };
}

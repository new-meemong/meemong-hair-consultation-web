'use client';

import { useCallback, useEffect, useRef } from 'react';

export const POSTS_PAGE_KEY = 'posts-page';

type ScrollPosition = {
  x: number;
  y: number;
};

const scrollPositions = new Map<string, ScrollPosition>();

export function useScrollRestoration(key: string) {
  const containerRef = useRef<HTMLDivElement>(null);

  const saveScrollPosition = useCallback(() => {
    if (!containerRef.current) return;

    const scrollTop = containerRef.current.scrollTop;
    const scrollLeft = containerRef.current.scrollLeft;

    scrollPositions.set(key, {
      x: scrollLeft,
      y: scrollTop,
    });
  }, [key]);

  const restoreScrollPosition = useCallback(() => {
    if (!containerRef.current) return;

    const position = scrollPositions.get(key);
    if (!position) return;

    containerRef.current.scrollTo({
      left: position.x,
      top: position.y,
      behavior: 'instant',
    });
  }, [key]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const restoreTimer = setTimeout(restoreScrollPosition, 50);

    let saveTimer: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(saveScrollPosition, 100);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(restoreTimer);
      clearTimeout(saveTimer);
      container.removeEventListener('scroll', handleScroll);
      saveScrollPosition();
    };
  }, [key, restoreScrollPosition, saveScrollPosition]);

  return {
    containerRef,
    saveScrollPosition,
    restoreScrollPosition,
  };
}

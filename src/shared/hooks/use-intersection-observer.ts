import { useEffect, useRef } from 'react';

interface UseIntersectionObserverProps {
  onIntersect: () => void;
  enabled?: boolean;
  threshold?: number;
  rootMargin?: string;
}

export function useIntersectionObserver({
  onIntersect,
  enabled = true,
  threshold = 0.1,
  rootMargin = '100px',
}: UseIntersectionObserverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [onIntersect, enabled, threshold, rootMargin]);

  return ref;
}

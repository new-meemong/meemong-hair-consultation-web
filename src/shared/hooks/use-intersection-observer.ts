import { useCallback, useEffect, useState } from 'react';

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
  const [target, setTarget] = useState<Element | null>(null);

  const ref = useCallback((node: Element | null) => {
    setTarget(node);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    if (!target) return;

    if (typeof window === 'undefined' || typeof window.IntersectionObserver !== 'function') {
      return;
    }

    let observer: IntersectionObserver;

    try {
      observer = new window.IntersectionObserver(
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
    } catch {
      return;
    }

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [onIntersect, enabled, threshold, rootMargin, target]);

  return ref;
}

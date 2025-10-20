import { useEffect, useRef } from 'react';

type UseIntersectionObserverTabProps<T extends string> = {
  tabValues: readonly T[];
  onTabChange: (tab: T) => void;
};

export default function useIntersectionObserverTab<T extends string>({
  tabValues,
  onTabChange,
}: UseIntersectionObserverTabProps<T>) {
  const refs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});

  tabValues.forEach((tab) => {
    if (!refs.current[tab]) {
      refs.current[tab] = { current: null };
    }
  });

  useEffect(() => {
    const sectionStates = new Map<string, boolean>();
    const currentRefs = refs.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = entry.target.getAttribute('data-section');
          if (section) {
            sectionStates.set(section, entry.isIntersecting);
          }
        });

        const visibleSections = Array.from(sectionStates.entries())
          .filter(([_, isIntersecting]) => isIntersecting)
          .map(([section]) => {
            const ref = currentRefs[section];
            return {
              section,
              bottom: ref?.current?.getBoundingClientRect().bottom || 0,
            };
          })
          .sort((a, b) => b.bottom - a.bottom);

        if (visibleSections.length > 0) {
          const bottomSection = visibleSections[0].section as T;
          onTabChange(bottomSection);
        }
      },
      {
        threshold: 1,
      },
    );

    // 모든 ref를 observer에 등록
    Object.values(currentRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(currentRefs).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [tabValues, onTabChange]);

  return refs.current;
}

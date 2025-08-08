import { useEffect, useState } from 'react';

export function useDynamicSkeletonCount(itemHeight: number) {
  const [count, setCount] = useState(10);

  useEffect(() => {
    const calculateCount = () => {
      const screenHeight = window.innerHeight;
      const itemsNeeded = Math.ceil(screenHeight / itemHeight);
      setCount(itemsNeeded);
    };

    calculateCount();
    window.addEventListener('resize', calculateCount);

    return () => {
      window.removeEventListener('resize', calculateCount);
    };
  }, [itemHeight]);

  return count;
}

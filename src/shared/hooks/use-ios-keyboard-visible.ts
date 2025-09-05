import { useEffect, useState } from 'react';

export default function useIOSKeyboardVisible(): boolean {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initialViewportHeight = window.visualViewport?.height || window.innerHeight;
    let currentViewportHeight = initialViewportHeight;

    const handleViewportChange = () => {
      const newHeight = window.visualViewport?.height || window.innerHeight;
      const heightDifference = currentViewportHeight - newHeight;

      // iOS에서 키보드가 올라오면 viewport 높이가 줄어듦 (보통 200px 이상)
      const isKeyboardUp = heightDifference > 150;

      setIsKeyboardVisible(isKeyboardUp);
      currentViewportHeight = newHeight;
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      return () => {
        window.visualViewport?.removeEventListener('resize', handleViewportChange);
      };
    }

    window.addEventListener('resize', handleViewportChange);
    return () => {
      window.removeEventListener('resize', handleViewportChange);
    };
  }, []);

  return isKeyboardVisible;
}

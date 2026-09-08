import { AD_TYPE } from '@/features/ad/constants/ad-type';
import { openExternalUrl } from '@/shared/lib/open-external-url';
import {
  AD_BEFORE_ACTION_RESULT,
  requestAdBeforeActionInApp,
} from '@/shared/lib/request-ad-before-action-in-app';
import { useCallback, useEffect, useRef } from 'react';

export default function useOpenExperienceGroupLink() {
  const pending = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return useCallback(async (url: string) => {
    if (pending.current) return;
    pending.current = true;
    try {
      // 패스 면제는 광고별 isAppliedPass와 실제 패스 상태를 아는 앱이 판단한다.
      const result = await requestAdBeforeActionInApp({
        adType: AD_TYPE.SNS_URL_IN_EXPERIENCE_GROUP,
      });
      // 브라우저와 완료 채널이 없는 구버전 앱은 기존 링크 이동을 유지한다.
      if (mounted.current && result !== AD_BEFORE_ACTION_RESULT.NOT_COMPLETED) {
        openExternalUrl(url);
      }
    } finally {
      pending.current = false;
    }
  }, []);
}

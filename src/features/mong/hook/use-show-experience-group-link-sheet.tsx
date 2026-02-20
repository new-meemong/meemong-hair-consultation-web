import { AD_TYPE } from '@/features/ad/constants/ad-type';
import openUrlInApp from '@/shared/lib/open-url-in-app';
import { showAdIfAllowed } from '@/shared/lib/show-ad-if-allowed';
import { useCallback } from 'react';
import useGetGrowthPassStatus from '@/features/growth-pass/api/use-get-growth-pass-status';

type ShowExperienceGroupLinkSheetParams = {
  designerName: string;
  experienceGroupId: number;
  url: string;
};

// Active flow: growth pass check + ad exposure.
// Legacy bottom-sheet flow is separated in:
// use-show-experience-group-link-sheet-bottom-sheet.tsx
export default function useShowExperienceGroupLinkSheet() {
  const { data: growthPassStatus } = useGetGrowthPassStatus();

  const showExperienceGroupLinkSheet = useCallback(
    async ({ url }: ShowExperienceGroupLinkSheetParams) => {
      // 성장패스가 활성화되어 있으면 광고 없이 바로 링크로 이동
      if (growthPassStatus?.data?.isActive) {
        openUrlInApp(url);
        return { growthPassActive: true };
      }

      // 성장패스 미사용자는 광고 노출 후 링크 이동
      showAdIfAllowed({ adType: AD_TYPE.SNS_URL_IN_EXPERIENCE_GROUP });
      openUrlInApp(url);
      return { growthPassActive: false };
    },
    [growthPassStatus],
  );

  return showExperienceGroupLinkSheet;
}

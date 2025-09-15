import type { Treatment } from '@/entities/posts/model/post-detail';
import type { SKIN_TONE_OPTION_VALUE } from '@/features/posts/constants/skin-tone';
import ConsultingInputResultListItem from '@/features/posts/ui/consulting-input-result-list-item';
import SkinColorLabel from '@/features/posts/ui/skin-color-label';
import { Separator } from '@/shared';
import type { ValueOf } from '@/shared/type/types';

import ConsultingResponseSidebarItem from './consulting-response-sidebar-item';

type ConsultingResponseSidebarAdditionalInfoTabViewProps = {
  hairConcern?: string;
  skinToneValue: ValueOf<typeof SKIN_TONE_OPTION_VALUE> | null;
  treatments: Treatment[];
};

export default function ConsultingResponseSidebarAdditionalInfoTabView({
  hairConcern,
  skinToneValue,
  treatments,
}: ConsultingResponseSidebarAdditionalInfoTabViewProps) {
  return (
    <div className="flex flex-col py-8 gap-5">
      {hairConcern && (
        <ConsultingResponseSidebarItem label="고민 내용">
          <p className="typo-body-2-long-regular text-label-info whitespace-pre-line">
            {hairConcern}
          </p>
        </ConsultingResponseSidebarItem>
      )}
      {treatments.length > 0 && (
        <>
          <Separator />
          <ConsultingResponseSidebarItem label="최근 2년간 받은 시술">
            {treatments.map(({ treatmentName, treatmentDate }, index) => (
              <ConsultingInputResultListItem
                key={`${treatmentName}-${treatmentDate}-${index}`}
                name={treatmentName}
                description={treatmentDate}
              />
            ))}
          </ConsultingResponseSidebarItem>
        </>
      )}
      {skinToneValue && (
        <>
          <Separator />
          <ConsultingResponseSidebarItem
            label="피부톤"
            className="flex flex-row items-center justify-between"
          >
            <SkinColorLabel type={skinToneValue} />
          </ConsultingResponseSidebarItem>
        </>
      )}
    </div>
  );
}

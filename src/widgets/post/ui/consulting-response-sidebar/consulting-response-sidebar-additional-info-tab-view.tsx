import SkinColorLabel, { SKIN_COLOR_TYPE } from '@/features/posts/ui/skin-color-label';
import ConsultingResponseSidebarItem from './consulting-response-sidebar-item';
import type { ValueOf } from '@/shared/type/types';
import { Separator } from '@/shared';
import ConsultingInputResultListItem from '@/features/posts/ui/consulting-input-result-list-item';

type ConsultingResponseSidebarAdditionalInfoTabViewProps = {
  hairConcern: string;
  skinColorType: ValueOf<typeof SKIN_COLOR_TYPE>;
  operations: {
    name: string;
    description: string;
  }[];
};

export default function ConsultingResponseSidebarAdditionalInfoTabView({
  hairConcern,
  skinColorType,
  operations,
}: ConsultingResponseSidebarAdditionalInfoTabViewProps) {
  return (
    <div className="flex flex-col py-8 gap-5">
      <ConsultingResponseSidebarItem label="헤어 고민 종류">
        <p className="typo-body-2-long-regular text-label-info whitespace-pre-line">
          {hairConcern}
        </p>
      </ConsultingResponseSidebarItem>
      <Separator />
      <ConsultingResponseSidebarItem label="최근 2년간 받은 시술">
        {operations.map((operation, index) => (
          <ConsultingInputResultListItem
            key={`${operation.name}-${operation.description}-${index}`}
            name={operation.name}
            description={operation.description}
          />
        ))}
      </ConsultingResponseSidebarItem>
      <Separator />
      <ConsultingResponseSidebarItem
        label="피부톤"
        className="flex flex-row items-center justify-between"
      >
        <SkinColorLabel type={skinColorType} />
      </ConsultingResponseSidebarItem>
    </div>
  );
}

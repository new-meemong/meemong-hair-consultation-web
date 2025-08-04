import ConsultingResponseTab from '@/features/posts/ui/consulting-response/consulting-response-tab';
import {
  CONSULTING_RESPONSE_TAB,
  CONSULTING_RESPONSE_TAB_OPTION,
  CONSULTING_RESPONSE_TAB_OPTIONS,
} from '@/widgets/post/constants/consulting-response-tab';
import type { ValueOf } from '@/shared/type/types';
import { useState } from 'react';

export default function ConsultingResponseContainer() {
  const [activeTab, setActiveTab] = useState<ValueOf<typeof CONSULTING_RESPONSE_TAB>>(
    CONSULTING_RESPONSE_TAB_OPTIONS[0].value,
  );

  const handleTabChange = (tab: ValueOf<typeof CONSULTING_RESPONSE_TAB>) => {
    setActiveTab(tab);
  };

  const Component = CONSULTING_RESPONSE_TAB_OPTION[activeTab].component;

  return (
    <div className="flex flex-col px-5 py-8 gap-8 ">
      <ConsultingResponseTab activeTab={activeTab} handleTabChange={handleTabChange} />
      <Component />
    </div>
  );
}

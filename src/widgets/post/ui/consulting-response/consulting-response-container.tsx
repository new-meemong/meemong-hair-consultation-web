import { useState } from 'react';

import type { ConsultingResponse } from '@/entities/posts/model/consulting-response';
import getBangsStyleValue from '@/features/posts/lib/get-bangs-style-value';
import getFaceShapeValue from '@/features/posts/lib/get-face-shape-value';
import getHairTypeValue from '@/features/posts/lib/get-hair-type-value';
import { Separator } from '@/shared';
import useIntersectionObserverTab from '@/shared/hooks/use-intersection-observer-tab';
import type { ValueOf } from '@/shared/type/types';
import Tab from '@/shared/ui/tab';
import {
  CONSULTING_RESPONSE_TAB,
  CONSULTING_RESPONSE_TAB_OPTIONS,
} from '@/widgets/post/constants/consulting-response-tab';

import ConsultingResponseCurrentStateContainer from './consulting-response-current-state-container';
import ConsultingResponsePriceContainer from './consulting-response-price-container';
import ConsultingResponseRecommendStyleContainer from './consulting-response-recommend-style-container';

type ConsultingResponseContainerProps = {
  consultingResponse: ConsultingResponse;
};

export default function ConsultingResponseContainer({
  consultingResponse,
}: ConsultingResponseContainerProps) {
  const [activeTab, setActiveTab] = useState<ValueOf<typeof CONSULTING_RESPONSE_TAB>>(
    CONSULTING_RESPONSE_TAB_OPTIONS[0].value,
  );

  const tabValues = CONSULTING_RESPONSE_TAB_OPTIONS.map((option) => option.value);
  const refs = useIntersectionObserverTab({
    tabValues,
    onTabChange: setActiveTab,
  });

  const handleTabChange = (tab: ValueOf<typeof CONSULTING_RESPONSE_TAB>) => {
    setActiveTab(tab);

    const targetRef = refs[tab];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const faceShape = getFaceShapeValue(consultingResponse.faceShape);
  const hairType = getHairTypeValue(consultingResponse.hairType);
  const bangStyle = getBangsStyleValue(consultingResponse.bangsRecommendation);

  return (
    <div>
      <div className="sticky top-0 z-999 bg-white">
        <Tab
          options={CONSULTING_RESPONSE_TAB_OPTIONS}
          value={activeTab}
          onChange={handleTabChange}
        />
      </div>
      <div className="flex flex-col px-5 py-8 gap-8 ">
        <div
          ref={refs[CONSULTING_RESPONSE_TAB.CURRENT_STATE]}
          data-section={CONSULTING_RESPONSE_TAB.CURRENT_STATE}
          className="scroll-mt-20"
        >
          <ConsultingResponseCurrentStateContainer
            faceShape={faceShape}
            hairType={hairType}
            isHairTypeStoreConsultNeed={consultingResponse.isHairTypeStoreConsultNeed}
            damageLevel={consultingResponse.damageLevel}
            isDamageLevelStoreConsultNeed={consultingResponse.isDamageLevelConsultNeed}
          />
        </div>
        <Separator />
        <div
          ref={refs[CONSULTING_RESPONSE_TAB.RECOMMEND_STYLE]}
          data-section={CONSULTING_RESPONSE_TAB.RECOMMEND_STYLE}
          className="scroll-mt-20"
        >
          <ConsultingResponseRecommendStyleContainer
            bangStyle={bangStyle}
            style={consultingResponse.style}
          />
        </div>
        <Separator />
        <div
          ref={refs[CONSULTING_RESPONSE_TAB.PRICE_AND_COMMENT]}
          data-section={CONSULTING_RESPONSE_TAB.PRICE_AND_COMMENT}
          className="scroll-mt-20"
        >
          <ConsultingResponsePriceContainer
            treatments={consultingResponse.treatments}
            designerName={consultingResponse.designer.name}
            comment={consultingResponse.comment}
          />
        </div>
        <div className=" h-50">dd</div>
      </div>
    </div>
  );
}

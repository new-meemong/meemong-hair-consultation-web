import { useState } from 'react';

import type { ConsultingResponse } from '@/entities/posts/model/consulting-response';
import getBangsStyleValue from '@/features/posts/lib/get-bangs-style-value';
import getFaceShapeValue from '@/features/posts/lib/get-face-shape-value';
import getHairTypeValue from '@/features/posts/lib/get-hair-type-value';
import type { ValueOf } from '@/shared/type/types';
import {
  CONSULTING_RESPONSE_TAB,
  CONSULTING_RESPONSE_TAB_OPTIONS,
} from '@/widgets/post/constants/consulting-response-tab';
import ConsultingResponseTab from '@/widgets/post/ui/consulting-response/consulting-response-tab';

import ConsultingResponseCurrentStateContainer from './consulting-response-current-state-container';
import ConsultingResponsePriceAndCommentContainer from './consulting-response-price-and-comment-container';
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

  console.log('consultingResponse', consultingResponse);

  const handleTabChange = (tab: ValueOf<typeof CONSULTING_RESPONSE_TAB>) => {
    setActiveTab(tab);
  };

  const faceShape = getFaceShapeValue(consultingResponse.faceShape);
  const hairType = getHairTypeValue(consultingResponse.hairType);
  const bangStyle = getBangsStyleValue(consultingResponse.bangsRecommendation);

  const renderContent = () => {
    switch (activeTab) {
      case CONSULTING_RESPONSE_TAB.CURRENT_STATE:
        return (
          <ConsultingResponseCurrentStateContainer
            faceShape={faceShape}
            hairType={hairType}
            isHairTypeStoreConsultNeed={consultingResponse.isHairTypeStoreConsultNeed}
            damageLevel={consultingResponse.damageLevel}
            isDamageLevelStoreConsultNeed={consultingResponse.isDamageLevelConsultNeed}
          />
        );
      case CONSULTING_RESPONSE_TAB.RECOMMEND_STYLE:
        return (
          <ConsultingResponseRecommendStyleContainer
            bangStyle={bangStyle}
            style={consultingResponse.style}
          />
        );
      case CONSULTING_RESPONSE_TAB.PRICE_AND_COMMENT:
        return (
          <ConsultingResponsePriceAndCommentContainer
            treatments={consultingResponse.treatments}
            designerName={consultingResponse.designer.name}
            comment={consultingResponse.comment}
          />
        );
    }
  };

  return (
    <div className="flex flex-col px-5 py-8 gap-8 ">
      <ConsultingResponseTab activeTab={activeTab} handleTabChange={handleTabChange} />
      {renderContent()}
    </div>
  );
}

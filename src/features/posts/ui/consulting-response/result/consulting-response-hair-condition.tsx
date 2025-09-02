import ConsultingHairCondition from '../../consulting-hair-condition';
import ConsultingResponseItem from '../consulting-response-item';
import ConsultingResponseNeedShopConsulting from '../consulting-response-need-shop-consulting';

type ConsultingResponseHairConditionProps = {
  damageLevel: number | null;
  isStoreConsultNeed: boolean;
};

export default function ConsultingResponseHairCondition({
  damageLevel,
  isStoreConsultNeed,
}: ConsultingResponseHairConditionProps) {
  return (
    <ConsultingResponseItem
      title="모발손상 정도 진단"
      content="올려주신 사진을 바탕으로 모발 손상 정도를 진단했어요"
    >
      {damageLevel && !isStoreConsultNeed ? (
        <ConsultingHairCondition value={damageLevel} />
      ) : (
        <ConsultingResponseNeedShopConsulting />
      )}
    </ConsultingResponseItem>
  );
}

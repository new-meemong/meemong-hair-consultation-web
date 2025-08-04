import { HAIR_TYPE_OPTION } from '../../constants/hair-type';
import ConsultingResponseItem from './consulting-response-item';
import ConsultingResponseItemResult from './consulting-response-item-result';
import ConsultingResponseNeedShopConsulting from './consulting-response-need-shop-consulting';

type ConsultingResponseHairTypeProps = {
  value: keyof typeof HAIR_TYPE_OPTION | null;
};

export default function ConsultingResponseHairType({ value }: ConsultingResponseHairTypeProps) {
  return (
    <ConsultingResponseItem
      title="모발타입 진단"
      content="올려주신 사진을 바탕으로 모발타입을 진단했어요"
    >
      {value ? (
        <ConsultingResponseItemResult label={HAIR_TYPE_OPTION[value].label} />
      ) : (
        <ConsultingResponseNeedShopConsulting />
      )}
    </ConsultingResponseItem>
  );
}

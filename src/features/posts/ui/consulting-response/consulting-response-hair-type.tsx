import { HAIR_TYPE_OPTION } from '../../constants/hair-type';
import ConsultingResponseItem from './consulting-response-item';
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
        <div className="rounded-4 bg-alternative p-3 flex items-center justify-start">
          <p className="typo-body-2-medium text-label-sub">{HAIR_TYPE_OPTION[value].label}</p>
        </div>
      ) : (
        <ConsultingResponseNeedShopConsulting />
      )}
    </ConsultingResponseItem>
  );
}

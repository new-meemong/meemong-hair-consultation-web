import type { ValueOf } from '@/shared/type/types';
import { BANG_STYLE, BANG_STYLE_OPTION } from '../../../constants/bang-style';
import ConsultingResponseItem from '../consulting-response-item';
import ConsultingResponseItemResult from '../consulting-response-item-result';
import ConsultingResponseNeedShopConsulting from '../consulting-response-need-shop-consulting';

type ConsultingResponseBangStyleProps = {
  value: ValueOf<typeof BANG_STYLE> | null;
};

export default function ConsultingResponseBangStyle({ value }: ConsultingResponseBangStyleProps) {
  return (
    <ConsultingResponseItem
      title="앞머리 여부 추천"
      content="진단한 결과에 따라 앞머리를 추천했어요"
    >
      {value ? (
        <ConsultingResponseItemResult label={BANG_STYLE_OPTION[value].result} />
      ) : (
        <ConsultingResponseNeedShopConsulting />
      )}
    </ConsultingResponseItem>
  );
}

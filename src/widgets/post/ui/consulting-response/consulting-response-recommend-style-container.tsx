import type { ConsultingResponseStyle } from '@/entities/posts/model/consulting-response';
import { BANG_STYLE } from '@/features/posts/constants/bang-style';
import ConsultingResponseBangStyle from '@/features/posts/ui/consulting-response/result/consulting-response-bang-style';
import ConsultingResponseRecommendStyle from '@/features/posts/ui/consulting-response/result/consulting-response-recommend-style';
import type { ValueOf } from '@/shared/type/types';

type ConsultingResponseRecommendStyleContainerProps = {
  bangStyle: ValueOf<typeof BANG_STYLE> | null;
  style: ConsultingResponseStyle;
};

export default function ConsultingResponseRecommendStyleContainer({
  bangStyle,
  style,
}: ConsultingResponseRecommendStyleContainerProps) {
  return (
    <div className="flex flex-col gap-8">
      <ConsultingResponseBangStyle value={bangStyle} />
      <ConsultingResponseRecommendStyle style={style} />
    </div>
  );
}

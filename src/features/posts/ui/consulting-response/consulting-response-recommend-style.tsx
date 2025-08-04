import { Separator } from '@/shared';
import ConsultingResponseBangStyle from './consulting-response-bang-style';
import { BANG_STYLE } from '../../constants/bang-style';

export default function ConsultingResponseRecommendStyle() {
  // const bangStyle = null;
  const bangStyle = BANG_STYLE.EXPOSED_FOREHEAD;

  return (
    <div className="flex flex-col gap-8">
      <ConsultingResponseBangStyle value={bangStyle} />
      <Separator />
    </div>
  );
}

import { Separator } from '@/shared';
import { BANG_STYLE } from '../../../features/posts/constants/bang-style';
import ConsultingResponseBangStyle from '../../../features/posts/ui/consulting-response/result/consulting-response-bang-style';
import ConsultingResponseRecommendStyle from '../../../features/posts/ui/consulting-response/result/consulting-response-recommend-style';

export default function ConsultingResponseRecommendStyleContainer() {
  // const bangStyle = null;
  const bangStyle = BANG_STYLE.EXPOSED_FOREHEAD;

  const value =
    '(닉네임)님은 얼굴형이 이렇기 때문에, 끝이 가볍고 얼굴을 어느정도 가려줄 수 있는 레이어드컷이 잘 어울릴 것 같아요. 이런 느낌은 요새 많이 선택해주시기 때문에 짧은 기장이지만 부담없이 하실 수 있을 것 같습니다.';

  const images = [
    'https://meemong-job-storage.s3.ap-northeast-2.amazonaws.com/uploads/hair-consult-postings/images/2025/07/22/images/7b759976-7139-4f69-8e74-c8e6a4137d7c/7b759976-7139-4f69-8e74-c8e6a4137d7c.png',
    'https://meemong-job-storage.s3.ap-northeast-2.amazonaws.com/uploads/hair-consult-postings/images/2025/07/22/images/7b759976-7139-4f69-8e74-c8e6a4137d7c/7b759976-7139-4f69-8e74-c8e6a4137d7c.png',
    'https://meemong-job-storage.s3.ap-northeast-2.amazonaws.com/uploads/hair-consult-postings/images/2025/07/22/images/7b759976-7139-4f69-8e74-c8e6a4137d7c/7b759976-7139-4f69-8e74-c8e6a4137d7c.png',
    'https://meemong-job-storage.s3.ap-northeast-2.amazonaws.com/uploads/hair-consult-postings/images/2025/07/22/images/7b759976-7139-4f69-8e74-c8e6a4137d7c/7b759976-7139-4f69-8e74-c8e6a4137d7c.png',
    'https://meemong-job-storage.s3.ap-northeast-2.amazonaws.com/uploads/hair-consult-postings/images/2025/07/22/images/7b759976-7139-4f69-8e74-c8e6a4137d7c/7b759976-7139-4f69-8e74-c8e6a4137d7c.png',
  ];

  return (
    <div className="flex flex-col gap-8">
      <ConsultingResponseBangStyle value={bangStyle} />
      <Separator />
      <ConsultingResponseRecommendStyle value={value} images={images} />
    </div>
  );
}

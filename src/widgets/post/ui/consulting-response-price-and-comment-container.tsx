import ConsultingResponseComment from '@/features/posts/ui/consulting-response/result/consulting-response-comment';
import ConsultingResponsePrice from '@/features/posts/ui/consulting-response/result/consulting-response-price';
import { Separator } from '@/shared';

export default function ConsultingResponsePriceAndCommentContainer() {
  // const comment =
  //   '(닉네임)님은 얼굴형이 이렇기 때문에, 끝이 가볍고 얼굴을 어느정도 가려줄 수 있는 레이어드컷이 잘 어울릴 것 같아요. 이런 느낌은 요새 많이 선택해주시기 때문에 짧은 기장이지만 부담없이 하실 수 있을 것 같습니다.';

  const comment = null;
  return (
    <div className="flex flex-col gap-8">
      <ConsultingResponsePrice designerName="익명" />
      {comment && (
        <>
          <Separator />
          <ConsultingResponseComment comment={comment} />
        </>
      )}
    </div>
  );
}

import ConsultingResponseItem from '../consulting-response-item';

type ConsultingResponseCommentProps = {
  comment: string;
};

export default function ConsultingResponseComment({ comment }: ConsultingResponseCommentProps) {
  return (
    <ConsultingResponseItem
      title="기타 컨설팅 코멘트"
      content="컨설팅 내용 외 코멘트를 남겨주셨습니다"
    >
      <div className="typo-body-2-long-regular text-label-default whitespace-pre-line">
        {comment}
      </div>
    </ConsultingResponseItem>
  );
}

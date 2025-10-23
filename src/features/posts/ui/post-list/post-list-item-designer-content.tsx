type PostListItemDesignerContentProps = {
  content: string;
  maxPaymentPrice: number;
};

export default function PostListItemDesignerContent({
  content,
  maxPaymentPrice,
}: PostListItemDesignerContentProps) {
  return (
    <div className="flex flex-col gap-1.5 flex-1">
      <p className="text-base font-medium text-[#000] overflow-hidden text-ellipsis line-clamp-1">
        {content}
      </p>
      <div className="flex gap-1 items-center">
        <span className="typo-body-2-regular text-label-info">예상 시술비</span>
        <div className="flex items-center gap-0.5">
          <span className="typo-headline-semibold text-label-default">
            {maxPaymentPrice.toLocaleString()}
          </span>
          <span className="typo-body-2-regular text-label-info">원</span>
        </div>
      </div>
    </div>
  );
}

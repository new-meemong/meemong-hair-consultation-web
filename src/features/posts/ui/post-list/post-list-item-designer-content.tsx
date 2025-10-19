type PostListItemDesignerContentProps = {
  content: string;
  maxPaymentPrice: number | null;
};

export default function PostListItemDesignerContent({
  content,
  maxPaymentPrice,
}: PostListItemDesignerContentProps) {
  return (
    <div className="flex flex-col gap-1.5 flex-1">
      <p className="typo-body-1-medium text-label-strong overflow-hidden text-ellipsis line-clamp-1">
        {content}
      </p>
    </div>
  );
}

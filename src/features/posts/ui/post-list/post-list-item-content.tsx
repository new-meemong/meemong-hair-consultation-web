type PostListItemModelContentProps = {
  title: string;
  content: string;
};

export default function PostListItemContent({ title, content }: PostListItemModelContentProps) {
  return (
    <div className="flex flex-col gap-2 flex-1">
      <h2 className="typo-headline-bold text-label-strong overflow-hidden text-ellipsis line-clamp-1">
        {title}
      </h2>
      <p className="typo-body-2-regular text-label-default overflow-hidden text-ellipsis line-clamp-2 break-words whitespace-pre-wrap">
        {content}
      </p>
    </div>
  );
}

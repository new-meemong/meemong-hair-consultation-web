import { CommentEditForm } from '@/features/comments';
import { CommentCard, type Comment } from '@/entities/comment';

interface EditableCommentCardProps {
  comment: Comment;
  isCurrentUser: boolean;
  onEdit?: (commentId: string, newContent: string) => void;
  onDelete?: (commentId: string) => void;
  onReport?: (commentId: string) => void;
  onReply?: (commentId: string) => void;
  showReplyButton?: boolean;
  className?: string;
  isReply?: boolean;
}

export function EditableCommentCard({ comment, onEdit, ...props }: EditableCommentCardProps) {
  const handleSubmitEdit = (commentId: string, newContent: string) => {
    onEdit?.(commentId, newContent);
  };

  return (
    <CommentCard
      comment={comment}
      {...props}
      renderEditForm={(commentId, content, onCancel) => (
        <CommentEditForm
          commentId={commentId}
          initialContent={content}
          onCancel={onCancel}
          onSubmit={handleSubmitEdit}
        />
      )}
    />
  );
}

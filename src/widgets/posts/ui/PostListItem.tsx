'use client';

import { FC } from 'react';
import Image from 'next/image';
import EyeIcon from '@/assets/icons/eye.svg';
import HeartIcon from '@/assets/icons/mdi_heart.svg';
import CommentIcon from '@/assets/icons/comment.svg';
import { type Post } from '@/entities/posts';
import { isValidUrl } from '@/shared/lib/isValidUrl';

interface PostItemProps {
  post: Post;
  onClick?: () => void;
}

export const PostListItem: FC<PostItemProps> = ({ post, onClick }) => {
  const {
    hairConsultPostingCreateUserName,
    createdAt,
    title,
    content,
    repImageUrl,
    viewCount,
    likeCount,
    commentCount,
  } = post;

  const isValidImageUrl = repImageUrl && isValidUrl(repImageUrl);

  return (
    <div className="border-b border-gray-200 p-5 w-full cursor-pointer" onClick={onClick}>
      <div className="flex items-center gap-2 mb-1">
        <div className="flex items-center gap-2">
          <p className="typo-body-3-regular text-label-info">{hairConsultPostingCreateUserName}</p>
          <div className="w-1 h-1 bg-label-placeholder rounded-full" />
          <p className="typo-body-3-regular text-label-info">{createdAt}</p>
        </div>
      </div>
      <div className="flex justify-between gap-5">
        <div>
          <h2 className="typo-headline-bold text-label-strong overflow-hidden text-ellipsis line-clamp-1 mb-2">
            {title}
          </h2>
          <p className="typo-body-2-regular text-label-default overflow-hidden text-ellipsis line-clamp-2">
            {content}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <EyeIcon className="size-4 fill-label-info" />
              <span className="typo-body-2-medium text-label-info">{viewCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <HeartIcon className="w-4 h-4 fill-negative-light" />
              <span className="typo-body-2-medium text-negative-light">{likeCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <CommentIcon className="w-4 h-4 fill-positive" />
              <span className="typo-body-2-medium text-positive">{commentCount}</span>
            </div>
          </div>
        </div>
        {isValidImageUrl && (
          <div className="relative w-22 h-22 flex-shrink-0 aspect-video rounded-4 overflow-hidden">
            <Image src={repImageUrl} alt="피드 이미지" fill className="object-cover " />
          </div>
        )}
      </div>
    </div>
  );
};

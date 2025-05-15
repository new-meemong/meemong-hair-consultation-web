'use client';

import { FC } from 'react';
import Image from 'next/image';
import EyeIcon from '@/assets/icons/eye.svg';
import HeartIcon from '@/assets/icons/mdi_heart.svg';
import CommentIcon from '@/assets/icons/comment.svg';
import { Feed } from '@/entities/feed';
interface FeedItemProps extends Feed {
  onClick?: () => void;
}

export const FeedItem: FC<FeedItemProps> = ({
  author,
  title,
  content,
  imageUrl,
  createdAt,
  views,
  likes,
  comments,
}) => {
  return (
    <div className="border-b border-gray-200 p-5 w-full">
      <div className="flex items-center gap-2 mb-1">
        <div className="flex items-center gap-2">
          <p className="typo-body-3-regular text-label-info">{author}</p>
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
              <span className="typo-body-2-medium text-label-info">{views}</span>
            </div>
            <div className="flex items-center gap-1">
              <HeartIcon className="w-4 h-4 fill-negative-light" />
              <span className="typo-body-2-medium text-negative-light">{likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <CommentIcon className="w-4 h-4 fill-positive" />
              <span className="typo-body-2-medium text-positive">{comments}</span>
            </div>
          </div>
        </div>
        {imageUrl && (
          <div className="relative w-22 h-22 flex-shrink-0 aspect-video rounded-4 overflow-hidden">
            <Image src={imageUrl} alt="피드 이미지" fill className="object-cover " />
          </div>
        )}
      </div>
    </div>
  );
};

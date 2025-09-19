'use client';

import type { RefObject } from 'react';

import Image from 'next/image';

import CommentIcon from '@/assets/icons/comment.svg';
import EyeIcon from '@/assets/icons/eye.svg';
import HeartIcon from '@/assets/icons/mdi_heart.svg';
import { type Post } from '@/entities/posts';
import { useAuthContext } from '@/features/auth/context/auth-context';
import formatAddress from '@/features/auth/lib/format-address';
import { isValidUrl } from '@/shared/lib/is-valid-url';

type PostItemProps = {
  post: Post;
  onClick?: () => void;
  ref?: RefObject<HTMLDivElement | null>;
};

export default function PostListItem({ post, onClick, ref }: PostItemProps) {
  const {
    updatedAt,
    title,
    content,
    repImageUrl,
    viewCount,
    likeCount,
    commentCount,
    hairConsultPostingCreateUserRegion,
  } = post;

  const isValidImageUrl = repImageUrl && isValidUrl(repImageUrl);

  const { isUserDesigner } = useAuthContext();

  return (
    <div
      className="border-b border-gray-200 p-5 w-full h-40 cursor-pointer"
      onClick={onClick}
      ref={ref}
    >
      <div className="flex flex-col gap-2 h-full">
        <div className="flex justify-between items-stretch gap-7 flex-1">
          <div className="flex flex-col min-w-0 flex-1 gap-1">
            <p className="typo-body-3-regular text-label-info">{updatedAt}</p>
            <div className="flex flex-col gap-2 flex-1">
              <h2 className="typo-headline-bold text-label-strong overflow-hidden text-ellipsis line-clamp-1">
                {title}
              </h2>
              <p className="typo-body-2-regular text-label-default overflow-hidden text-ellipsis line-clamp-2 break-words whitespace-pre-wrap">
                {content}
              </p>
            </div>
          </div>

          {isValidImageUrl && (
            <div className="relative w-22 h-22 flex-shrink-0 rounded-4 overflow-hidden">
              <Image src={repImageUrl} alt="피드 이미지" fill className="object-cover " />
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
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
          {isUserDesigner && hairConsultPostingCreateUserRegion && (
            <span className=" typo-body-3-medium text-label-placeholder">
              {formatAddress(hairConsultPostingCreateUserRegion)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

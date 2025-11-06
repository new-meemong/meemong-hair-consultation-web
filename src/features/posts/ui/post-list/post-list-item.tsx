import { useCallback, type RefObject } from 'react';

import Image from 'next/image';

import CommentIcon from '@/assets/icons/comment.svg';
import EyeIcon from '@/assets/icons/eye.svg';
import HeartIcon from '@/assets/icons/mdi_heart.svg';
import { CONSULT_TYPE } from '@/entities/posts/constants/consult-type';
import { useAuthContext } from '@/features/auth/context/auth-context';
import formatAddress from '@/features/auth/lib/format-address';
import formatDateTime from '@/shared/lib/formatDateTime';
import { isValidUrl } from '@/shared/lib/is-valid-url';
import type { ValueOf } from '@/shared/type/types';
import Dot from '@/shared/ui/dot';

import type { EXPERIENCE_GROUP_PRICE_TYPE } from '../../constants/experience-group-price-type';

import PostListItemContent from './post-list-item-content';
import PostListItemContentWithPrice from './post-list-item-price-content';

type PostListItemProps = {
  createdAt: string;
  hairConsultPostingCreateUserRegion?: string;
  price: number | null;
  isConsultingPost: boolean;
  title: string;
  content?: string;
  repImageUrl?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isRead: boolean;
  priceType?: ValueOf<typeof EXPERIENCE_GROUP_PRICE_TYPE>;
  onClick?: () => void;
  ref?: RefObject<HTMLDivElement | null>;
};

export default function PostListItem({
  createdAt,
  hairConsultPostingCreateUserRegion,
  price,
  isConsultingPost,
  title,
  content,
  repImageUrl,
  onClick,
  ref,
  viewCount,
  likeCount,
  commentCount,
  isRead,
  priceType,
}: PostListItemProps) {
  const isValidImageUrl = repImageUrl && isValidUrl(repImageUrl);

  const { isUserDesigner } = useAuthContext();

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  const getContent = useCallback(() => {
    const isDesignerConsultingWithPrice = isUserDesigner && price && isConsultingPost;
    const isConsulting = !isDesignerConsultingWithPrice && content && isConsultingPost;
    const isExperienceGroup = !isConsultingPost && price !== undefined && priceType;

    if (isDesignerConsultingWithPrice) {
      return (
        <PostListItemContentWithPrice
          content={title}
          price={price}
          type={CONSULT_TYPE.CONSULTING}
        />
      );
    }
    if (isConsulting) {
      return <PostListItemContent title={title} content={content} />;
    }
    if (isExperienceGroup) {
      return <PostListItemContentWithPrice content={title} price={price} type={priceType} />;
    }
  }, [isUserDesigner, price, isConsultingPost, content, title, priceType]);

  return (
    <div
      className="border-b border-gray-200 p-5 w-full cursor-pointer"
      onClick={handleClick}
      ref={ref}
    >
      <div className="flex flex-col gap-4.5 h-full">
        <div className="flex justify-between items-stretch gap-7 flex-1">
          <div className="flex flex-col min-w-0 flex-1 gap-1">
            <div className="flex gap-[6.5px] items-center typo-body-3-regular text-label-info">
              {isRead && (
                <>
                  <p>읽음</p>
                  <Dot size="1" />
                </>
              )}
              <p>{formatDateTime(createdAt)}</p>
              {isUserDesigner && hairConsultPostingCreateUserRegion && (
                <>
                  <Dot size="1" />
                  <p>{formatAddress(hairConsultPostingCreateUserRegion)}</p>
                </>
              )}
            </div>
            {getContent()}
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
        </div>
      </div>
    </div>
  );
}

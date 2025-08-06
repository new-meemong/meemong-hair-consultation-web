import type { ReactNode } from 'react';

import { useAuthContext } from '@/features/auth/context/auth-context';
import { cn } from '@/lib/utils';

import ConsultingInputResultListItem from '../consulting-input-result-list-item';
import SkinColorLabel, { SKIN_COLOR_TYPE } from '../skin-color-label';

import PostDetailAuthorProfile from './post-detail-author-profile';
import PostDetailImage from './post-detail-image';


function Separator() {
  return <div className="bg-alternative h-1.5" />;
}

function ContentItem({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <p className="typo-body-1-semibold text-label-default">{label}</p>
      {children}
    </div>
  );
}

function ImageList({
  images,
  onlyShowToDesigner,
}: {
  images: string[];
  onlyShowToDesigner: boolean;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {images.map((image, index) => (
        <PostDetailImage
          key={`${index}-${image}`}
          image={image}
          totalImages={images.length}
          currentIndex={index}
          onlyShowToDesigner={onlyShowToDesigner}
          size="small"
        />
      ))}
    </div>
  );
}

export default function PostDetailConsultingContent() {
  const { user } = useAuthContext();

  const authorImageUrl = null;
  const authorName = '익명';
  const authorRegion = '강남구';
  const createdAt = '03/31 09:00';
  const images = [
    'https://meemong-job-storage.s3.ap-northeast-2.amazonaws.com/uploads/hair-consult-postings/images/2025/07/27/images/b58138c2-c419-45fe-ba1e-2ccd0797326f/b58138c2-c419-45fe-ba1e-2ccd0797326f.svg',
    'https://meemong-job-storage.s3.ap-northeast-2.amazonaws.com/uploads/hair-consult-postings/images/2025/07/27/images/b58138c2-c419-45fe-ba1e-2ccd0797326f/b58138c2-c419-45fe-ba1e-2ccd0797326f.svg',
    'https://meemong-job-storage.s3.ap-northeast-2.amazonaws.com/uploads/hair-consult-postings/images/2025/07/27/images/b58138c2-c419-45fe-ba1e-2ccd0797326f/b58138c2-c419-45fe-ba1e-2ccd0797326f.svg',
    'https://meemong-job-storage.s3.ap-northeast-2.amazonaws.com/uploads/hair-consult-postings/images/2025/07/27/images/b58138c2-c419-45fe-ba1e-2ccd0797326f/b58138c2-c419-45fe-ba1e-2ccd0797326f.svg',
    'https://meemong-job-storage.s3.ap-northeast-2.amazonaws.com/uploads/hair-consult-postings/images/2025/07/27/images/b58138c2-c419-45fe-ba1e-2ccd0797326f/b58138c2-c419-45fe-ba1e-2ccd0797326f.svg',
    'https://meemong-job-storage.s3.ap-northeast-2.amazonaws.com/uploads/hair-consult-postings/images/2025/07/27/images/b58138c2-c419-45fe-ba1e-2ccd0797326f/b58138c2-c419-45fe-ba1e-2ccd0797326f.svg',
  ];
  const operations = [
    {
      name: '헤어 고민 종류',
      description: '2025.03',
    },
    {
      name: '헤어 고민 종류',
      description: '2025.03',
    },
  ];
  const authorId = 1;

  const isWriter = authorId === user.id;
  const onlyShowToDesigner = !isWriter;

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="flex flex-col gap-5 px-5">
        <PostDetailAuthorProfile
          imageUrl={authorImageUrl}
          name={authorName}
          region={authorRegion}
          createdAt={createdAt}
        />
        <p className="typo-title-3-semibold text-label-default">컨설팅 글 제목</p>
        <ContentItem label="헤어 고민 종류">
          <p className="typo-body-2-long-regular text-label-info">헤어 고민 종류</p>
        </ContentItem>
        <ContentItem label="현재 내 사진">
          <ImageList images={images} onlyShowToDesigner={onlyShowToDesigner} />
        </ContentItem>
      </div>
      <Separator />
      <div className="flex flex-col gap-8 px-5">
        <ContentItem label="최근 2년간 받은 시술">
          {operations.map((operation, index) => (
            <ConsultingInputResultListItem
              key={`${operation.name}-${operation.description}-${index}`}
              name={operation.name}
              description={operation.description}
            />
          ))}
        </ContentItem>
        <ContentItem label="추구미 / 평소스타일">
          <ImageList images={images} onlyShowToDesigner={onlyShowToDesigner} />
        </ContentItem>
        <ContentItem label="피부톤" className="flex flex-row items-center justify-between">
          <SkinColorLabel type={SKIN_COLOR_TYPE.VERY_BRIGHT} />
        </ContentItem>
      </div>
    </div>
  );
}

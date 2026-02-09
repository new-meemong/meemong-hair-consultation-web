'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared';
import { SiteHeader } from '@/widgets/header';
import { format } from 'date-fns';
import ProfileIcon from '@/assets/icons/profile.svg';
import { useParams } from 'next/navigation';
import useGetHairConsultationAnswerDetail from '@/features/posts/api/use-get-hair-consultation-answer-detail';

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return format(date, 'MM/dd HH:mm');
};

const joinValues = (values?: string[] | null) => {
  if (!values || values.length === 0) return '-';
  return values.join(', ');
};

const renderAdviceValue = (advice: boolean | number | null | undefined, value: string) => {
  if (advice === true || advice === 1) return '매장 상담 필요';
  return value;
};

export default function NewConsultingResponsePage() {
  const { postId, responseId } = useParams();

  const { data: response } = useGetHairConsultationAnswerDetail(
    postId?.toString() ?? '',
    responseId?.toString() ?? '',
  );
  const answer = response?.data;

  if (!answer) return null;

  const priceText =
    answer.priceType === 'SINGLE'
      ? `${(answer.price ?? 0).toLocaleString()}원`
      : `${(answer.minPrice ?? 0).toLocaleString()}원 ~ ${(answer.maxPrice ?? 0).toLocaleString()}원`;

  return (
    <div className="min-w-[375px] w-full mx-auto flex flex-col h-screen bg-white">
      <SiteHeader title="컨설팅 답변" showBackButton />
      <div className="overflow-y-auto px-5 py-7">
        <div className="flex items-center gap-3">
          <Avatar className="size-11">
            {answer.user.profilePictureURL ? (
              <AvatarImage src={answer.user.profilePictureURL} className="size-11 rounded-full" />
            ) : (
              <AvatarFallback>
                <ProfileIcon className="size-11 bg-label-info" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col">
            <p className="typo-body-1-semibold text-label-default">{answer.user.displayName}</p>
            <p className="typo-body-3-regular text-label-info">{formatDateTime(answer.createdAt)}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="typo-headline-semibold text-label-default">{answer.title}</p>
        </div>

        <div className="mt-7 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <p className="typo-body-1-semibold text-label-default">얼굴형</p>
            <p className="typo-body-2-long-regular text-label-default text-right">
              {renderAdviceValue(answer.isFaceShapeAdvice, answer.faceShape ?? '-')}
            </p>
          </div>
          <div className="flex items-start justify-between gap-3">
            <p className="typo-body-1-semibold text-label-default">앞머리</p>
            <p className="typo-body-2-long-regular text-label-default text-right">
              {renderAdviceValue(
                answer.isBangsTypeAdvice,
                joinValues(answer.bangsTypes as string[] | undefined),
              )}
            </p>
          </div>
          <div className="flex items-start justify-between gap-3">
            <p className="typo-body-1-semibold text-label-default">기장</p>
            <p className="typo-body-2-long-regular text-label-default text-right">
              {renderAdviceValue(answer.isHairLengthAdvice, joinValues(answer.hairLengths))}
            </p>
          </div>
          <div className="flex items-start justify-between gap-3">
            <p className="typo-body-1-semibold text-label-default">레이어</p>
            <p className="typo-body-2-long-regular text-label-default text-right">
              {renderAdviceValue(answer.isHairLayerAdvice, joinValues(answer.hairLayers))}
            </p>
          </div>
          <div className="flex items-start justify-between gap-3">
            <p className="typo-body-1-semibold text-label-default">컬</p>
            <p className="typo-body-2-long-regular text-label-default text-right">
              {renderAdviceValue(answer.isHairCurlAdvice, joinValues(answer.hairCurls))}
            </p>
          </div>
          <div className="flex items-start justify-between gap-3">
            <p className="typo-body-1-semibold text-label-default">가격정보</p>
            <p className="typo-body-2-long-regular text-label-default text-right">{priceText}</p>
          </div>
        </div>

        {answer.styleImages && answer.styleImages.length > 0 && (
          <div className="mt-7">
            <p className="typo-body-1-semibold text-label-default">참고 이미지</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {answer.styleImages.map((imageUrl: string, index: number) => (
                <img
                  key={`${imageUrl}-${index}`}
                  src={imageUrl}
                  alt={`style-image-${index + 1}`}
                  className="w-full h-[140px] object-cover rounded-4"
                />
              ))}
            </div>
          </div>
        )}

        {answer.description && (
          <div className="mt-7">
            <p className="typo-body-1-semibold text-label-default">종합의견</p>
            <p className="mt-2 typo-body-2-long-regular text-label-default whitespace-pre-wrap">
              {answer.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

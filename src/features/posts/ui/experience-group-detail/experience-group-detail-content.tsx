import { AD_TYPE } from '@/features/ad/constants/ad-type';
import Dot from '@/shared/ui/dot';
import { EXPERIENCE_GROUP_PRICE_TYPE } from '../../constants/experience-group-price-type';
import type { ExperienceGroupDetail } from '@/entities/posts/model/experience-group-detail';
import PostDetailAuthorProfile from '../post-detail/post-detail-author-profile';
import PostDetailContentItem from '../post-detail-content-item';
import { formatDate } from 'date-fns';
import openUrlInApp from '@/shared/lib/open-url-in-app';
import { showAdIfAllowed } from '@/shared/lib/show-ad-if-allowed';
import { useAuthContext } from '@/features/auth/context/auth-context';
import useShowModal from '@/shared/ui/hooks/use-show-modal';

function SnsLink({ snsType, url }: { snsType: string; url: string }) {
  const { isUserModel, isUserDesigner } = useAuthContext();

  const showModal = useShowModal();

  const handleClick = () => {
    if (isUserModel) {
      showModal({
        id: 'sns-link-modal',
        text: '링크 이동은 디자이너만 가능합니다.',
        buttons: [
          {
            label: '확인',
          },
        ],
      });
      return;
    }

    // 디자이너가 모델이 올린 체험단 신청 글의 sns link를 클릭하면 광고 표시
    if (isUserDesigner) {
      showAdIfAllowed({ adType: AD_TYPE.snsUrlInExperienceGroup });
    }

    openUrlInApp(url);
  };
  return (
    <div className="flex items-center justify-between bg-alternative rounded-4 gap-4 px-4 py-3">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="typo-body-2-semibold text-label-sub whitespace-nowrap">{snsType}</span>
        <Dot size="0.75" className="bg-label-disable flex-shrink-0" />
        <button
          className="typo-body-3-regular text-label-info flex items-center h-full leading-none"
          onClick={handleClick}
        >
          바로가기
        </button>
      </div>
    </div>
  );
}

type ExperienceGroupDetailContentProps = {
  experienceGroupDetail: ExperienceGroupDetail;
};

export default function ExperienceGroupDetailContent({
  experienceGroupDetail,
}: ExperienceGroupDetailContentProps) {
  const { user, isAnonymous, createdAt, title, content, snsTypes, priceType, price } =
    experienceGroupDetail;

  const getPriceText = () => {
    switch (priceType) {
      case EXPERIENCE_GROUP_PRICE_TYPE.PAY:
        return (
          <p className="typo-body-2-long-regular text-label-sub">
            건 당 <span className="typo-body-1-long-semibold">{price.toLocaleString()}원</span>{' '}
            받아요
          </p>
        );
      case EXPERIENCE_GROUP_PRICE_TYPE.FREE:
        return (
          <p className="typo-body-2-long-regular text-label-sub">
            <span className="typo-body-1-long-semibold">무료시술 </span>
            원해요
          </p>
        );
      case EXPERIENCE_GROUP_PRICE_TYPE.MATERIAL_COST:
        return (
          <p className="typo-body-2-long-regular text-label-sub">
            재료비 <span className="typo-body-1-long-semibold">{price.toLocaleString()}원</span> 낼
            수 있어요
          </p>
        );
    }
  };

  return (
    <>
      <div className="flex flex-col gap-5 px-5 pt-6">
        <PostDetailAuthorProfile
          imageUrl={user.profilePictureURL}
          name={isAnonymous ? '익명' : user.displayName}
          region={null}
          createdAt={formatDate(createdAt, 'MM/dd HH:mm')}
          authorId={user.id}
        />
        <div className="flex flex-col gap-3">
          <p className="typo-title-3-semibold text-label-default">{title}</p>
          <p className="typo-body-1-long-regular text-label-default whitespace-pre-line">
            {content}
          </p>
        </div>
      </div>
      <div className="h-1.5 bg-alternative mt-6 mb-7" />
      <div className="flex flex-col px-5 gap-8">
        <PostDetailContentItem label="협찬 SNS 링크">
          <div className="flex flex-col gap-2">
            {snsTypes.map((snsType) => (
              <SnsLink key={snsType.id} snsType={snsType.snsType} url={snsType.url} />
            ))}
          </div>
        </PostDetailContentItem>
        <PostDetailContentItem label="원하는 협찬">{getPriceText()}</PostDetailContentItem>
      </div>
    </>
  );
}

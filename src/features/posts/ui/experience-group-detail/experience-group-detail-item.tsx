import type { ExperienceGroupDetail } from '@/entities/posts/model/experience-group-detail';

import ExperienceGroupDetailContent from './experience-group-detail-content';

type ExperienceGroupDetailItemProps = {
  experienceGroupDetail: ExperienceGroupDetail;
};

export default function ExperienceGroupDetailItem({
  experienceGroupDetail,
}: ExperienceGroupDetailItemProps) {
  return (
    <>
      <ExperienceGroupDetailContent experienceGroupDetail={experienceGroupDetail} />
    </>
  );
}

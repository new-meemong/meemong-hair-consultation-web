import type { ExperienceGroupDetail } from '@/entities/posts/model/experience-group-detail';
import ExperienceGroupDetailItem from '@/features/posts/ui/experience-group-detail/experience-group-detail-item';

type ExperienceGroupDetailContainerProps = {
  children: React.ReactNode;
  experienceGroupDetail: ExperienceGroupDetail;
};

export default function ExperienceGroupDetailContainer({
  children,
  experienceGroupDetail,
}: ExperienceGroupDetailContainerProps) {
  return (
    <div className="flex flex-col flex-1 h-full relative">
      <div className="flex-1 overflow-y-auto">
        <ExperienceGroupDetailItem experienceGroupDetail={experienceGroupDetail} />
        {children}
      </div>
    </div>
  );
}

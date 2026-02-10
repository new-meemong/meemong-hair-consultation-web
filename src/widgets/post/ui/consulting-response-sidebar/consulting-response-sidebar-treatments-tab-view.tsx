import type { Treatment } from '@/entities/posts/model/post-detail';

type ConsultingResponseSidebarTreatmentsTabViewProps = {
  treatments: Treatment[];
};

export default function ConsultingResponseSidebarTreatmentsTabView({
  treatments,
}: ConsultingResponseSidebarTreatmentsTabViewProps) {
  if (treatments.length === 0) {
    return <p className="typo-body-2-regular text-label-sub">-</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {treatments.map((treatment, index) => {
        const decolorizationCountLabel = String(treatment.decolorizationCount ?? 0);
        const treatmentAreaLabel = treatment.treatmentArea ?? '-';
        const treatmentDateLabel = treatment.treatmentDate || '-';

        return (
          <div
            key={`${treatment.treatmentName}-${treatment.treatmentDate}-${index}`}
            className="rounded-4 bg-alternative px-4 py-3"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="typo-body-2-regular text-label-default">{treatmentDateLabel}</p>
              <p className="typo-body-2-semibold text-label-default">{treatment.treatmentName}</p>
            </div>
            <div className="mt-3 h-px bg-border-default" />
            <p className="mt-3 typo-body-2-regular text-label-info">
              탈색횟수 {decolorizationCountLabel}회 · 시술부위 - {treatmentAreaLabel}
            </p>
          </div>
        );
      })}
    </div>
  );
}

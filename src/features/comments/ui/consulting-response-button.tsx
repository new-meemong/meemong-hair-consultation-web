import { cn } from '@/shared';
import { useAuthContext } from '@/features/auth/context/auth-context';

type ConsultingResponseButtonProps = {
  isCommentWriter: boolean;
  hasAnswerImages: boolean;
  analysisFaceShape?: string | null;
  analysisBangs?: string | null;
  analysisHairLength?: string | null;
  analysisHairCurl?: string | null;
  recommendedTreatment?: string | null;
  onClick: () => void;
};

export default function ConsultingResponseButton({
  isCommentWriter,
  hasAnswerImages: _hasAnswerImages,
  analysisFaceShape,
  analysisBangs,
  analysisHairLength,
  analysisHairCurl,
  recommendedTreatment,
  onClick,
}: ConsultingResponseButtonProps) {
  const { isUserModel } = useAuthContext();
  const STORE_CONSULTING_TEXT = '매장상담이 필요합니다';

  const hidden = !isUserModel && !isCommentWriter;
  const analysisChips = [
    { label: '얼굴형', value: analysisFaceShape },
    { label: '앞머리', value: analysisBangs },
    { label: '기장', value: analysisHairLength },
    { label: '컬', value: analysisHairCurl },
  ].map((chip) => ({
    ...chip,
    analyzed: !!chip.value && chip.value !== STORE_CONSULTING_TEXT,
  }));
  const hasAnyAnalyzed = analysisChips.some((chip) => chip.analyzed);
  const treatmentText = (recommendedTreatment ?? '').trim();

  return (
    <div className="w-full mt-1 rounded-6 overflow-hidden border border-border-default">
      <div className="p-4 bg-alternative">
        <p className="typo-body-2-semibold text-label-info">분석 완료 항목</p>
        <div className="mt-[6px]">
          {hasAnyAnalyzed ? (
            <div className="flex flex-wrap gap-2">
              {analysisChips.map((chip) => (
                <span
                  key={chip.label}
                  className={cn(
                    'w-[68px] text-center rounded-6 px-[10px] py-[5px] typo-body-1-medium',
                    chip.analyzed
                      ? 'bg-focused text-negative-light'
                      : 'bg-white text-label-disable',
                  )}
                >
                  {chip.label}
                </span>
              ))}
            </div>
          ) : (
            <p className="typo-body-2-regular text-label-info">분석된 항목이 없습니다</p>
          )}
        </div>
      </div>
      <div className="p-3 bg-white">
        <p className="typo-body-2-semibold text-label-info">추천시술</p>
        <p className="mt-[6px] typo-body-2-regular text-label-default whitespace-nowrap overflow-hidden text-ellipsis">
          {treatmentText || '-'}
        </p>
        <button
          type="button"
          className={cn(
            'mt-4 w-full px-4 py-2 rounded-4 typo-body-2-medium',
            hidden
              ? 'bg-label-disable text-white cursor-not-allowed'
              : 'bg-label-default text-white',
          )}
          onClick={onClick}
          disabled={hidden}
        >
          컨설팅 결과 보러가기
        </button>
      </div>
    </div>
  );
}

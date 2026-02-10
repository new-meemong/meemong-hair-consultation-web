type ConsultingResponseSidebarEtcTabViewProps = {
  title: string;
  content: string | null | undefined;
  preferredCostText: string;
  desiredDateText: string;
  hairConcernText: string;
  hairTexture: string | null | undefined;
  skinBrightness: string | null | undefined;
  personalColorChip: {
    text: string;
    backgroundColor?: string;
  } | null;
  hairLength: string | null | undefined;
  hairLengthDescription: string;
};

export default function ConsultingResponseSidebarEtcTabView({
  title,
  content,
  preferredCostText,
  desiredDateText,
  hairConcernText,
  hairTexture,
  skinBrightness,
  personalColorChip,
  hairLength,
  hairLengthDescription,
}: ConsultingResponseSidebarEtcTabViewProps) {
  const contentText = content?.trim() ? content : '-';
  const hairConcern = hairConcernText || '-';
  const hasSkinInfo = !!skinBrightness || !!personalColorChip;

  return (
    <div className="flex flex-col">
      <p className="typo-title-3-semibold text-label-default">{title || '-'}</p>
      <p className="mt-3 typo-body-1-long-regular text-label-default whitespace-pre-wrap">
        {contentText}
      </p>

      <div className="mt-7 flex items-center justify-between gap-3">
        <p className="typo-body-1-semibold text-label-default">희망가격</p>
        <p className="typo-body-2-long-regular text-label-default">{preferredCostText}</p>
      </div>
      <div className="mt-7 flex items-center justify-between gap-3">
        <p className="typo-body-1-semibold text-label-default">시술일</p>
        <p className="typo-body-2-long-regular text-label-default">{desiredDateText}</p>
      </div>

      <div className="mt-7 flex flex-col gap-2">
        <p className="typo-body-1-semibold text-label-default">헤어 고민</p>
        <p className="typo-body-2-long-regular text-label-default">{hairConcern}</p>
      </div>

      <div className="mt-7 flex items-start">
        <p className="typo-body-1-semibold text-label-default shrink-0">모질</p>
        <p className="ml-3 typo-body-2-long-regular text-label-default">{hairTexture ?? '-'}</p>
      </div>

      <div className="mt-7 flex items-center">
        <p className="typo-body-1-semibold text-label-default shrink-0">피부</p>
        <div className="ml-3 flex flex-wrap gap-2">
          {hasSkinInfo ? (
            <>
              {skinBrightness && (
                <span className="px-3 py-1 rounded-full bg-alternative typo-body-2-regular text-label-default">
                  {skinBrightness}
                </span>
              )}
              {personalColorChip && (
                <span
                  style={
                    personalColorChip.backgroundColor
                      ? { backgroundColor: personalColorChip.backgroundColor }
                      : undefined
                  }
                  className={`px-3 py-1 rounded-full bg-alternative ${
                    personalColorChip.backgroundColor
                      ? 'text-white typo-body-2-semibold'
                      : 'text-label-default typo-body-2-regular'
                  }`}
                >
                  {personalColorChip.text}
                </span>
              )}
            </>
          ) : (
            <p className="typo-body-2-long-regular text-label-default">-</p>
          )}
        </div>
      </div>

      <div className="mt-7 flex items-start">
        <p className="typo-body-1-semibold text-label-default shrink-0">기장</p>
        <div className="ml-3 flex flex-col">
          <p className="typo-body-1-medium text-label-default">{hairLength ?? '-'}</p>
          {hairLengthDescription ? (
            <p className="typo-body-2-long-regular text-label-default">{hairLengthDescription}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

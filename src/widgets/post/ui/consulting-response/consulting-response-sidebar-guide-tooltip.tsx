import TooltipIcon from '@/assets/icons/tooltip.svg';

function ConsultingResponseSidebarGuideTooltip() {
  return (
    <div className="flex flex-col items-end relative">
      <div className="bg-alternative px-3 py-2 rounded-4 shadow-strong">
        <p className="typo-body-2-regular text-label-sub">
          고객님이 올린 글을 간편하게 확인할 수 있어요!
        </p>
      </div>
      <div className="mr-5 absolute -bottom-2 right-0">
        <TooltipIcon className="w-3.5 h-3 fill-alternative" />
      </div>
    </div>
  );
}

export default ConsultingResponseSidebarGuideTooltip;

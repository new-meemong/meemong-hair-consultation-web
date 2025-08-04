import { MULTI_STEP_FORM_PORTAL_ID } from '@/shared/ui/multi-step-form';
import { createPortal } from 'react-dom';
import CloseIcon from '@/assets/icons/close.svg';

type ConsultingResponseSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ConsultingResponseSidebar({
  isOpen,
  onClose,
}: ConsultingResponseSidebarProps) {
  return createPortal(
    <div className={`absolute inset-0 z-50 ${!isOpen ? 'pointer-events-none' : ''}`}>
      <div
        className={`absolute inset-0 bg-dimmer transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`
          absolute right-0 top-0 h-full w-72
          bg-white transform transition-all duration-500 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <button type="button" className="fixed top-5 right-5" onClick={onClose}>
          <CloseIcon className="size-7" />
        </button>
        {/* 사이드바 내용 */}
      </div>
    </div>,
    document.getElementById(MULTI_STEP_FORM_PORTAL_ID) || document.body,
  );
}

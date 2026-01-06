import { useAuthContext } from '@/features/auth/context/auth-context';

export default function PromotionBanner() {
  const { isUserDesigner, isUserModel } = useAuthContext();

  const text = isUserDesigner
    ? '홍보비 0원으로 매출 상승, 상담이 곧 예약이 되는 마법'
    : isUserModel
      ? '실패 없는 변신, 나만의 디자이너 찾고 예약까지'
      : '';

  if (!text) return null;

  return (
    <div className="flex w-full px-2 py-2 justify-center items-center gap-2.5 bg-[#FF9142]">
      <p className="text-white text-center typo-body-2-semibold">{text}</p>
    </div>
  );
}

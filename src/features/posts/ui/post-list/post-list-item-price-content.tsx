import { CONSULT_TYPE } from '@/entities/posts/constants/consult-type';
import type { ValueOf } from '@/shared/type/types';

import { EXPERIENCE_GROUP_PRICE_TYPE } from '../../constants/experience-group-price-type';

type Price = number | null;

type PostListItemDesignerContentProps = {
  content: string;
  price: Price;
  type: typeof CONSULT_TYPE.CONSULTING | ValueOf<typeof EXPERIENCE_GROUP_PRICE_TYPE>;
};

const TEXT_STYLE = {
  sub: 'typo-body-2-regular text-label-info',
  price: 'typo-headline-semibold text-label-default',
} as const;

const PRICE_TEXT = {
  [CONSULT_TYPE.CONSULTING]: (price: Price) => (
    <>
      {price && (
        <>
          <span className={TEXT_STYLE.sub}>예상 시술비</span>
          <div className="flex items-center gap-0.5">
            <span className={TEXT_STYLE.price}>{price.toLocaleString()}</span>
            <span className={TEXT_STYLE.sub}>원</span>
          </div>
        </>
      )}
    </>
  ),
  [EXPERIENCE_GROUP_PRICE_TYPE.PAY]: (price: Price) => (
    <>
      {price && (
        <>
          <span className={TEXT_STYLE.sub}>협찬비 </span>
          <div className="flex items-center gap-0.5">
            <span className={TEXT_STYLE.price}>{price.toLocaleString()}</span>
            <span className={TEXT_STYLE.sub}>원 발생</span>
          </div>
        </>
      )}
    </>
  ),
  [EXPERIENCE_GROUP_PRICE_TYPE.FREE]: () => (
    <>
      <span className={TEXT_STYLE.sub}>협찬비 </span>
      <span className={TEXT_STYLE.price}>무료시술</span>
    </>
  ),
  [EXPERIENCE_GROUP_PRICE_TYPE.MATERIAL_COST]: (price: Price) => (
    <>
      {price && (
        <>
          <span className={TEXT_STYLE.sub}>재료비 </span>
          <div className="flex items-center gap-0.5">
            <span className={TEXT_STYLE.price}>{price.toLocaleString()}</span>
            <span className={TEXT_STYLE.sub}>원 지급</span>
          </div>
        </>
      )}
    </>
  ),
};

export default function PostListItemPriceContent({
  content,
  price,
  type,
}: PostListItemDesignerContentProps) {
  return (
    <div className="flex flex-col gap-1.5 flex-1">
      <p className="text-base font-medium text-[#000] overflow-hidden text-ellipsis line-clamp-1">
        {content}
      </p>
      <div className="flex gap-1 items-center">{PRICE_TEXT[type](price)}</div>
    </div>
  );
}

import ConsultingInputResultListItem from '../../consulting-input-result-list-item';
import ConsultingResponseItem from '../consulting-response-item';

type ConsultingResponsePriceProps = {
  designerName: string;
};

export default function ConsultingResponsePrice({ designerName }: ConsultingResponsePriceProps) {
  const prices = [
    {
      name: '레이어드 컷',
      minPrice: 100000,
      maxPrice: 200000,
    },
    {
      name: '염색',
      minPrice: 100000,
      maxPrice: 200000,
    },
  ];

  return (
    <ConsultingResponseItem
      title="시술 가격 견적"
      content={`${designerName} 디자이너님께 시술 받으면 이 정도 견적으로 예상할 수 있어요`}
    >
      <div className="flex flex-col gap-4">
        {prices.map((price, index) => (
          <ConsultingInputResultListItem
            key={`${price.name}-${price.minPrice}-${price.maxPrice}-${index}`}
            name={price.name}
            description={`${price.minPrice.toLocaleString()}원~${price.maxPrice.toLocaleString()}원`}
          />
        ))}
      </div>
    </ConsultingResponseItem>
  );
}

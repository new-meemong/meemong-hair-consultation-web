import { Input } from '@/shared';
import FormItemWithLabel from '@/shared/ui/form-item-with-label';
import useYearMonthPicker from '@/shared/ui/hooks/use-year-month-picker';
import { format } from 'date-fns';
import { useFormContext, useWatch } from 'react-hook-form';
import { CONSULTING_POST_FORM_FIELD_NAME } from './consulting-post-form';
import { cn } from '@/lib/utils';

export default function ConsultingPostFormOperationForm() {
  const { register, control, setValue } = useFormContext();

  const selectedDate = useWatch({
    control,
    name: `${CONSULTING_POST_FORM_FIELD_NAME.option2}.date`,
  });

  const { showYearMonthPicker } = useYearMonthPicker();

  const handleDateClick = () => {
    const now = new Date();
    const minDate = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
    const maxDate = now;

    showYearMonthPicker({
      title: '시술 연월',
      minDate,
      maxDate,
      selectedDate: selectedDate ?? new Date(),
      onSelect: (date) => {
        setValue(`${CONSULTING_POST_FORM_FIELD_NAME.option2}.date`, date);
      },
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <FormItemWithLabel hasUnderline label="시술명">
        <Input
          {...register(`${CONSULTING_POST_FORM_FIELD_NAME.option2}.name`)}
          placeholder="예)전체탈색, 블랙염색 등"
          className="typo-body-2-regular h-9"
        />
      </FormItemWithLabel>
      <FormItemWithLabel hasUnderline label="시술시점">
        <div
          onClick={handleDateClick}
          className="flex items-center justify-between cursor-pointer h-9"
        >
          <span
            className={cn(
              'typo-body-2-regular',
              selectedDate ? 'text-label-default' : 'text-label-placeholder',
            )}
          >
            {selectedDate
              ? format(selectedDate, 'yyyy/MM')
              : '해당 시술을 한 시점을 대략적으로 선택해주세요'}
          </span>
        </div>
      </FormItemWithLabel>
    </div>
  );
}

import { Button, Input } from '@/shared';
import FormItemWithLabel from '@/shared/ui/form-item-with-label';
import useYearMonthPicker from '@/shared/ui/hooks/use-year-month-picker';
import { format } from 'date-fns';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { CONSULTING_POST_FORM_FIELD_NAME } from '../constants/consulting-post-form-field-name';

export default function ConsultingPostFormOperationForm() {
  const { setValue, getValues } = useFormContext();

  const [name, setName] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  const { showYearMonthPicker } = useYearMonthPicker();

  const handleDateClick = () => {
    const now = new Date();
    const minDate = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
    const maxDate = now;

    showYearMonthPicker({
      title: '시술 연월',
      minDate,
      maxDate,
      selectedDate: date ?? new Date(),
      onSelect: (date) => {
        setDate(date);
      },
    });
  };

  const handleSubmit = () => {
    const currentOperations = getValues(CONSULTING_POST_FORM_FIELD_NAME.option2) || [];
    setValue(CONSULTING_POST_FORM_FIELD_NAME.option2, [
      ...currentOperations,
      {
        name,
        date,
      },
    ]);

    setName('');
    setDate(undefined);
  };

  return (
    <div className="flex flex-col gap-5">
      <FormItemWithLabel hasUnderline label="시술명">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
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
              date ? 'text-label-default' : 'text-label-placeholder',
            )}
          >
            {date ? format(date, 'yyyy/MM') : '해당 시술을 한 시점을 대략적으로 선택해주세요'}
          </span>
        </div>
      </FormItemWithLabel>
      <Button theme="white" onClick={handleSubmit}>
        시술 입력
      </Button>
    </div>
  );
}

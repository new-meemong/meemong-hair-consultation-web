import { Button, Checkbox, Input, Label } from '@/shared';
import FormItem from '@/shared/ui/form-item';
import useYearMonthPicker from '@/shared/ui/hooks/use-year-month-picker';
import { format } from 'date-fns';
import { useFormContext, useWatch } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { CONSULTING_POST_FORM_FIELD_NAME } from '../../constants/consulting-post-form-field-name';
import useShowDeleteAllOperations from '../../hooks/use-show-delete-all-operations';
import { type ConsultingPostFormValues } from '../../types/consulting-post-form-values';

export default function ConsultingPostFormOperationForm() {
  const { setValue, getValues, control } = useFormContext<ConsultingPostFormValues>();

  const optionValue = useWatch({
    control,
    name: CONSULTING_POST_FORM_FIELD_NAME.option2,
  });

  const [name, setName] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [noOperation, setNoOperation] = useState(optionValue === null);

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
    if (!date) return;

    const currentOperations = getValues(CONSULTING_POST_FORM_FIELD_NAME.option2) ?? [];

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

  const setNoOperations = () => {
    setValue(CONSULTING_POST_FORM_FIELD_NAME.option2, null, {
      shouldDirty: true,
    });
    setName('');
    setDate(undefined);
  };

  const resetOperations = () => {
    setValue(CONSULTING_POST_FORM_FIELD_NAME.option2, [], {
      shouldDirty: true,
    });
    setName('');
    setDate(undefined);
  };

  const showDeleteAllOperations = useShowDeleteAllOperations();

  const handleNoOperationChange = () => {
    setNoOperation((prev) => !prev);
    if (noOperation) {
      resetOperations();
      return;
    }

    showDeleteAllOperations({
      onConfirm: () => {
        setNoOperations();
      },
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <FormItem hasUnderline label="시술명">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예)전체탈색, 블랙염색 등"
          className="typo-body-2-regular h-9"
        />
      </FormItem>
      <FormItem hasUnderline label="시술시점">
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
      </FormItem>
      <Button theme="white" onClick={handleSubmit}>
        시술 저장
      </Button>
      <div className="flex gap-2 items-center justify-end">
        <Label htmlFor="no-operation" className="typo-body-3-regular text-label-sub">
          받은 시술 없음
        </Label>
        <Checkbox
          id="no-operation"
          shape="round"
          checked={noOperation}
          onCheckedChange={handleNoOperationChange}
        />
      </div>
    </div>
  );
}

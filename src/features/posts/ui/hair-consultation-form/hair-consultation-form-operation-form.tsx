import { Button, Input, Label } from '@/shared';
import { useFormContext, useWatch } from 'react-hook-form';

import Checkbox from '@/shared/ui/checkbox';
import FormItem from '@/shared/ui/form-item';
import { HAIR_CONSULTATION_FORM_FIELD_NAME } from '../../constants/hair-consultation-form-field-name';
import type { HairConsultationFormValues } from '../../types/hair-consultation-form-values';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import useShowDeleteAllOperations from '../../hooks/use-show-delete-all-operations';
import { useState } from 'react';
import useYearMonthPicker from '@/shared/ui/hooks/use-year-month-picker';

export default function HairConsultationFormOperationForm() {
  const { setValue, getValues, control } = useFormContext<HairConsultationFormValues>();

  const optionValue = useWatch({
    control,
    name: HAIR_CONSULTATION_FORM_FIELD_NAME.TREATMENTS,
  });

  const [name, setName] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [noOperation, setNoOperation] = useState(optionValue === null);

  const canSubmit = name !== '' && date !== undefined;

  const { showYearMonthPicker } = useYearMonthPicker();

  const handleDateClick = () => {
    const now = new Date();
    const minDate = new Date(now.getFullYear() - 4, now.getMonth(), now.getDate());
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
    if (!date || !name) return;

    const currentOperations = getValues(HAIR_CONSULTATION_FORM_FIELD_NAME.TREATMENTS) ?? [];

    setValue(HAIR_CONSULTATION_FORM_FIELD_NAME.TREATMENTS, [
      ...currentOperations,
      {
        name,
        date,
      },
    ]);

    setName('');
    setDate(undefined);
    setNoOperation(false);
  };

  const setNoOperations = () => {
    setValue(HAIR_CONSULTATION_FORM_FIELD_NAME.TREATMENTS, null, {
      shouldDirty: true,
    });
    setName('');
    setDate(undefined);
  };

  const resetOperations = () => {
    setValue(HAIR_CONSULTATION_FORM_FIELD_NAME.TREATMENTS, [], {
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

    if (!optionValue || optionValue?.length === 0) {
      setNoOperations();
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
          placeholder="예) 블랙 염색"
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
            {date ? format(date, 'yyyy/MM') : '시술 시점을 대략적으로 선택해주세요'}
          </span>
        </div>
      </FormItem>
      <Button theme="white" onClick={handleSubmit} disabled={!canSubmit}>
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
          onChange={handleNoOperationChange}
        />
      </div>
    </div>
  );
}

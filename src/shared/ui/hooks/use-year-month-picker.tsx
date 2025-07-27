import { useOverlayContext } from '@/shared/context/overlay-context';
import { useCallback } from 'react';
import { YearMonthPicker, type YearMonthPickerProps } from '../year-month-picker';

export default function useYearMonthPicker() {
  const { showBottomSheet } = useOverlayContext();

  const showYearMonthPicker = useCallback(
    ({ title, minDate, maxDate, selectedDate, onSelect }: YearMonthPickerProps) => {
      showBottomSheet({
        id: 'year-month-picker',
        children: (
          <YearMonthPicker
            title={title}
            minDate={minDate}
            maxDate={maxDate}
            selectedDate={selectedDate}
            onSelect={onSelect}
          />
        ),
      });
    },
    [showBottomSheet],
  );

  return { showYearMonthPicker };
}

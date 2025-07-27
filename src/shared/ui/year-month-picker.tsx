'use client';

import { DrawerClose, DrawerFooter, DrawerHeader, DrawerTitle } from '@/shared/ui/drawer';
import { Button } from './button';
import ScrollSelector from './scroll-selector';
import { useState } from 'react';

export type YearMonthPickerProps = {
  open?: boolean;
  onClose?: () => void;
  name?: string;
  title?: string;
  initialYear?: number;
  initialMonth?: number;
  minDate: Date;
  maxDate: Date;
  selectedDate: Date;
  onSelect: (date: Date) => void;
};

const getYearOptions = (minDate: Date, maxDate: Date) => {
  return Array.from(
    { length: maxDate.getFullYear() - minDate.getFullYear() + 1 },
    (_, i) => minDate.getFullYear() + i,
  );
};

const getMonthOptions = (selectedYear: number, minDate: Date, maxDate: Date) => {
  if (selectedYear === minDate.getFullYear()) {
    return Array.from({ length: 12 - minDate.getMonth() }, (_, i) => minDate.getMonth() + 1 + i);
  }
  if (selectedYear === maxDate.getFullYear()) {
    return Array.from({ length: maxDate.getMonth() + 1 }, (_, i) => i + 1);
  }
  return Array.from({ length: 12 }, (_, i) => i + 1);
};

export function YearMonthPicker({
  title,
  minDate,
  maxDate,
  selectedDate,
  onSelect,
}: YearMonthPickerProps) {
  const [selectedYear, setSelectedYear] = useState(selectedDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(selectedDate.getMonth() + 1);

  const yearOptions = getYearOptions(minDate, maxDate);
  const monthOptions = getMonthOptions(selectedYear, minDate, maxDate);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
  };

  const handleConfirm = () => {
    onSelect(new Date(selectedYear, selectedMonth - 1));
  };

  return (
    <>
      <DrawerHeader>
        <DrawerTitle showCloseButton>{title}</DrawerTitle>
      </DrawerHeader>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-3">
          <ScrollSelector
            options={yearOptions}
            selectedOption={selectedYear}
            onSelect={handleYearChange}
          />
          <ScrollSelector
            options={monthOptions}
            selectedOption={selectedMonth}
            onSelect={handleMonthChange}
          />
        </div>
      </div>
      <DrawerFooter>
        <DrawerClose asChild>
          <Button onClick={handleConfirm}>확인</Button>
        </DrawerClose>
      </DrawerFooter>
    </>
  );
}

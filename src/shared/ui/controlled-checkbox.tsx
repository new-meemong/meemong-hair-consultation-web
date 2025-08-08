import { Controller, useFormContext } from 'react-hook-form';

import { Checkbox, type CheckboxProps } from './checkbox';

type ControlledCheckboxProps = {
  name: string;
  shape: CheckboxProps['shape'];
};

export default function ControlledCheckbox({ name, shape }: ControlledCheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <Checkbox id={name} checked={value} shape={shape} onCheckedChange={onChange} />
      )}
    />
  );
}

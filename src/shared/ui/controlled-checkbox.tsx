import { Controller, useFormContext } from 'react-hook-form';
import { Checkbox } from './checkbox';

type ControlledCheckboxProps = {
  name: string;
};

export default function ControlledCheckbox({ name }: ControlledCheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <Checkbox id={name} checked={value} onCheckedChange={onChange} />
      )}
    />
  );
}

import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

type Props = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  prefix: string;
};

export default function InputWithPrefix({ value, setValue, prefix }: Props) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(
      value?.startsWith(prefix) ? value.slice(prefix.length) : value
    );
  }, [value, prefix]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.startsWith(prefix)
      ? e.target.value.slice(prefix.length)
      : e.target.value;
    setValue(`${prefix}${newValue}`);
    setDisplayValue(newValue);
  };

  return (
    <div className="flex items-center relative">
      <span className="text-gray-500 absolute text-xs left-2">{prefix}</span>
      <Input
        id="website"
        value={displayValue}
        onChange={handleValueChange}
        className="pl-20 w-72"
      />
    </div>
  );
}

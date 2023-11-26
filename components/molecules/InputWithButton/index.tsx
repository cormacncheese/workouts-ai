import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Props = {
  type: string;
  placeholder: string;
  actionLabel: string;
};

export function InputWithButton({ type, placeholder, actionLabel }: Props) {
  return (
    <div className="flex w-full items-center space-x-2 md:flex-row flex-col gap-2 justify-center">
      <Input type={type} placeholder={placeholder} className="md:w-72 w-full" />
      <Button className="md:w-36 w-full">{actionLabel}</Button>
    </div>
  );
}

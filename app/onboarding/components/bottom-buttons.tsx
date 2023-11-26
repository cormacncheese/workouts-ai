import { Button } from '@/components/ui/button';

type Props = {
  step: number;
  setStep: (step: number) => void;
  handleSubmit: any;
  isLoading: boolean;
  allowSkip?: boolean;
};

export default function BottomButtons({
  step,
  setStep,
  handleSubmit,
  isLoading,
  allowSkip = false
}: Props) {
  const handleSkip = () => {
    setStep(step + 1);
  };

  return (
    <div className="flex flex-row gap-2 justify-between w-full">
      <Button
        variant="outline"
        type="button"
        onClick={() => setStep(step - 1)}
        disabled={step === 0}
      >
        Back
      </Button>
      <div className="flex flex-row gap-2">
        {allowSkip && (
          <Button variant="ghost" onClick={handleSkip}>
            Skip
          </Button>
        )}

        <Button onClick={handleSubmit} loading={isLoading}>
          Next
        </Button>
      </div>
    </div>
  );
}

import Typography from '@/components/molecules/Typography';

type Props = {
  children: React.ReactNode;
};

export default function SubHeaderText({ children }: Props) {
  return (
    <Typography
      size="base"
      fontWeight="normal"
      className="!text-muted mb-2 w-full"
    >
      {children}
    </Typography>
  );
}

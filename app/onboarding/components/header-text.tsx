import Typography from '@/components/molecules/Typography';

type Props = {
  children: React.ReactNode;
};

export default function HeaderText({ children }: Props) {
  return (
    <Typography size="2xl" fontWeight="normal" className="text-muted  w-full">
      {children}
    </Typography>
  );
}

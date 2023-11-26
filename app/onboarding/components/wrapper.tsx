import { motion } from 'framer-motion';

type Props = {
  children: any;
};

export default function OnboardingWrapper({ children }: Props) {
  return (
    <motion.div
      className="flex w-full flex-col max-w-sm gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {children}
    </motion.div>
  );
}

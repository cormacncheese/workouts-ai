import Image from 'next/image';

const Logo = ({ className = '', ...props }) => (
  <Image
    src="https://dcsladfmohmhomyxvhzz.supabase.co/storage/v1/object/public/general/logo/brandbase_icon.png"
    alt="Brandbase Logo"
    width={40}
    height={40}
    className="w-8 h-8"
    {...props}
  />
);

export default Logo;

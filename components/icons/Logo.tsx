import Image from 'next/image';

const Logo = ({ className = '', ...props }) => (
  <Image
    src="https://dorrdxizajloclrfhcth.supabase.co/storage/v1/object/public/web/logo/aiworkouts.svg"
    alt="Workouts AI Logo"
    width={40}
    height={40}
    className="w-8 h-8"
    {...props}
  />
);

export default Logo;

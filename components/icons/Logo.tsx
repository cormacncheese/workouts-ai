import Image from 'next/image';

const logo =
  'https://dorrdxizajloclrfhcth.supabase.co/storage/v1/object/public/web/logo/aiworkouts.svg';

const logoWithText =
  'https://dorrdxizajloclrfhcth.supabase.co/storage/v1/object/public/web/logo/ai%20workouts%20color.png';

const Logo = ({ className = '', ...props }) => (
  <>
    {/* <Image
      src={logo}
      alt="Workouts AI Logo"
      width={40}
      height={40}
      className="w-8 h-8 md:hidden block"
      {...props}
    /> */}

    <Image
      src={logoWithText}
      alt="Workouts AI Logo"
      width={400}
      height={40}
      className="w-40 h-8 "
      {...props}
    />
  </>
);

export default Logo;

import { getSession } from '@/app/supabase-server';
import AuthUI from './AuthUI';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUserData } from '@/app/actions/user';

export default async function SignIn() {
  const session = await getSession();

  let showToast = false;
  let toastMessage = '';

  if (session) {
    const userData = await getCurrentUserData();

    console.log('userData: ', userData);

    if (userData && userData.has_onboarded) {
      return redirect('/dashboard/trainer');
    } else if (userData) {
      return redirect('/onboarding');
    }
  }

  const IMAGES = [
    'https://dorrdxizajloclrfhcth.supabase.co/storage/v1/object/sign/web/auth/workout-stock-vert-1.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWIvYXV0aC93b3Jrb3V0LXN0b2NrLXZlcnQtMS5qcGciLCJpYXQiOjE3MDEwMjA4OTYsImV4cCI6MjAxNjM4MDg5Nn0.BEm_K5YDqozvcXouTs2tG-BpgY1VVnuEtdMHC65yS0Y',
    'https://dorrdxizajloclrfhcth.supabase.co/storage/v1/object/sign/web/auth/workout-stock-vert-2.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWIvYXV0aC93b3Jrb3V0LXN0b2NrLXZlcnQtMi5qcGciLCJpYXQiOjE3MDEwMjA5NTgsImV4cCI6MjAxNjM4MDk1OH0.IjzIg-eNZTzIarKhnsDGG1YiqQqZ3Gqf5vmDgM64V6Q',
    'https://dorrdxizajloclrfhcth.supabase.co/storage/v1/object/public/web/auth/workout-stock-vert-3.jpg?t=2023-11-26T17%3A50%3A46.528Z',
    'https://dorrdxizajloclrfhcth.supabase.co/storage/v1/object/public/web/auth/workout-stock-vert-4.jpg?t=2023-11-26T17%3A50%3A53.487Z',
    'https://dorrdxizajloclrfhcth.supabase.co/storage/v1/object/public/web/auth/workout-stock-vert-5.jpg?t=2023-11-26T17%3A51%3A12.334Z'
  ];

  const randomImage = IMAGES[Math.floor(Math.random() * IMAGES.length)];

  return (
    <>
      <div className="container relative h-full flex-col items-center justify-center md:grid lg:max-w-none md:grid-cols-2 md:px-0">
        <div
          className="hidden md:flex h-full flex-col justify-end bg-muted p-10 text-white dark:border-r lg:flex"
          style={{
            backgroundImage: `url(${randomImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} // Apply the random image as a background
        ></div>
        <div className="lg:p-8 flex">
          <div className="mx-auto flex w-full flex-col justify-center md:mt-14 mt-16 space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Level up your workouts 🔥
              </h1>
              <p className="text-sm text-muted-foreground">
                Login in or create an account to get started generating your
                personalized science-based workouts.
              </p>
            </div>

            <AuthUI showToast={showToast} toastMessage={toastMessage} />
            {/* <UserAuthForm /> */}
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{' '}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

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

    if (userData && userData.has_onboarded) {
      return redirect('/dashboard/assistant');
    } else {
      return redirect('/onboarding');
    }
  }

  return (
    <>
      <div className="container relative h-full flex-col items-center justify-center md:grid lg:max-w-none md:grid-cols-2 md:px-0">
        <div className="hidden md:flex h-full flex-col justify-end bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="flex" />
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                “A common critique of technology is that it removes choice from
                our lives as machines make decisions for us. This is undoubtedly
                true, yet more than offset by the freedom to create our lives
                that flows from the material abundance created by our use of
                machines.”
              </p>
              <footer className="text-sm">Marc Andreeson</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8 flex">
          <div className="mx-auto flex w-full flex-col justify-center md:mt-14 mt-16 space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to create your account
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

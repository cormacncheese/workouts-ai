import SupabaseProvider from './supabase-provider';
import { PropsWithChildren } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@vercel/analytics/react';
import { CSPostHogProvider } from './providers';

export const dynamic = 'force-dynamic';

import 'styles/global.css';

const meta = {
  title: 'Workouts AI',
  description: 'Generate your own workout plan with AI.',
  cardImage:
    'https://dcsladfmohmhomyxvhzz.supabase.co/storage/v1/object/public/general/website/open_graph.png',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  url: 'https://maita.to',
  type: 'website'
};

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'https://aiworkouts.co'
  ),
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: meta.url,
    siteName: meta.title,
    images: [
      {
        url: meta.cardImage,
        width: 800,
        height: 600
      },
      {
        url: meta.cardImage,
        width: 1800,
        height: 1600,
        alt: 'generate your AI workout plan'
      }
    ],
    // twitter: {
    //   card: 'summary_large_image',
    //   title: meta.title,
    //   description: meta.description,
    //   creator: '@tellmaia_to',
    //   images: [meta.cardImage]
    // },
    locale: 'en_US',
    type: 'website'
  }
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children
}: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link
        rel="icon"
        href="/icon?<generated>"
        type="image/<generated>"
        sizes="<generated>"
      />
      <link
        rel="apple-touch-icon"
        href="/apple-icon?<generated>"
        type="image/<generated>"
        sizes="<generated>"
      />

      <CSPostHogProvider>
        <body className="loading ">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SupabaseProvider>
              <main
                id="skip"
                className="h-[calc(100dvh)] h-screen-helper !dark:bg-black"
              >
                {children}
              </main>
              <Toaster />
            </SupabaseProvider>
            <Analytics />
          </ThemeProvider>
        </body>
      </CSPostHogProvider>
    </html>
  );
}

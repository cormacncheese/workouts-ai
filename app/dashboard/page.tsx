'use client';

import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  router.push('/dashboard/assistant');
  return <section className="mb-32 bg-black "></section>;
}

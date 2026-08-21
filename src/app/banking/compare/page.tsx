'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CompareRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/banking');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-white">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-semibold text-zinc-400">Loading NAYAN Banking...</p>
    </div>
  );
}

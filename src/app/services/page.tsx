'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ServicesIndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-civic-blue border-t-transparent rounded-full animate-spin" />
      <p className="text-acc-sm font-semibold text-[var(--text-secondary)]">
        Loading Services Catalog...
      </p>
    </div>
  );
}

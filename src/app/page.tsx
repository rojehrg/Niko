'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Show the message for 3 seconds before redirecting
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-center">
        <div className="text-4xl font-bold text-[var(--foreground)] mb-4">
          LETS GET THESE GRADES!!!!!
        </div>
        <div className="text-[var(--foreground-secondary)]">
          Made by Mr.Slime himself, to Nikho
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect directly to dashboard for Niko
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-center">
        <div className="text-4xl font-bold text-[var(--foreground)] mb-4">
          🚀 Redirecting to StudyBuddy...
        </div>
        <div className="text-[var(--foreground-secondary)]">
          Taking you to your personal learning hub
        </div>
      </div>
    </div>
  );
}

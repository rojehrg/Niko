"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/auth-context';

export function SidebarUsername() {
  const { userProfile } = useAuth();
  const [username, setUsername] = useState('StudyBuddy');

  useEffect(() => {
    if (userProfile?.name) {
      setUsername(userProfile.name);
    }
  }, [userProfile]);

  return (
    <h1 className="text-lg font-semibold text-[var(--foreground)]">
      {username}
    </h1>
  );
}

"use client";

import { useState, useEffect } from 'react';

export function SidebarUsername() {
  const [username, setUsername] = useState('StudyBuddy');

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        if (parsed.name) {
          setUsername(parsed.name);
        }
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, []);

  return (
    <h1 className="text-lg font-semibold text-[var(--foreground)]">
      {username}
    </h1>
  );
}

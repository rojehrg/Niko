'use client'

import { Music } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MusicToggleProps {
  onClick: () => void
}

export default function MusicToggle({ onClick }: MusicToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="w-10 h-10 rounded-lg hover:bg-[var(--hover)] transition-colors"
      title="Music Player"
    >
      <Music className="h-5 w-5 text-[var(--foreground)]" />
    </Button>
  )
}

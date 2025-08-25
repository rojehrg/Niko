"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Pin, 
  Calendar, 
  Edit, 
  Trash2, 
  Clock,
  Tag,
  Check
} from "lucide-react";
import { Note } from "@/lib/stores/notes-store";
import { formatDistanceToNow } from "date-fns";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  isMultiSelectMode?: boolean;
  isSelected?: boolean;
  onToggleSelection?: (id: string) => void;
}

export function NoteCard({ 
  note, 
  onEdit, 
  onDelete, 
  isMultiSelectMode = false, 
  isSelected = false, 
  onToggleSelection 
}: NoteCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getColorClasses = (color: string) => {
    // Enhanced color mapping with proper names
    const colorMap: Record<string, { bg: string; border: string; accent: string; name: string }> = {
      'purple': { 
        bg: 'bg-purple-50 dark:bg-purple-900/20', 
        border: 'border-purple-200 dark:border-purple-700/50',
        accent: 'bg-purple-500',
        name: 'Purple'
      },
      'emerald': { 
        bg: 'bg-emerald-50 dark:bg-emerald-900/20', 
        border: 'border-emerald-200 dark:border-emerald-700/50',
        accent: 'bg-emerald-500',
        name: 'Emerald'
      },
      'orange': { 
        bg: 'bg-orange-50 dark:bg-orange-900/20', 
        border: 'border-orange-200 dark:border-orange-700/50',
        accent: 'bg-orange-500',
        name: 'Orange'
      },
      'blue': { 
        bg: 'bg-blue-50 dark:bg-blue-900/20', 
        border: 'border-blue-200 dark:border-blue-700/50',
        accent: 'bg-blue-500',
        name: 'Blue'
      },
      'pink': { 
        bg: 'bg-pink-50 dark:bg-pink-900/20', 
        border: 'border-pink-200 dark:border-pink-700/50',
        accent: 'bg-pink-500',
        name: 'Pink'
      },
      'red': { 
        bg: 'bg-red-50 dark:bg-red-900/20', 
        border: 'border-red-200 dark:border-red-700/50',
        accent: 'bg-red-500',
        name: 'Red'
      },
      'violet': { 
        bg: 'bg-violet-50 dark:bg-violet-900/20', 
        border: 'border-violet-200 dark:border-violet-700/50',
        accent: 'bg-violet-500',
        name: 'Violet'
      },
      'teal': { 
        bg: 'bg-teal-50 dark:bg-teal-900/20', 
        border: 'border-teal-200 dark:border-teal-700/50',
        accent: 'bg-teal-500',
        name: 'Teal'
      },
      'yellow': { 
        bg: 'bg-yellow-50 dark:bg-yellow-900/20', 
        border: 'border-yellow-200 dark:border-yellow-700/50',
        accent: 'bg-yellow-500',
        name: 'Yellow'
      },
      'indigo': { 
        bg: 'bg-indigo-50 dark:bg-indigo-900/20', 
        border: 'border-indigo-200 dark:border-indigo-700/50',
        accent: 'bg-indigo-500',
        name: 'Indigo'
      },
      'cyan': { 
        bg: 'bg-cyan-50 dark:bg-cyan-900/20', 
        border: 'border-cyan-200 dark:border-cyan-700/50',
        accent: 'bg-cyan-500',
        name: 'Cyan'
      },
      'lime': { 
        bg: 'bg-lime-50 dark:bg-lime-900/20', 
        border: 'border-lime-200 dark:border-lime-700/50',
        accent: 'bg-lime-500',
        name: 'Lime'
      },
      'amber': { 
        bg: 'bg-amber-50 dark:bg-amber-900/20', 
        border: 'border-amber-200 dark:border-amber-700/50',
        accent: 'bg-amber-500',
        name: 'Amber'
      },
      'rose': { 
        bg: 'bg-rose-50 dark:bg-rose-900/20', 
        border: 'border-rose-200 dark:border-rose-700/50',
        accent: 'bg-rose-500',
        name: 'Rose'
      },
      'slate': { 
        bg: 'bg-slate-50 dark:bg-slate-900/20', 
        border: 'border-slate-200 dark:border-slate-700/50',
        accent: 'bg-slate-500',
        name: 'Slate'
      },
      'gray': { 
        bg: 'bg-gray-50 dark:bg-gray-900/20', 
        border: 'border-gray-200 dark:border-gray-700/50',
        accent: 'bg-gray-500',
        name: 'Gray'
      },
      'zinc': { 
        bg: 'bg-zinc-50 dark:bg-zinc-900/20', 
        border: 'border-zinc-200 dark:border-zinc-700/50',
        accent: 'bg-zinc-500',
        name: 'Zinc'
      },
      'neutral': { 
        bg: 'bg-neutral-50 dark:bg-neutral-900/20', 
        border: 'border-neutral-200 dark:border-neutral-700/50',
        accent: 'bg-neutral-500',
        name: 'Neutral'
      },
      'stone': { 
        bg: 'bg-stone-50 dark:bg-stone-900/20', 
        border: 'border-stone-200 dark:border-stone-700/50',
        accent: 'bg-stone-500',
        name: 'Stone'
      }
    };

    // Try to find the color in our map
    for (const [colorName, colorData] of Object.entries(colorMap)) {
      if (color.toLowerCase().includes(colorName.toLowerCase())) {
        return colorData;
      }
    }
    
    // Default fallback
    return { 
      bg: 'bg-[var(--background)]', 
      border: 'border-[var(--border)]',
      accent: 'bg-gray-500',
      name: 'Default'
    };
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
      }
      return formatDistanceToNow(dateObj, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const colorClasses = getColorClasses(note.color);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Pin indicator */}
      {note.isPinned && (
        <div className="absolute -top-2 -right-2 z-20">
          <div className="bg-yellow-500 text-white p-1.5 rounded-full shadow-md">
            <Pin className="h-3 w-3" />
          </div>
        </div>
      )}

      <Card 
        className={`
          relative overflow-hidden transition-all duration-300 cursor-pointer
          ${colorClasses.bg} ${colorClasses.border}
          hover:border-[var(--border-hover)] hover:shadow-lg
          ${isHovered ? 'scale-[1.02]' : 'shadow-sm'}
        `}
        onClick={() => onEdit(note)}
      >
        {/* Color accent bar */}
        <div className={`h-1 w-full ${colorClasses.accent}`} />

        {/* Action buttons - only visible on hover */}
        {isHovered && (
          <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(note);
              }}
              className="h-8 w-8 p-0 bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black border border-gray-200 dark:border-gray-700 hover:scale-110 transition-all duration-200"
            >
              <Edit className="h-3 w-3 text-gray-600 dark:text-gray-400" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              className="h-8 w-8 p-0 bg-white/80 dark:bg-black/80 hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 hover:scale-110 transition-all duration-200"
            >
              <Trash2 className="h-3 w-3 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400" />
            </Button>
          </div>
        )}

        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold line-clamp-2 text-[var(--foreground)] leading-tight pr-16">
            {note.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Content preview */}
          <div className="relative">
            <p className="text-sm text-[var(--foreground-secondary)] line-clamp-3 leading-relaxed">
              {truncateContent(note.content)}
            </p>
          </div>

          {/* Tags */}
          {note.tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {note.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 bg-[var(--hover)] rounded-md text-xs font-medium text-[var(--foreground-tertiary)] border border-[var(--border)]"
                >
                  <Tag className="h-2.5 w-2.5 mr-1" />
                  {tag}
                </span>
              ))}
              {note.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 bg-[var(--hover)] rounded-md text-xs font-medium text-[var(--foreground-tertiary)] border border-[var(--border)]">
                  +{note.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Metadata footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
            <div className="flex items-center gap-1.5 text-xs text-[var(--foreground-tertiary)]">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(note.createdAt)}</span>
            </div>
            
            {note.updatedAt > note.createdAt && (
              <div className="flex items-center gap-1.5 text-xs text-[var(--foreground-tertiary)]">
                <Clock className="h-3 w-3" />
                <span>Edited {formatDate(note.updatedAt)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
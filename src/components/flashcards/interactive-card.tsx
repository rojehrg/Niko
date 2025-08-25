"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, RotateCcw, Heart, BookOpen } from "lucide-react";
import { Flashcard, useFlashcardStore } from "@/lib/stores/flashcard-store";

interface InteractiveCardProps {
  card: Flashcard;
  onDelete: (id: string) => void;
  onMarkFavorite?: (id: string) => void;
}

export function InteractiveCard({ card, onDelete, onMarkFavorite }: InteractiveCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const { getSet } = useFlashcardStore();
  const cardSet = getSet(card.setId);

  return (
    <motion.div
      className="relative w-full h-48 [perspective:1000px]"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front Side */}
        <Card className="absolute inset-0 w-full h-full bg-gradient-to-br from-[var(--background)] to-[var(--background-secondary)] border-[var(--border)] shadow-md hover:shadow-lg transition-all duration-200 [backface-visibility:hidden]">
          <CardContent className="flex flex-col justify-between h-full p-6">
            {/* Set Badge */}
            {cardSet && (
              <div className="absolute top-3 left-3">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${cardSet.color}`}>
                  <BookOpen className="h-3 w-3" />
                  {cardSet.name}
                </div>
              </div>
            )}
            
            <div className="flex-1 flex items-center justify-center mt-8">
              <p className="text-lg font-medium text-[var(--foreground)] text-center leading-relaxed">
                {card.front}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[var(--foreground-tertiary)]">
                <RotateCcw className="h-3 w-3" />
                <span>Click to flip</span>
              </div>
              
              <motion.div
                className="flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkFavorite?.(card.id);
                  }}
                  className="h-7 w-7 p-0 text-[var(--foreground-tertiary)] hover:text-red-500 hover:bg-[var(--hover)] transition-all"
                >
                  <Heart className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(card.id);
                  }}
                  className="h-7 w-7 p-0 text-[var(--foreground-tertiary)] hover:text-red-600 hover:bg-[var(--hover)] transition-all"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>

        {/* Back Side */}
        <Card className="absolute inset-0 w-full h-full bg-gradient-to-br from-[var(--accent-blue)]/5 to-[var(--accent-purple)]/5 border-[var(--border)] shadow-md hover:shadow-lg transition-all duration-200 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <CardContent className="flex flex-col justify-between h-full p-6">
            {/* Set Badge */}
            {cardSet && (
              <div className="absolute top-3 left-3">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${cardSet.color}`}>
                  <BookOpen className="h-3 w-3" />
                  {cardSet.name}
                </div>
              </div>
            )}
            
            <div className="flex-1 flex items-center justify-center mt-8">
              <p className="text-base text-[var(--foreground-secondary)] text-center leading-relaxed">
                {card.back}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[var(--foreground-tertiary)]">
                <RotateCcw className="h-3 w-3" />
                <span>Click to flip back</span>
              </div>
              
              <span className="text-xs text-[var(--foreground-tertiary)]">
                {card.createdAt instanceof Date ? card.createdAt.toLocaleDateString() : 'Invalid date'}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Floating indicators */}
      <motion.div
        className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--primary)] rounded-full flex items-center justify-center shadow-lg"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: isFlipped ? 1 : 0, 
          opacity: isFlipped ? 1 : 0 
        }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          ✨
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

import { create } from 'zustand';

export interface FlashcardSet {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: Date;
  cardCount: number;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  setId: string;
  createdAt: Date;
  lastStudied?: Date;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface FlashcardStore {
  flashcards: Flashcard[];
  sets: FlashcardSet[];
  addFlashcard: (front: string, back: string, setId: string) => void;
  removeFlashcard: (id: string) => void;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
  getFlashcard: (id: string) => Flashcard | undefined;
  addSet: (name: string, description?: string, color?: string) => void;
  removeSet: (id: string) => void;
  updateSet: (id: string, updates: Partial<FlashcardSet>) => void;
  getSet: (id: string) => FlashcardSet | undefined;
  getFlashcardsBySet: (setId: string) => Flashcard[];
  getDefaultSet: () => FlashcardSet;
}

const DEFAULT_COLORS = [
  'bg-blue-500',
  'bg-purple-500', 
  'bg-green-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-red-500'
];

export const useFlashcardStore = create<FlashcardStore>((set, get) => ({
  flashcards: [],
  sets: [
    {
      id: 'default',
      name: 'General',
      description: 'Default flashcard set',
      color: 'bg-blue-500',
      createdAt: new Date(),
      cardCount: 0
    }
  ],
  
  addFlashcard: (front: string, back: string, setId: string) => {
    const newFlashcard: Flashcard = {
      id: Date.now().toString(),
      front,
      back,
      setId,
      createdAt: new Date(),
      difficulty: 'medium',
    };
    
    set((state) => {
      const updatedSets = state.sets.map(set => 
        set.id === setId 
          ? { ...set, cardCount: set.cardCount + 1 }
          : set
      );
      
      return {
        flashcards: [...state.flashcards, newFlashcard],
        sets: updatedSets
      };
    });
  },
  
  removeFlashcard: (id: string) => {
    set((state) => {
      const flashcard = state.flashcards.find(card => card.id === id);
      const updatedSets = flashcard 
        ? state.sets.map(set => 
            set.id === flashcard.setId 
              ? { ...set, cardCount: Math.max(0, set.cardCount - 1) }
              : set
          )
        : state.sets;
      
      return {
        flashcards: state.flashcards.filter((card) => card.id !== id),
        sets: updatedSets
      };
    });
  },
  
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => {
    set((state) => ({
      flashcards: state.flashcards.map((card) =>
        card.id === id ? { ...card, ...updates } : card
      ),
    }));
  },
  
  getFlashcard: (id: string) => {
    return get().flashcards.find((card) => card.id === id);
  },

  addSet: (name: string, description?: string, color?: string) => {
    const newSet: FlashcardSet = {
      id: Date.now().toString(),
      name,
      description,
      color: color || DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)],
      createdAt: new Date(),
      cardCount: 0
    };
    
    set((state) => ({
      sets: [...state.sets, newSet],
    }));
  },

  removeSet: (id: string) => {
    if (id === 'default') return; // Prevent deleting default set
    
    set((state) => {
      // Move all flashcards from this set to default set
      const updatedFlashcards = state.flashcards.map(card => 
        card.setId === id ? { ...card, setId: 'default' } : card
      );
      
      // Update default set count
      const defaultSetCount = updatedFlashcards.filter(card => card.setId === 'default').length;
      const updatedSets = state.sets
        .filter(set => set.id !== id)
        .map(set => 
          set.id === 'default' ? { ...set, cardCount: defaultSetCount } : set
        );
      
      return {
        flashcards: updatedFlashcards,
        sets: updatedSets
      };
    });
  },

  updateSet: (id: string, updates: Partial<FlashcardSet>) => {
    if (id === 'default' && updates.name === 'General') return; // Prevent renaming default set
    
    set((state) => ({
      sets: state.sets.map((set) =>
        set.id === id ? { ...set, ...updates } : set
      ),
    }));
  },

  getSet: (id: string) => {
    return get().sets.find((set) => set.id === id);
  },

  getFlashcardsBySet: (setId: string) => {
    return get().flashcards.filter((card) => card.setId === setId);
  },

  getDefaultSet: () => {
    return get().sets.find(set => set.id === 'default')!;
  }
}));

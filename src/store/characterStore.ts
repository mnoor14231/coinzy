import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Character {
  id: string;
  name: string;
  nameArabic: string;
  emoji: string;
  image: string; // Character image/avatar
  color: string;
  personality: 'energetic' | 'wise' | 'friendly' | 'heroic' | 'magical';
  voiceSettings: {
    rate: number;
    pitch: number;
    volume: number;
  };
  animations: {
    idle: string;
    speaking: string;
    happy: string;
    thinking: string;
    celebrating: string;
    encouraging: string;
  };
}

interface CharacterState {
  selectedCharacter: Character | null;
  availableCharacters: Character[];
  selectCharacter: (characterId: string) => void;
  getCharacterById: (id: string) => Character | undefined;
  getDefaultCharacter: () => Character;
}

// Single character with all emotions - Simple but effective
const availableCharacters: Character[] = [
  {
    id: 'koinzy-buddy',
    name: 'Koinzy Buddy',
    nameArabic: 'كوينزي',
    emoji: '🤖',
    image: '🤖', // Robot emoji - shows all emotions clearly
    color: 'from-purple-500 to-pink-500',
    personality: 'friendly',
    voiceSettings: { rate: 0.9, pitch: 1.1, volume: 0.9 },
    animations: {
      idle: '🤖', // Robot face - neutral state
      speaking: '🗣️', // Speaking animation 
      happy: '😄', // Correct answer - big smile
      thinking: '🤔', // Thinking state - thoughtful
      celebrating: '🎉', // Success celebration - party
      encouraging: '💪' // Wrong answer encouragement - strong
    }
  }
];

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set, get) => ({
      selectedCharacter: availableCharacters[0], // Auto-select the single character
      availableCharacters,

      selectCharacter: (characterId: string) => {
        const character = availableCharacters.find(c => c.id === characterId);
        if (character) {
          set({ selectedCharacter: character });
        }
      },

      getCharacterById: (id: string) => {
        return get().availableCharacters.find(c => c.id === id);
      },

      getDefaultCharacter: () => {
        return availableCharacters[0]; // Return the single character
      }
    }),
    {
      name: 'coinzy-character-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
); 
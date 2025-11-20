export enum GameState {
  INTRO = 'INTRO',
  PLAYING = 'PLAYING',
  MEMORY_REVEAL = 'MEMORY_REVEAL',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY',
}

export enum PuzzleCategory {
  NUMBERS = 'Getallen',
  RATIOS = 'Verhoudingen',
  GEOMETRY = 'Meten & Meetkunde',
  RELATIONS = 'Verbanden',
}

export interface Puzzle {
  id: number;
  roomName: string;
  description: string;
  category: PuzzleCategory;
  question: string;
  options: string[]; // A, B, maybe C/D
  correctAnswerIndex: number;
  explanation: string;
  imagePrompt: string; // For Imagen
}

export interface Memory {
  id: number;
  text: string;
  imagePrompt: string; // For Imagen
  voiceText: string; // For TTS
}

export interface PlayerState {
  currentRoomIndex: number;
  sanity: number; // 0-100
  collectedMemories: number[];
  mistakes: number;
}
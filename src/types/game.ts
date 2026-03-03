// 游戏数据类型定义

export interface Puzzle {
  id: string;
  title: string;
  prompt: string;
  solution: string;
  metadata?: {
    source?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    tags?: string[];
  };
}

export interface QAItem {
  id: string;
  puzzleId: string;
  question: string;
  answer: 'YES' | 'NO' | 'IRRELEVANT' | 'BOTH';
  createdAt: number;
}

export type GameStatus = 'idle' | 'playing' | 'completed';

export interface GameState {
  currentPuzzle: Puzzle | null;
  qaList: QAItem[];
  isLoading: boolean;
  showRevealModal: boolean;
  gameStatus: GameStatus;
}

export type GameAction = 
  | { type: 'SET_PUZZLE'; payload: Puzzle }
  | { type: 'ADD_QA'; payload: QAItem }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_REVEAL_MODAL'; payload: boolean }
  | { type: 'SET_GAME_STATUS'; payload: GameStatus }
  | { type: 'RESET_GAME' };

// API 响应类型
export interface GetNextPuzzleResponse {
  puzzle: Puzzle;
}

export interface AskQuestionRequest {
  puzzleId: string;
  question: string;
}

export interface AskQuestionResponse {
  answer: 'YES' | 'NO' | 'IRRELEVANT' | 'BOTH';
  confidence?: number;
}

export interface RevealPuzzleRequest {
  puzzleId: string;
}

export interface RevealPuzzleResponse {
  solution: string;
}

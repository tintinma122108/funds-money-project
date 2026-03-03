'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, GameAction, Puzzle, QAItem } from '@/types/game';

// 初始状态
const initialState: GameState = {
  currentPuzzle: null,
  qaList: [],
  isLoading: false,
  showRevealModal: false,
  gameStatus: 'idle',
};

// Reducer 函数
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PUZZLE':
      return {
        ...state,
        currentPuzzle: action.payload,
        gameStatus: 'playing',
      };
    
    case 'ADD_QA':
      return {
        ...state,
        qaList: [...state.qaList, action.payload],
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case 'SET_REVEAL_MODAL':
      return {
        ...state,
        showRevealModal: action.payload,
      };
    
    case 'SET_GAME_STATUS':
      return {
        ...state,
        gameStatus: action.payload,
      };
    
    case 'RESET_GAME':
      return {
        ...initialState,
      };
    
    default:
      return state;
  }
}

// Context 类型
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  actions: {
    startGame: () => Promise<void>;
    askQuestion: (question: string) => Promise<void>;
    endGame: () => void;
    changePuzzle: () => Promise<void>;
    revealSolution: () => Promise<void>;
  };
}

// 创建 Context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider 组件
interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // 模拟 API 调用
  const mockPuzzles: Puzzle[] = [
    {
      id: '1',
      title: '海龟汤 #001',
      prompt: '一个男人走进一家餐厅，点了一份海龟汤。他尝了一口，然后立即离开了餐厅，再也没有回来。为什么？',
      solution: '这个男人曾经在海上遇难，他的同伴们为了生存而吃掉了海龟。当他尝到海龟汤的味道时，意识到这是人肉的味道，所以立即离开了。',
      metadata: {
        difficulty: 'medium',
        tags: ['生存', '道德', '真相'],
      },
    },
    {
      id: '2',
      title: '海龟汤 #002',
      prompt: '一个女人每天晚上都会在同一个时间醒来，然后走到窗边看外面。她的丈夫觉得很奇怪，但每次问她，她都说没什么。直到有一天，丈夫发现了真相。',
      solution: '这个女人实际上是一个盲人，她每天晚上醒来是为了"看"月亮。她的丈夫一直不知道她是盲人，直到有一天发现她根本看不见任何东西。',
      metadata: {
        difficulty: 'easy',
        tags: ['盲人', '月亮', '秘密'],
      },
    },
  ];

  const actions = {
    startGame: async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        // 模拟 API 调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 随机选择一个题目
        const randomPuzzle = mockPuzzles[Math.floor(Math.random() * mockPuzzles.length)];
        dispatch({ type: 'SET_PUZZLE', payload: randomPuzzle });
      } catch (error) {
        console.error('Failed to start game:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    askQuestion: async (question: string) => {
      if (!state.currentPuzzle) return;
      
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        // 模拟 API 调用延迟
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 模拟 AI 回答（这里只是随机返回）
        const answers: Array<'YES' | 'NO' | 'IRRELEVANT' | 'BOTH'> = ['YES', 'NO', 'IRRELEVANT', 'BOTH'];
        const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
        
        const qaItem: QAItem = {
          id: Date.now().toString(),
          puzzleId: state.currentPuzzle.id,
          question,
          answer: randomAnswer,
          createdAt: Date.now(),
        };
        
        dispatch({ type: 'ADD_QA', payload: qaItem });
      } catch (error) {
        console.error('Failed to ask question:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    endGame: () => {
      dispatch({ type: 'SET_REVEAL_MODAL', payload: true });
    },

    changePuzzle: async () => {
      dispatch({ type: 'RESET_GAME' });
      await actions.startGame();
    },

    revealSolution: async () => {
      dispatch({ type: 'SET_GAME_STATUS', payload: 'completed' });
      dispatch({ type: 'SET_REVEAL_MODAL', payload: false });
    },
  };

  return (
    <GameContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </GameContext.Provider>
  );
}

// Hook 用于使用 Context
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

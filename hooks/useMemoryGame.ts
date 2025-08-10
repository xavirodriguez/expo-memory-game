import { NReverseGameState } from '@/types/nreverse/nreverse';
import { useCallback, useEffect, useRef, useState } from 'react';

export type GameConfig = {
  SEQUENCE_DISPLAY_TIME: number;
  SEQUENCE_TRANSITION_TIME: number;
  INPUT_TIME_LIMIT: number;
  ENABLE_FEEDBACK_SOUND_ANIMATION: boolean;
  ENABLE_DIFFICULTY_INDICATOR: boolean;
  ENABLE_TUTORIAL: boolean;
  ENABLE_SHOW_SEQUENCE_ANIMATION: boolean;
  ENABLE_UNIFIED_STYLE: boolean;
  ENABLE_CONFETTI_ANIMATION: boolean;
};

const DEFAULT_CONFIG: GameConfig = {
  SEQUENCE_DISPLAY_TIME: 1000,
  SEQUENCE_TRANSITION_TIME: 300,
  INPUT_TIME_LIMIT: 30,
  ENABLE_FEEDBACK_SOUND_ANIMATION: true,
  ENABLE_DIFFICULTY_INDICATOR: true,
  ENABLE_TUTORIAL: false,
  ENABLE_SHOW_SEQUENCE_ANIMATION: true,
  ENABLE_UNIFIED_STYLE: true,
  ENABLE_CONFETTI_ANIMATION: true,
};

export function useMemoryGame(baseLength: number = 3, initialLevel: number = 1, config: Partial<GameConfig> = {}) {
  // Merge config with defaults
  const gameConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Game state
  const [gameState, setGameState] = useState<NReverseGameState>('welcome');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  
  // Display state
  const [currentDigit, setCurrentDigit] = useState<number>(-1);
  const [displayIndex, setDisplayIndex] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(gameConfig.INPUT_TIME_LIMIT);
  const [isPaused, setIsPaused] = useState(false);
  
  // Refs for cleanup
  const displayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inputTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Computed values
  const currentSequenceLength = baseLength + Math.floor((currentLevel - 1) / 2);
  const isLastDigitInSequence = displayIndex >= sequence.length - 1;
  
  // Utility functions
  const generateRandomSequence = useCallback((length: number): number[] => {
    return Array.from({ length }, () => Math.floor(Math.random() * 10));
  }, []);
  
  const clearTimers = useCallback(() => {
    if (displayTimerRef.current) {
      clearTimeout(displayTimerRef.current);
      displayTimerRef.current = null;
    }
    if (inputTimerRef.current) {
      clearInterval(inputTimerRef.current);
      inputTimerRef.current = null;
    }
  }, []);
  
  const resetGameState = useCallback(() => {
    clearTimers();
    setSequence([]);
    setUserSequence([]);
    setCurrentDigit(-1);
    setDisplayIndex(-1);
    setTimeLeft(gameConfig.INPUT_TIME_LIMIT);
    setIsPaused(false);
  }, [clearTimers, gameConfig.INPUT_TIME_LIMIT]);
  
  // Game flow functions
  const startNewGame = useCallback(() => {
    resetGameState();
    setCurrentLevel(initialLevel);
    setScore(0);
    setRound(0);
    setGameState('welcome');
  }, [resetGameState, initialLevel]);
  
  const startRound = useCallback(() => {
    resetGameState();
    const newSequence = generateRandomSequence(currentSequenceLength);
    setSequence(newSequence);
    setRound(prev => prev + 1);
    setGameState('sequence');
    setDisplayIndex(0);
  }, [resetGameState, generateRandomSequence, currentSequenceLength]);
  
  const submitAnswer = useCallback((userInput: number[]) => {
    clearTimers();
    
    const correctSequence = [...sequence].reverse();
    const isCorrect = userInput.length === correctSequence.length && 
                     userInput.every((digit, index) => digit === correctSequence[index]);
    
    if (isCorrect) {
      const roundScore = Math.max(1, Math.floor(timeLeft / 10)) * currentLevel;
      setScore(prev => prev + roundScore);
      setCurrentLevel(prev => prev + 1);
    }
    
    setGameState('finished');
    
    // Return result for immediate feedback
    return {
      isCorrect,
      correctSequence,
      userInput,
      roundScore: isCorrect ? Math.max(1, Math.floor(timeLeft / 10)) * currentLevel : 0
    };
  }, [sequence, timeLeft, currentLevel, clearTimers]);
  
  const togglePause = useCallback(() => {
    if (gameState === 'input') {
      setIsPaused(prev => !prev);
    }
  }, [gameState]);
  
  const addDigitToUserSequence = useCallback((digit: number) => {
    if (gameState === 'input' && !isPaused && userSequence.length < sequence.length) {
      setUserSequence(prev => [...prev, digit]);
    }
  }, [gameState, isPaused, userSequence.length, sequence.length]);
  
  const removeLastDigit = useCallback(() => {
    if (gameState === 'input' && !isPaused && userSequence.length > 0) {
      setUserSequence(prev => prev.slice(0, -1));
    }
  }, [gameState, isPaused, userSequence.length]);
  
  // Effects
  
  // Sequence display effect
  useEffect(() => {
    if (gameState === 'sequence' && displayIndex >= 0 && displayIndex < sequence.length) {
      setCurrentDigit(sequence[displayIndex]);
      
      displayTimerRef.current = setTimeout(() => {
        if (isLastDigitInSequence) {
          setCurrentDigit(-1);
          setDisplayIndex(-1);
          setGameState('input');
        } else {
          setDisplayIndex(prev => prev + 1);
        }
      }, gameConfig.SEQUENCE_DISPLAY_TIME);
    }
    
    return () => {
      if (displayTimerRef.current) {
        clearTimeout(displayTimerRef.current);
        displayTimerRef.current = null;
      }
    };
  }, [gameState, displayIndex, sequence, isLastDigitInSequence, gameConfig.SEQUENCE_DISPLAY_TIME]);
  
  // Input timer effect
  useEffect(() => {
    if (gameState === 'input' && !isPaused) {
      inputTimerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (inputTimerRef.current) {
      clearInterval(inputTimerRef.current);
      inputTimerRef.current = null;
    }
    
    return () => {
      if (inputTimerRef.current) {
        clearInterval(inputTimerRef.current);
        inputTimerRef.current = null;
      }
    };
  }, [gameState, isPaused]);
  
  // Auto-submit when user sequence is complete
  useEffect(() => {
    if (gameState === 'input' && userSequence.length === sequence.length && userSequence.length > 0) {
      // Small delay to allow user to see their complete input
      const submitTimer = setTimeout(() => {
        submitAnswer(userSequence);
      }, 500);
      
      return () => clearTimeout(submitTimer);
    }
  }, [gameState, userSequence, sequence.length, submitAnswer]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);
  
  return {
    // Game state
    gameState,
    currentLevel,
    score,
    round,
    isPaused,
    
    // Sequence state
    sequence,
    userSequence,
    currentDigit,
    displayIndex,
    timeLeft,
    
    // Computed values
    currentSequenceLength,
    correctSequence: [...sequence].reverse(),
    isSequenceComplete: userSequence.length === sequence.length,
    progress: {
      sequenceProgress: displayIndex >= 0 ? `${displayIndex + 1}/${sequence.length}` : '',
      inputProgress: `${userSequence.length}/${sequence.length}`,
    },
    
    // Actions
    startNewGame,
    startRound,
    submitAnswer,
    togglePause,
    addDigitToUserSequence,
    removeLastDigit,
    
    // Config
    gameConfig,
  };
}
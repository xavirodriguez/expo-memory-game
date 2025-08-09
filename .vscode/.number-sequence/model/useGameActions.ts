import { useState } from 'react';
import { GameState } from './types';

export function useGameActions(
  setCurrentDigit: (digit: number | null) => void,
  setDisplayIndex: (index: number) => void,
  setUserSequence: (sequence: number[]) => void,
  setTimeLeft: (time: number) => void,
  setGameState: (state: GameState) => void,
  setSequence: (sequence: number[]) => void,
  setScore: (score: number) => void,
  sequence: number[],
  userSequence: number[],
  currentLength: number
) {
  const [isProcessingInput, setIsProcessingInput] = useState(false);

  const resetGame = () => {
    setCurrentDigit(null);
    setDisplayIndex(-1);
    setUserSequence([]);
    setTimeLeft(15);
    setIsProcessingInput(false);
  };

  const generateSequence = () => {
    const newSequence = Array.from({ length: currentLength }, () =>
      Math.floor(Math.random() * 10)
    );

    setGameState('showing');
    setSequence(newSequence);
    setDisplayIndex(0);
  };

  const startNewRound = () => {
    resetGame();
    generateSequence();
  };

  const handleNumberInput = (num: number) => {
    if (isProcessingInput) return;

    setUserSequence(prev => {
      const newSequence = [...prev, num];
      
      // Check if we've entered all numbers
      if (newSequence.length === sequence.length) {
        setIsProcessingInput(true);
        
        // Compare with reversed original sequence
        const reversedOriginal = [...sequence].reverse();
        const isCorrect = newSequence.every(
          (num, index) => num === reversedOriginal[index]
        );

        if (isCorrect) {
          setScore(prev => prev + 10);
        }
        
        setTimeout(() => {
          setGameState('finished');
          setIsProcessingInput(false);
        }, 500);
      }
      
      return newSequence;
    });
  };

  const togglePause = () => {
    setGameState((prev) => (prev === 'paused' ? 'input' : 'paused'));
  };

  return {
    resetGame,
    generateSequence,
    startNewRound,
    togglePause,
    handleNumberInput,
  };
}
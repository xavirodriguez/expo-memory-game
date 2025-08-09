import { NReverseGameState } from '@/types/nreverse/nreverse';
import { useEffect, useState } from 'react';
export type GameConfig = {
  SEQUENCE_DISPLAY_TIME: number;
  SEQUENCE_TRANSITION_TIME: number;
  INITIAL_TIME: number;
  ENABLE_FEEDBACK_SOUND_ANIMATION: boolean;
  ENABLE_DIFFICULTY_INDICATOR: boolean;
  ENABLE_TUTORIAL: boolean;
  ENABLE_SHOW_SEQUENCE_ANIMATION: boolean;
  ENABLE_UNIFIED_STYLE: boolean;
  ENABLE_CONFETTI_ANIMATION: boolean;
};
export function useMemoryGame(baseLength: number, level: number) {
  const [gameState, setGameState] = useState<NReverseGameState>('welcome');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentDigit, setCurrentDigit] = useState<number>(-1);
  const [displayIndex, setDisplayIndex] = useState(-1);

  const currentLength = baseLength + (level - 1);
  const handlerStart = () => {
    setSequence([5,4,3,2,1]);
    setGameState('sequence');
    setDisplayIndex(0);
  }
  
  useEffect(() => {
    //let timer: NodeJS.Timeout | null = null;
let timer:number;
    if (gameState === 'input') {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState]);

  useEffect(() => {
    //let displayTimer: NodeJS.Timeout | null = null;
    let displayTimer:number;
    if (gameState === 'showing' && displayIndex >= 0) {
      setCurrentDigit(sequence[displayIndex]);
      
      displayTimer = setTimeout(() => {
        if (displayIndex >= sequence.length - 1) {
          setCurrentDigit(-1);
          setGameState('input');
        } else {
          setDisplayIndex(prev => prev + 1);
        }
      }, 
      60);
      //gameConfig.SEQUENCE_DISPLAY_TIME);
    }

    return () => {
      if (displayTimer) clearTimeout(displayTimer);
    };
  }, [gameState, displayIndex, sequence]);

  return {
    handlerStart,
    gameState,
    setGameState,

    sequence,
    setSequence,
    userSequence,
    setUserSequence,
    score,
    setScore,
    timeLeft,
    setTimeLeft,
    currentDigit,
    setCurrentDigit,
    displayIndex,
    setDisplayIndex,
    currentLength,
  };
}

// hooks/useMemoryGameMachine.ts
import { GameConfig } from '@/types/memoryGame';
import { useMachine } from '@xstate/react';
import { useCallback } from 'react';
import { memoryGameMachine } from './state/memoryGameMachine';
export function useMemoryGameMachine(
  baseLength: number = 3,
  initialLevel: number = 1,
  config: Partial<GameConfig> = {}
) {
  const [state, send] = useMachine(memoryGameMachine, {
    input: { baseLength, initialLevel, config },
  });

  // Acciones con useCallback para estabilidad
  const startGame = useCallback(() => send({ type: 'START_GAME' }), [send]);
  const startRound = useCallback(() => send({ type: 'START_ROUND' }), [send]);
  const addDigit = useCallback((digit: number) => send({ type: 'ADD_DIGIT', digit }), [send]);
  const removeDigit = useCallback(() => send({ type: 'REMOVE_DIGIT' }), [send]);
  const submitAnswer = useCallback(() => send({ type: 'SUBMIT_ANSWER' }), [send]);
  const togglePause = useCallback(() => {
    if (state.matches('input')) {
      send({ type: 'PAUSE' });
    } else if (state.matches('paused')) {
      send({ type: 'RESUME' });
    }
  }, [state, send]);
  const nextRound = useCallback(() => send({ type: 'NEXT_ROUND' }), [send]);
  const newGame = useCallback(() => send({ type: 'NEW_GAME' }), [send]);

  // Selectores computados
  const currentDigit = state.context.currentDigitIndex >= 0 && state.context.currentDigitIndex < state.context.sequence.length
    ? state.context.sequence[state.context.currentDigitIndex]
    : -1;

  const correctSequence = [...state.context.sequence].reverse();

  const progress = {
    sequenceProgress: state.matches('sequenceDisplay') && state.context.currentDigitIndex >= 0
      ? `${state.context.currentDigitIndex + 1}/${state.context.sequence.length}`
      : '',
    inputProgress: `${state.context.userSequence.length}/${state.context.sequence.length}`,
  };

  const currentSequenceLength = baseLength + Math.floor((state.context.currentLevel - 1) / 2);

  return {
    // Estado
    gameState: state.value as string,
    context: state.context,
    
    // Datos computados
    currentDigit,
    correctSequence,
    progress,
    currentSequenceLength,
    
    // Propiedades de acceso directo
    currentLevel: state.context.currentLevel,
    score: state.context.score,
    round: state.context.round,
    sequence: state.context.sequence,
    userSequence: state.context.userSequence,
    timeLeft: state.context.timeLeft,
    isPaused: state.matches('paused'),
    isSequenceComplete: state.context.userSequence.length === state.context.sequence.length,
    lastResult: state.context.lastResult,
    
    // Acciones
    startGame,
    startRound,
    addDigit,
    removeDigit,
    submitAnswer,
    togglePause,
    nextRound,
    newGame,
    
    // Utilidades
    canTransition: (event: string) => state.can({ type: event as any }),
    matches: (statePattern: string) => state.matches(statePattern),
  };
}
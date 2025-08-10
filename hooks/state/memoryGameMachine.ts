import type { GameConfig, GameContext, GameEvent, GameResult } from '@/types/memoryGame';
import { assign, createMachine, fromCallback } from 'xstate';

const DEFAULT_CONFIG: GameConfig = {
  SEQUENCE_DISPLAY_TIME: 1000,
  SEQUENCE_TRANSITION_TIME: 300,
  INPUT_TIME_LIMIT: 30,
  MAX_LEVEL: 50,
  POINTS_PER_LEVEL: 100,
} as const;

// Funciones puras para lógica de juego
const generateSequence = (length: number): readonly number[] => 
  Array.from({ length }, () => Math.floor(Math.random() * 10));

const calculateSequenceLength = (baseLength: number, level: number): number => 
  baseLength + Math.floor((level - 1) / 2);

const calculateScore = (timeLeft: number, level: number, config: GameConfig): number => 
  Math.max(1, Math.floor(timeLeft / 10)) * config.POINTS_PER_LEVEL * level;

const isSequenceCorrect = (userInput: readonly number[], correctSequence: readonly number[]): boolean =>
  userInput.length === correctSequence.length && 
  userInput.every((digit, index) => digit === correctSequence[index]);

const createGameResult = (
  userInput: readonly number[], 
  sequence: readonly number[], 
  timeLeft: number, 
  level: number, 
  config: GameConfig
): GameResult => {
  const correctSequence = [...sequence].reverse();
  const isCorrect = isSequenceCorrect(userInput, correctSequence);
  const roundScore = isCorrect ? calculateScore(timeLeft, level, config) : 0;
  const timeBonus = isCorrect ? timeLeft : 0;

  return {
    isCorrect,
    correctSequence,
    userInput,
    roundScore,
    timeBonus,
  };
};

// Actor para timer de secuencia
const sequenceTimerLogic = fromCallback<GameEvent>(({ sendBack, input }) => {
  const timeout = setTimeout(() => {
    sendBack({ type: 'DIGIT_SHOWN' });
  }, (input as GameContext).config.SEQUENCE_DISPLAY_TIME);

  return () => clearTimeout(timeout);
});

// Actor para timer de transición
const transitionTimerLogic = fromCallback<GameEvent>(({ sendBack, input }) => {
  const timeout = setTimeout(() => {
    sendBack({ type: 'TRANSITION_COMPLETE' });
  }, (input as GameContext).config.SEQUENCE_TRANSITION_TIME);

  return () => clearTimeout(timeout);
});

// Actor para timer de input
const inputTimerLogic = fromCallback<GameEvent>(({ sendBack }) => {
  const interval = setInterval(() => {
    sendBack({ type: 'TICK' });
  }, 1000);

  return () => clearInterval(interval);
});

export const memoryGameMachine = createMachine(
  {
    id: 'memoryGame',
    types: {
      context: {} as GameContext,
      events: {} as GameEvent,
    },
    context: ({ input }: { input: { baseLength: number; initialLevel: number; config?: Partial<GameConfig> } }) => ({
      currentLevel: input.initialLevel,
      score: 0,
      round: 0,
      baseLength: input.baseLength,
      sequence: [],
      userSequence: [],
      currentDigitIndex: -1,
      timeLeft: 0,
      config: { ...DEFAULT_CONFIG, ...input.config },
      lastResult: undefined,
      error: undefined,
    }),
    initial: 'welcome',
    states: {
      welcome: {
        on: {
          START_GAME: {
            target: 'sequenceDisplay',
            actions: 'initializeRound',
          },
        },
      },
      
      sequenceDisplay: {
        invoke: {
          src: sequenceTimerLogic,
          input: ({ context }) => context,
        },
        initial: 'showing',
        states: {
          showing: {
            on: {
              DIGIT_SHOWN: [
                {
                  guard: 'isLastDigit',
                  target: 'complete',
                  actions: 'resetDigitIndex',
                },
                {
                  actions: 'nextDigit',
                },
              ],
            },
          },
          complete: {
            on: {
              SEQUENCE_COMPLETE: {
                target: '#memoryGame.sequenceTransition',
              },
            },
            entry: 'sendSequenceComplete',
          },
        },
        entry: 'startSequenceDisplay',
      },

      sequenceTransition: {
        invoke: {
          src: transitionTimerLogic,
          input: ({ context }) => context,
        },
        on: {
          TRANSITION_COMPLETE: {
            target: 'input',
            actions: 'initializeInput',
          },
        },
      },

      input: {
        invoke: {
          src: inputTimerLogic,
        },
        on: {
          ADD_DIGIT: {
            guard: 'canAddDigit',
            actions: 'addDigit',
          },
          REMOVE_DIGIT: {
            guard: 'canRemoveDigit', 
            actions: 'removeDigit',
          },
          SUBMIT_ANSWER: {
            target: 'finished',
            actions: 'calculateResult',
          },
          PAUSE: {
            target: 'paused',
          },
          TICK: [
            {
              guard: 'isTimeUp',
              target: 'finished',
              actions: ['calculateResultOnTimeout'],
            },
            {
              actions: 'decrementTime',
            },
          ],
          TIMEOUT: {
            target: 'finished',
            actions: 'calculateResultOnTimeout',
          },
        },
        // Auto-submit cuando secuencia esté completa
        always: {
          guard: 'isInputComplete',
          target: 'finished',
          actions: 'calculateResult',
        },
      },

      paused: {
        on: {
          RESUME: {
            target: 'input',
          },
          NEW_GAME: {
            target: 'welcome',
            actions: 'resetGame',
          },
        },
      },

      finished: {
        on: {
          NEXT_ROUND: [
            {
              guard: 'wasAnswerCorrect',
              target: 'sequenceDisplay',
              actions: ['updateScore', 'nextLevel', 'initializeRound'],
            },
            {
              target: 'welcome',
              actions: 'resetGame',
            },
          ],
          NEW_GAME: {
            target: 'welcome', 
            actions: 'resetGame',
          },
        },
      },

      error: {
        on: {
          NEW_GAME: {
            target: 'welcome',
            actions: 'resetGame',
          },
        },
      },
    },
    
    on: {
      ERROR: {
        target: '.error',
        actions: 'setError',
      },
      NEW_GAME: {
        target: '.welcome',
        actions: 'resetGame',
      },
    },
  },
  {
    actions: {
      initializeRound: assign({
        round: ({ context }) => context.round + 1,
        sequence: ({ context }) => generateSequence(
          calculateSequenceLength(context.baseLength, context.currentLevel)
        ),
        userSequence: [],
        currentDigitIndex: 0,
        timeLeft: ({ context }) => context.config.INPUT_TIME_LIMIT,
        lastResult: undefined,
      }),

      startSequenceDisplay: assign({
        currentDigitIndex: 0,
      }),

      nextDigit: assign({
        currentDigitIndex: ({ context }) => context.currentDigitIndex + 1,
      }),

      resetDigitIndex: assign({
        currentDigitIndex: -1,
      }),

      sendSequenceComplete: ({ self }) => {
        // Envío diferido para evitar loop
        setTimeout(() => self.send({ type: 'SEQUENCE_COMPLETE' }), 0);
      },

      initializeInput: assign({
        timeLeft: ({ context }) => context.config.INPUT_TIME_LIMIT,
        userSequence: [],
      }),

      addDigit: assign({
        userSequence: ({ context, event }) => {
          if (event.type !== 'ADD_DIGIT') return context.userSequence;
          return [...context.userSequence, event.digit];
        },
      }),

      removeDigit: assign({
        userSequence: ({ context }) => context.userSequence.slice(0, -1),
      }),

      decrementTime: assign({
        timeLeft: ({ context }) => Math.max(0, context.timeLeft - 1),
      }),

      calculateResult: assign({
        lastResult: ({ context }) => createGameResult(
          context.userSequence,
          context.sequence,
          context.timeLeft,
          context.currentLevel,
          context.config
        ),
      }),

      calculateResultOnTimeout: assign({
        lastResult: ({ context }) => createGameResult(
          context.userSequence,
          context.sequence,
          0, // No time bonus
          context.currentLevel,
          context.config
        ),
      }),

      updateScore: assign({
        score: ({ context }) => {
          const result = context.lastResult;
          return result ? context.score + result.roundScore : context.score;
        },
      }),

      nextLevel: assign({
        currentLevel: ({ context }) => 
          Math.min(context.currentLevel + 1, context.config.MAX_LEVEL),
      }),

      resetGame: assign(({ context }) => ({
        currentLevel: 1,
        score: 0,
        round: 0,
        sequence: [],
        userSequence: [],
        currentDigitIndex: -1,
        timeLeft: context.config.INPUT_TIME_LIMIT,
        lastResult: undefined,
        error: undefined,
      })),

      setError: assign({
        error: ({ event }) => {
          if (event.type !== 'ERROR') return undefined;
          return event.error;
        },
      }),
    },

    guards: {
      isLastDigit: ({ context }) => 
        context.currentDigitIndex >= context.sequence.length - 1,

      canAddDigit: ({ context, event }) => 
        event.type === 'ADD_DIGIT' && 
        context.userSequence.length < context.sequence.length,

      canRemoveDigit: ({ context }) => 
        context.userSequence.length > 0,

      isTimeUp: ({ context }) => 
        context.timeLeft <= 1,

      isInputComplete: ({ context }) => 
        context.userSequence.length === context.sequence.length && 
        context.userSequence.length > 0,

      wasAnswerCorrect: ({ context }) => 
        context.lastResult?.isCorrect ?? false,
    },
  }
);

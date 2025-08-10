export type GameState = 
  | 'welcome'
  | 'sequenceDisplay' 
  | 'sequenceTransition'
  | 'input'
  | 'paused'
  | 'finished'
  | 'error';

export interface GameContext {
  readonly currentLevel: number;
  readonly score: number;
  readonly round: number;
  readonly baseLength: number;
  readonly sequence: readonly number[];
  readonly userSequence: readonly number[];
  readonly currentDigitIndex: number;
  readonly timeLeft: number;
  readonly config: GameConfig;
  readonly lastResult?: GameResult;
  readonly error?: string;
}

export interface GameConfig {
  readonly SEQUENCE_DISPLAY_TIME: number;
  readonly SEQUENCE_TRANSITION_TIME: number;
  readonly INPUT_TIME_LIMIT: number;
  readonly MAX_LEVEL: number;
  readonly POINTS_PER_LEVEL: number;
}

export interface GameResult {
  readonly isCorrect: boolean;
  readonly correctSequence: readonly number[];
  readonly userInput: readonly number[];
  readonly roundScore: number;
  readonly timeBonus: number;
}

export type GameEvent =
  | { type: 'START_GAME' }
  | { type: 'START_ROUND' }
  | { type: 'DIGIT_SHOWN' }
  | { type: 'SEQUENCE_COMPLETE' }
  | { type: 'TRANSITION_COMPLETE' }
  | { type: 'ADD_DIGIT'; digit: number }
  | { type: 'REMOVE_DIGIT' }
  | { type: 'SUBMIT_ANSWER' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'TICK' }
  | { type: 'TIMEOUT' }
  | { type: 'NEXT_ROUND' }
  | { type: 'NEW_GAME' }
  | { type: 'ERROR'; error: string };
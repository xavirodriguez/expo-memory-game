import { GameProgress } from './GameProgress';
import { GameRules } from './GameRules';

export interface Game {
  id: string;
  title: string;
  description: string;
  progress: GameProgress;
  rules: GameRules; //nada
}

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
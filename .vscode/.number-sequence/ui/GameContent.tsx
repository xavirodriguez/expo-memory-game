import { GameState } from '../model/types';

type GameContentProps = {
  gameState: GameState;
  currentDigit: number | null;
  displayIndex: number;
  sequence: number[];
  userSequence: number[];
  timeLeft: number;
  score: number;
  currentLength: number;
  onNumberInput: (num: number) => void;
  onStartNewRound: () => void;
  onTogglePause: () => void;
};

export function GameContent({
  gameState,
  currentDigit,
  displayIndex,
  sequence,
  userSequence,
  timeLeft,
  score,
  currentLength,
  onNumberInput,
  onStartNewRound,
  onTogglePause,
}: GameContentProps) {

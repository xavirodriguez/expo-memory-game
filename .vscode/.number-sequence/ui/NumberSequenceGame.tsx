import * as React from "react";
import { NumberSequenceProps } from "../model/types";
import { useGameActions } from "../model/useGameActions";
import { useGameState } from "../model/useGameState";
import { GameContent } from "./GameContent";

export function NumberSequenceGame({ route }: NumberSequenceProps) {
  const {
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
  } = useGameState(3, route.params.level);

  const { startNewRound, togglePause, handleNumberInput } = useGameActions(
    setCurrentDigit,
    setDisplayIndex,
    setUserSequence,
    setTimeLeft,
    setGameState,
    setSequence,
    setScore,
    sequence,
    userSequence,
    currentLength
  );

  return (
    <>
      <label className="text-2xl text-center mb-4">
        Nivel {route.params.level}
      </label>

      <GameContent
        gameState={gameState}
        currentDigit={currentDigit}
        displayIndex={displayIndex}
        sequence={sequence}
        userSequence={userSequence}
        timeLeft={timeLeft}
        score={score}
        currentLength={currentLength}
        onNumberInput={handleNumberInput}
        onStartNewRound={startNewRound}
        onTogglePause={togglePause}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});

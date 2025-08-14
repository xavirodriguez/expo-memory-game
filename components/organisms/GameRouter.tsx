import React from 'react'
import { useTranslation } from 'react-i18next'
import ErrorScreen from './ErrorScreen'
import FinishedScreen from './FinishedScreen'
import InputScreen from './InputScreen'
import SequenceScreen from './SequenceScreen'
import TransitionScreen from './TransitionScreen'
import WelcomeScreen from './WelcomeScreen'

interface GameRouterProps {
  game: ReturnType<
    typeof import('@/hooks/useMemoryGameMachine').useMemoryGameMachine
  >
  levelParam: string | string[] | undefined
}

/**
 * GameRouter is responsible for conditionally rendering the correct
 * organism-level screen based on the current game state.
 */
const GameRouter: React.FC<GameRouterProps> = ({ game, levelParam }) => {
  const { t } = useTranslation()

  if (game.matches('welcome')) {
    return <WelcomeScreen game={game} levelParam={levelParam} />
  }
  if (game.matches('sequenceDisplay')) {
    return <SequenceScreen game={game} />
  }
  if (game.matches('sequenceTransition')) {
    return <TransitionScreen game={game} />
  }
  if (game.matches('input') || game.matches('paused')) {
    return <InputScreen game={game} />
  }
  if (game.matches('finished')) {
    return <FinishedScreen game={game} />
  }
  if (game.matches('error')) {
    return <ErrorScreen game={game} />
  }
  // Fallback in case the state is unknown
  return (
    <ErrorScreen
      game={game}
      error={t('errors.unknownState', {
        state: JSON.stringify(game.gameState),
      })}
    />
  )
}

export default GameRouter

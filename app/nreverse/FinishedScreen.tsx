import { useMemoryGameMachine } from '@/hooks/useMemoryGameMachine'
import { useTranslation } from 'react-i18next'
import ErrorScreen from './ErrorScreen'
import ResultPanel from './organisms/ResultPanel'

const FinishedScreen = ({
  game,
}: {
  game: ReturnType<typeof useMemoryGameMachine>
}) => {
  const { t } = useTranslation()
  const result = game.lastResult
  if (!result) return <ErrorScreen game={game} error={t('errors.noResult')} />
  return (
    <ResultPanel
      game={game}
      result={result}
      t={t}
      onNext={game.nextRound}
      onNewGame={game.newGame}
    />
  )
}

export default FinishedScreen

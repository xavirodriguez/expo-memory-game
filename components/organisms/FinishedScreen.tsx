import ResultPanel from '@/components/organisms/ResultPanel'
import { useMemoryGameMachine } from '@/hooks/useMemoryGameMachine'
import { useTranslation } from 'react-i18next'
import ErrorScreen from './ErrorScreen'

const FinishedScreen = ({
  game,
}: {
  game: ReturnType<typeof useMemoryGameMachine>
}) => {
  const { t } = useTranslation()
  const result = game.lastResult
  if (!result) return <ErrorScreen game={game} error={t('errors.noResult')} />
  return <ResultPanel result={result} t={t} />
}

export default FinishedScreen

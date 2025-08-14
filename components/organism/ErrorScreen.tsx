import { useMemoryGameMachine } from '@/hooks/useMemoryGameMachine'
import { useTranslation } from 'react-i18next'
import ErrorBlock from './molecules/ErrorBlock'

const ErrorScreen = ({
  game,
  error,
}: {
  game: ReturnType<typeof useMemoryGameMachine>
  error?: string
}) => {
  const { t } = useTranslation()
  const errorMessage = error || game.context.error || t('errors.unexpected')
  return (
    <ErrorBlock errorMessage={errorMessage} onRestart={game.newGame} t={t} />
  )
}

export default ErrorScreen

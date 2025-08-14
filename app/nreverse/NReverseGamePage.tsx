import ErrorBoundary from '@/components/ErrorBoundary'
import { useMemoryGameMachine } from '@/hooks/useMemoryGameMachine'
import { useLocalSearchParams } from 'expo-router'
import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'
import GameRouter from './organisms/GameRouter'

const parseLevelParam = (levelParam: string | string[] | undefined): number => {
  if (!levelParam) return 1
  const levelStr = Array.isArray(levelParam) ? levelParam[0] : levelParam
  const parsed = parseInt(levelStr, 10)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1
}

/**
 * The main page for the NReverse game, using atomic design components.
 * Handles game lifecycle, error boundary, and routing between game states.
 */
const NReverseGamePage: React.FC = () => {
  const { t } = useTranslation()
  const params = useLocalSearchParams()
  const initialLevel = parseLevelParam(params.level)
  const game = useMemoryGameMachine(3, initialLevel, {
    INPUT_TIME_LIMIT: 30,
    SEQUENCE_DISPLAY_TIME: 1200,
    SEQUENCE_TRANSITION_TIME: 300,
  })

  const handleGameComplete = useCallback(() => {
    const result = game.lastResult
    if (!result) {
      console.warn(t('errors.noResult'))
      return
    }
    if (result.isCorrect) {
      Alert.alert(
        t('alerts.correctTitle'),
        t('alerts.correctMessage', {
          roundScore: result.roundScore,
          timeBonus: result.timeBonus,
        }),
        [{ text: t('alerts.nextRound'), onPress: game.nextRound }],
      )
    } else {
      Alert.alert(
        t('alerts.incorrectTitle'),
        t('alerts.incorrectMessage', {
          correctSequence: result.correctSequence.join(' '),
          userInput: result.userInput.join(' '),
        }),
        [
          { text: t('alerts.retry'), onPress: game.nextRound },
          { text: t('alerts.newGame'), onPress: game.newGame },
        ],
      )
    }
  }, [game, t])

  useEffect(() => {
    if (game.matches('finished') && game.lastResult) {
      const timer = setTimeout(handleGameComplete, 100)
      return () => clearTimeout(timer)
    }
  }, [game.matches('finished'), game.lastResult, handleGameComplete])

  return (
    <ErrorBoundary
      onError={(error, errorInfo, errorId) => {
        console.error(t('errors.gameError', { errorId }), error, errorInfo)
      }}>
      <GameRouter game={game} levelParam={params.level} />
    </ErrorBoundary>
  )
}

export default NReverseGamePage

// app/nreverse/nreverse-xstate.tsx
import ErrorBoundary from '@/components/ErrorBoundary'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useMemoryGameMachine } from '@/hooks/useMemoryGameMachine'
import { Button } from '@react-navigation/elements'
import { Image } from 'expo-image'
import { useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, TextInput } from 'react-native'

interface RouteParams {
  readonly level?: string | string[]
}

const parseLevelParam = (levelParam: string | string[] | undefined): number => {
  if (!levelParam) return 1
  const levelStr = Array.isArray(levelParam) ? levelParam[0] : levelParam
  const parsed = parseInt(levelStr, 10)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1
}

export default function NReverseXStateScreen() {
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
  }, [game.lastResult, game.nextRound, game.newGame, t])

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

interface GameRouterProps {
  readonly game: ReturnType<typeof useMemoryGameMachine>
  readonly levelParam: string | string[] | undefined
}

const GameRouter = ({ game, levelParam }: GameRouterProps) => {
  const { t } = useTranslation()
  if (game.matches('welcome'))
    return <WelcomeScreen game={game} levelParam={levelParam} />
  if (game.matches('sequenceDisplay')) return <SequenceScreen game={game} />
  if (game.matches('sequenceTransition'))
    return <TransitionScreen game={game} />
  if (game.matches('input') || game.matches('paused'))
    return <InputScreen game={game} />
  if (game.matches('finished')) return <FinishedScreen game={game} />
  if (game.matches('error')) return <ErrorScreen game={game} />
  return (
    <ErrorScreen
      game={game}
      error={t('errors.unknownState', {
        state: JSON.stringify(game.gameState),
      })}
    />
  )
}

const WelcomeScreen = ({
  game,
  levelParam,
}: {
  game: ReturnType<typeof useMemoryGameMachine>
  levelParam: string | string[] | undefined
}) => {
  const { t } = useTranslation()
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          className='h-logo-h w-logo-w absolute bottom-0 left-0'
        />
      }>
      {levelParam && (
        <ThemedView className='bg-overlay-blue-light p-3 rounded-lg mb-4'>
          <ThemedText type='subtitle'>
            {t('welcome.startLevel', {
              level: Array.isArray(levelParam) ? levelParam[0] : levelParam,
            })}
          </ThemedText>
        </ThemedView>
      )}
      <ThemedView className='items-center gap-2 mb-4'>
        <ThemedText type='title'>{t('welcome.title')}</ThemedText>
        <ThemedText type='subtitle' className='text-sm italic opacity-70'>
          {t('welcome.subtitle')}
        </ThemedText>
      </ThemedView>
      <ThemedView className='gap-2 mb-4'>
        <ThemedText>{t('welcome.intro')}</ThemedText>
        <ThemedText>{t('nreverse.description')}</ThemedText>
        <ThemedText type='defaultSemiBold'>
          {t('game.levelLength', {
            level: game.currentLevel,
            length: game.currentSequenceLength,
          })}
        </ThemedText>
        <ThemedText type='default'>
          {t('game.scoreRound', { score: game.score, round: game.round })}
        </ThemedText>
      </ThemedView>
      <ThemedView className='mt-5'>
        <Button onPress={game.startGame}>{t('buttons.startGame')}</Button>
      </ThemedView>
    </ParallaxScrollView>
  )
}

const SequenceScreen = ({
  game,
}: {
  game: ReturnType<typeof useMemoryGameMachine>
}) => {
  const { t } = useTranslation()
  return (
    <ThemedView className='flex-1 justify-center items-center p-5'>
      <ThemedText type='title' className='text-center'>
        {t('sequence.title')}
      </ThemedText>
      <ThemedText type='subtitle' className='text-center'>
        {game.progress.sequenceProgress}
      </ThemedText>
      <ThemedView className='w-digit h-digit justify-center items-center rounded-digit bg-overlay-blue my-10 shadow'>
        {game.currentDigit >= 0 ? (
          <ThemedText type='title' className='text-digit-lg font-bold'>
            {game.currentDigit}
          </ThemedText>
        ) : (
          <ThemedText type='subtitle' className='text-digit-sm opacity-70'>
            {t('sequence.preparing')}
          </ThemedText>
        )}
      </ThemedView>
      <ThemedView className='bg-overlay-light p-3 rounded-lg mt-4'>
        <ThemedText type='default' className='text-center'>
          {t('game.levelRound', {
            level: game.currentLevel,
            round: game.round,
          })}
        </ThemedText>
        <ThemedText type='default' className='text-center'>
          {t('game.score', { score: game.score })}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  )
}

const TransitionScreen = ({
  game,
}: {
  game: ReturnType<typeof useMemoryGameMachine>
}) => {
  const { t } = useTranslation()
  return (
    <ThemedView className='flex-1 justify-center items-center p-5'>
      <ThemedText type='title' className='text-center'>
        {t('transition.preparingInput')}
      </ThemedText>
      <ThemedView className='w-pulse h-pulse justify-center items-center rounded-pulse bg-overlay-pulse my-8'>
        <ThemedText type='subtitle' className='text-pulse'>
          ⚡
        </ThemedText>
      </ThemedView>
      <ThemedText type='default' className='text-center'>
        {t('transition.instruction')}
      </ThemedText>
    </ThemedView>
  )
}

const InputScreen = ({
  game,
}: {
  game: ReturnType<typeof useMemoryGameMachine>
}) => {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState('')
  useEffect(() => {
    setInputValue(game.userSequence.join(''))
  }, [game.userSequence])

  const handleInputChange = useCallback(
    (text: string) => {
      const numericText = text.replace(/[^0-9]/g, '')
      if (numericText.length <= game.sequence.length) {
        const newSequence = numericText.split('').map(Number)
        const currentSequence = [...game.userSequence]
        if (newSequence.length > currentSequence.length) {
          for (let i = currentSequence.length; i < newSequence.length; i++) {
            game.addDigit(newSequence[i])
          }
        } else if (newSequence.length < currentSequence.length) {
          for (
            let i = 0;
            i < currentSequence.length - newSequence.length;
            i++
          ) {
            game.removeDigit()
          }
        }
      }
    },
    [game],
  )

  const handleSubmit = useCallback(() => {
    if (game.isSequenceComplete && !game.isPaused) game.submitAnswer()
  }, [game])

  return (
    <ThemedView className='flex-1 p-5 justify-center'>
      <ThemedView className='items-center mb-5'>
        <ThemedText
          type='title'
          className={`text-2xl font-bold ${game.timeLeft <= 10 ? 'text-danger' : ''}`}>
          {t('input.timeLeft', { seconds: game.timeLeft })}
        </ThemedText>
        {game.isPaused && (
          <ThemedText type='subtitle' className='text-warning mt-2'>
            {t('input.paused')}
          </ThemedText>
        )}
      </ThemedView>
      <ThemedText type='subtitle' className='text-center'>
        {t('input.instruction')}
      </ThemedText>
      <ThemedText type='default' className='text-center'>
        {t('input.progress', { progress: game.progress.inputProgress })}
      </ThemedText>
      <ThemedView className='my-8'>
        <TextInput
          value={inputValue}
          onChangeText={handleInputChange}
          className='border-2 border-gray-300 rounded-lg p-3 text-lg text-center mb-4 bg-white'
          keyboardType='numeric'
          maxLength={game.sequence.length}
          placeholder={t('input.placeholder', { length: game.sequence.length })}
          placeholderTextColor='#666'
          autoFocus
          editable={!game.isPaused}
        />
        <ThemedText
          type='default'
          className='text-center text-base tracking-seq mb-2'>
          {t('input.userSequence', {
            sequence: game.userSequence.join(' ') || '---',
          })}
        </ThemedText>
        <ThemedText type='default' className='text-center text-sm opacity-60'>
          {t('input.originalLength', { length: game.sequence.length })}
        </ThemedText>
      </ThemedView>
      <ThemedView className='flex-row justify-around my-5 gap-4'>
        <Button onPress={game.togglePause} disabled={game.matches('finished')}>
          {game.isPaused ? t('buttons.resume') : t('buttons.pause')}
        </Button>
        <Button
          onPress={handleSubmit}
          disabled={!game.isSequenceComplete || game.isPaused}>
          {t('buttons.confirm')}
        </Button>
      </ThemedView>
      <ThemedView className='bg-overlay-light p-3 rounded-lg mt-4'>
        <ThemedText type='default' className='text-center'>
          {t('game.levelScore', {
            level: game.currentLevel,
            score: game.score,
          })}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  )
}

const FinishedScreen = ({
  game,
}: {
  game: ReturnType<typeof useMemoryGameMachine>
}) => {
  const { t } = useTranslation()
  const result = game.lastResult
  if (!result) return <ErrorScreen game={game} error={t('errors.noResult')} />
  const isCorrect = result.isCorrect
  return (
    <ThemedView className='flex-1 p-5 justify-center'>
      <ThemedText
        type='title'
        className={`text-center ${isCorrect ? 'text-success' : 'text-error'}`}>
        {isCorrect ? t('finished.correct') : t('finished.incorrect')}
      </ThemedText>
      <ThemedView className='bg-overlay-medium p-4 rounded-lg my-5 space-y-2'>
        <ThemedText type='defaultSemiBold'>{t('finished.results')}</ThemedText>
        <ThemedText type='default'>
          {t('finished.originalSequence', {
            sequence: game.sequence.join(' '),
          })}
        </ThemedText>
        <ThemedText type='default'>
          {t('finished.correctSequence', {
            sequence: result.correctSequence.join(' '),
          })}
        </ThemedText>
        <ThemedText type='default'>
          {t('finished.userInput', {
            sequence: result.userInput.join(' ') || t('finished.noAnswer'),
          })}
        </ThemedText>
        {isCorrect && (
          <>
            <ThemedText type='default' className='text-bonus font-medium'>
              {t('finished.roundPoints', { points: result.roundScore })}
            </ThemedText>
            <ThemedText type='default' className='text-bonus font-medium'>
              {t('finished.timeBonus', { bonus: result.timeBonus })}
            </ThemedText>
          </>
        )}
      </ThemedView>
      <ThemedText type='subtitle' className='text-center'>
        {t('finished.totalScore', { score: game.score })}
      </ThemedText>
      <ThemedView className='flex-row justify-around my-5 gap-4'>
        <Button onPress={game.nextRound}>
          {isCorrect ? t('buttons.nextRound') : t('buttons.retry')}
        </Button>
        <Button onPress={game.newGame}>{t('buttons.newGame')}</Button>
      </ThemedView>
    </ThemedView>
  )
}

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
    <ThemedView className='flex-1 justify-center items-center p-5'>
      <ThemedText type='title' className='text-error'>
        {t('errors.title')}
      </ThemedText>
      <ThemedText className='text-center'>{errorMessage}</ThemedText>
      <ThemedView className='mt-5'>
        <Button onPress={game.newGame}>{t('buttons.restart')}</Button>
      </ThemedView>
    </ThemedView>
  )
}

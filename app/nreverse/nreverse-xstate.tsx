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
      console.warn('No game result available')
      return
    }
    if (result.isCorrect) {
      Alert.alert(
        '¡Correcto!',
        `Puntuación: ${result.roundScore}\nBonus de tiempo: ${result.timeBonus}`,
        [{ text: 'Siguiente Ronda', onPress: game.nextRound }],
      )
    } else {
      Alert.alert(
        'Incorrecto',
        `Secuencia correcta: ${result.correctSequence.join(' ')}\nTu respuesta: ${result.userInput.join(' ')}`,
        [
          { text: 'Reintentar', onPress: game.nextRound },
          { text: 'Nuevo Juego', onPress: game.newGame },
        ],
      )
    }
  }, [game.lastResult, game.nextRound, game.newGame])

  useEffect(() => {
    if (game.matches('finished') && game.lastResult) {
      const timer = setTimeout(handleGameComplete, 100)
      return () => clearTimeout(timer)
    }
  }, [game.matches('finished'), game.lastResult, handleGameComplete])

  return (
    <ErrorBoundary
      onError={(error, errorInfo, errorId) => {
        console.error(`Game Error [${errorId}]:`, error, errorInfo)
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
      error={`Estado desconocido: ${JSON.stringify(game.gameState)}`}
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
            🎮 Iniciando juego en nivel:{' '}
            {Array.isArray(levelParam) ? levelParam[0] : levelParam}
          </ThemedText>
        </ThemedView>
      )}
      <ThemedView className='items-center gap-2 mb-4'>
        <ThemedText type='title'>🧠 ¡Mejora tu memoria!</ThemedText>
        <ThemedText type='subtitle' className='text-sm italic opacity-70'>
          Versión XState Machine
        </ThemedText>
      </ThemedView>
      <ThemedView className='gap-2 mb-4'>
        <ThemedText>{t('welcome')}</ThemedText>
        <ThemedText>{t('nreverse.description')}</ThemedText>
        <ThemedText type='defaultSemiBold'>
          📊 Nivel actual: {game.currentLevel} | Longitud:{' '}
          {game.currentSequenceLength}
        </ThemedText>
        <ThemedText type='default'>
          🏆 Puntuación: {game.score} | 🎯 Ronda: {game.round}
        </ThemedText>
      </ThemedView>
      <ThemedView className='mt-5'>
        <Button onPress={game.startGame}>🚀 Comenzar Juego</Button>
      </ThemedView>
    </ParallaxScrollView>
  )
}

const SequenceScreen = ({
  game,
}: {
  game: ReturnType<typeof useMemoryGameMachine>
}) => (
  <ThemedView className='flex-1 justify-center items-center p-5'>
    <ThemedText type='title' className='text-center'>
      🎯 Memoriza la secuencia
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
          ⏳ Preparando...
        </ThemedText>
      )}
    </ThemedView>
    <ThemedView className='bg-overlay-light p-3 rounded-lg mt-4'>
      <ThemedText type='default' className='text-center'>
        📊 Nivel: {game.currentLevel} | 🎯 Ronda: {game.round}
      </ThemedText>
      <ThemedText type='default' className='text-center'>
        🏆 Puntuación: {game.score}
      </ThemedText>
    </ThemedView>
  </ThemedView>
)

const TransitionScreen = ({
  game,
}: {
  game: ReturnType<typeof useMemoryGameMachine>
}) => (
  <ThemedView className='flex-1 justify-center items-center p-5'>
    <ThemedText type='title' className='text-center'>
      🔄 Preparando entrada...
    </ThemedText>
    <ThemedView className='w-pulse h-pulse justify-center items-center rounded-pulse bg-overlay-pulse my-8'>
      <ThemedText type='subtitle' className='text-pulse'>
        ⚡
      </ThemedText>
    </ThemedView>
    <ThemedText type='default' className='text-center'>
      Introduce la secuencia en orden inverso
    </ThemedText>
  </ThemedView>
)

const InputScreen = ({
  game,
}: {
  game: ReturnType<typeof useMemoryGameMachine>
}) => {
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
          ⏰ Tiempo: {game.timeLeft}s
        </ThemedText>
        {game.isPaused && (
          <ThemedText type='subtitle' className='text-warning mt-2'>
            ⏸️ PAUSADO
          </ThemedText>
        )}
      </ThemedView>
      <ThemedText type='subtitle' className='text-center'>
        🔄 Ingresa la secuencia en orden inverso
      </ThemedText>
      <ThemedText type='default' className='text-center'>
        📊 Progreso: {game.progress.inputProgress}
      </ThemedText>
      <ThemedView className='my-8'>
        <TextInput
          value={inputValue}
          onChangeText={handleInputChange}
          className='border-2 border-gray-300 rounded-lg p-3 text-lg text-center mb-4 bg-white'
          keyboardType='numeric'
          maxLength={game.sequence.length}
          placeholder={`Introduce ${game.sequence.length} dígitos`}
          placeholderTextColor='#666'
          autoFocus
          editable={!game.isPaused}
        />
        <ThemedText
          type='default'
          className='text-center text-base tracking-seq mb-2'>
          📝 Tu secuencia: {game.userSequence.join(' ') || '---'}
        </ThemedText>
        <ThemedText type='default' className='text-center text-sm opacity-60'>
          💡 Secuencia original tenía {game.sequence.length} dígitos
        </ThemedText>
      </ThemedView>
      <ThemedView className='flex-row justify-around my-5 gap-4'>
        <Button onPress={game.togglePause} disabled={game.matches('finished')}>
          {game.isPaused ? '▶️ Reanudar' : '⏸️ Pausar'}
        </Button>
        <Button
          onPress={handleSubmit}
          disabled={!game.isSequenceComplete || game.isPaused}>
          ✅ Confirmar
        </Button>
      </ThemedView>
      <ThemedView className='bg-overlay-light p-3 rounded-lg mt-4'>
        <ThemedText type='default' className='text-center'>
          📊 Nivel: {game.currentLevel} | 🏆 Puntuación: {game.score}
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
  const result = game.lastResult
  if (!result)
    return <ErrorScreen game={game} error='No hay resultado disponible' />
  const isCorrect = result.isCorrect
  return (
    <ThemedView className='flex-1 p-5 justify-center'>
      <ThemedText
        type='title'
        className={`text-center ${isCorrect ? 'text-success' : 'text-error'}`}>
        {isCorrect ? '🎉 ¡Correcto!' : '❌ Incorrecto'}
      </ThemedText>
      <ThemedView className='bg-overlay-medium p-4 rounded-lg my-5 space-y-2'>
        <ThemedText type='defaultSemiBold'>
          📊 Resultados de la ronda:
        </ThemedText>
        <ThemedText type='default'>
          🔢 Secuencia original: {game.sequence.join(' ')}
        </ThemedText>
        <ThemedText type='default'>
          ✅ Secuencia correcta (inversa): {result.correctSequence.join(' ')}
        </ThemedText>
        <ThemedText type='default'>
          📝 Tu respuesta: {result.userInput.join(' ') || 'Sin respuesta'}
        </ThemedText>
        {isCorrect && (
          <>
            <ThemedText type='default' className='text-bonus font-medium'>
              🏆 Puntos de ronda: {result.roundScore}
            </ThemedText>
            <ThemedText type='default' className='text-bonus font-medium'>
              ⚡ Bonus de tiempo: {result.timeBonus}
            </ThemedText>
          </>
        )}
      </ThemedView>
      <ThemedText type='subtitle' className='text-center'>
        🏆 Puntuación total: {game.score}
      </ThemedText>
      <ThemedView className='flex-row justify-around my-5 gap-4'>
        <Button onPress={game.nextRound}>
          {isCorrect ? '🎯 Siguiente Ronda' : '🔄 Reintentar'}
        </Button>
        <Button onPress={game.newGame}>🆕 Nuevo Juego</Button>
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
  const errorMessage = error || game.context.error || 'Error inesperado'
  return (
    <ThemedView className='flex-1 justify-center items-center p-5'>
      <ThemedText type='title' className='text-error'>
        ⚠️ Error
      </ThemedText>
      <ThemedText className='text-center'>{errorMessage}</ThemedText>
      <ThemedView className='mt-5'>
        <Button onPress={game.newGame}>🔄 Reiniciar Juego</Button>
      </ThemedView>
    </ThemedView>
  )
}

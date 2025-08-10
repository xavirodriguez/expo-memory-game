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
import { Alert, StyleSheet, TextInput } from 'react-native'

// Tipos para parámetros de ruta seguros
interface RouteParams {
  readonly level?: string | string[]
}

// Función pura para parsear level de forma segura
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

  // Handler para completar el juego - función pura
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

  // Efecto para manejar completación del juego
  useEffect(() => {
    if (game.matches('finished') && game.lastResult) {
      // Pequeño delay para que la UI se actualice
      const timer = setTimeout(handleGameComplete, 100)
      return () => clearTimeout(timer)
    }
  }, [game.matches('finished'), game.lastResult, handleGameComplete])

  // Wrapper con ErrorBoundary
  return (
    <ErrorBoundary
      onError={(error, errorInfo, errorId) => {
        console.error(`Game Error [${errorId}]:`, error, errorInfo)
      }}>
      <GameRouter game={game} levelParam={params.level} />
    </ErrorBoundary>
  )
}

// Router de componentes basado en estado
interface GameRouterProps {
  readonly game: ReturnType<typeof useMemoryGameMachine>
  readonly levelParam: string | string[] | undefined
}
// Router de componentes basado en estado - VERSIÓN CORREGIDA
interface GameRouterProps {
  readonly game: ReturnType<typeof useMemoryGameMachine>
  readonly levelParam: string | string[] | undefined
}

const GameRouter = ({ game, levelParam }: GameRouterProps) => {
  // DEBUG: Agregar logging para diagnosticar el estado actual
  console.log('🔍 GameRouter Debug:', {
    gameState: game.gameState,
    stateValue: typeof game.gameState,
    matches: {
      welcome: game.matches('welcome'),
      sequenceDisplay: game.matches('sequenceDisplay'),
      sequenceTransition: game.matches('sequenceTransition'),
      input: game.matches('input'),
      paused: game.matches('paused'),
      finished: game.matches('finished'),
      error: game.matches('error'),
    },
  })

  // Usar game.matches() que es más robusto para estados anidados
  if (game.matches('welcome')) {
    return <WelcomeScreen game={game} levelParam={levelParam} />
  }

  if (game.matches('sequenceDisplay')) {
    return <SequenceScreen game={game} />
  }

  if (game.matches('sequenceTransition')) {
    return <TransitionScreen game={game} />
  }

  if (game.matches('input')) {
    return <InputScreen game={game} />
  }

  if (game.matches('paused')) {
    return <InputScreen game={game} />
  }

  if (game.matches('finished')) {
    return <FinishedScreen game={game} />
  }

  if (game.matches('error')) {
    return <ErrorScreen game={game} />
  }

  // Fallback mejorado con más información de debug
  console.error('🚨 Estado no reconocido:', {
    gameState: game.gameState,
    stateType: typeof game.gameState,
    stateKeys: Object.keys(game.gameState || {}),
    contextLevel: game.context.currentLevel,
    contextRound: game.context.round,
  })

  return (
    <ErrorScreen
      game={game}
      error={`Estado desconocido: ${JSON.stringify(game.gameState)}`}
    />
  )
}
// Welcome Screen Component
interface WelcomeScreenProps {
  readonly game: ReturnType<typeof useMemoryGameMachine>
  readonly levelParam: string | string[] | undefined
}

const WelcomeScreen = ({ game, levelParam }: WelcomeScreenProps) => {
  const { t } = useTranslation()

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      {levelParam && (
        <ThemedView style={styles.levelIndicator}>
          <ThemedText type='subtitle'>
            🎮 Iniciando juego en nivel:{' '}
            {Array.isArray(levelParam) ? levelParam[0] : levelParam}
          </ThemedText>
        </ThemedView>
      )}

      <ThemedView style={styles.titleContainer}>
        <ThemedText type='title'>🧠 ¡Mejora tu memoria!</ThemedText>
        <ThemedText type='subtitle' style={styles.subtitle}>
          Versión XState Machine
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.description}>
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

      <ThemedView style={styles.buttonContainer}>
        <Button onPress={game.startGame}>🚀 Comenzar Juego</Button>
      </ThemedView>
    </ParallaxScrollView>
  )
}

// Sequence Display Screen
interface SequenceScreenProps {
  readonly game: ReturnType<typeof useMemoryGameMachine>
}

const SequenceScreen = ({ game }: SequenceScreenProps) => {
  return (
    <ThemedView style={styles.sequenceContainer}>
      <ThemedText type='title' style={styles.centeredText}>
        🎯 Memoriza la secuencia
      </ThemedText>

      <ThemedText type='subtitle' style={styles.centeredText}>
        {game.progress.sequenceProgress}
      </ThemedText>

      <ThemedView style={styles.digitDisplay}>
        {game.currentDigit >= 0 ? (
          <ThemedText type='title' style={styles.largeDigit}>
            {game.currentDigit}
          </ThemedText>
        ) : (
          <ThemedText type='subtitle' style={styles.preparingText}>
            ⏳ Preparando...
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.gameInfo}>
        <ThemedText type='default' style={styles.centeredText}>
          📊 Nivel: {game.currentLevel} | 🎯 Ronda: {game.round}
        </ThemedText>
        <ThemedText type='default' style={styles.centeredText}>
          🏆 Puntuación: {game.score}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  )
}

// Transition Screen (nuevo para XState)
interface TransitionScreenProps {
  readonly game: ReturnType<typeof useMemoryGameMachine>
}

const TransitionScreen = ({ game }: TransitionScreenProps) => {
  return (
    <ThemedView style={styles.transitionContainer}>
      <ThemedText type='title' style={styles.centeredText}>
        🔄 Preparando entrada...
      </ThemedText>

      <ThemedView style={styles.pulseContainer}>
        <ThemedText type='subtitle' style={styles.pulseText}>
          ⚡
        </ThemedText>
      </ThemedView>

      <ThemedText type='default' style={styles.centeredText}>
        Introduce la secuencia en orden inverso
      </ThemedText>
    </ThemedView>
  )
}

// Input Screen
interface InputScreenProps {
  readonly game: ReturnType<typeof useMemoryGameMachine>
}

const InputScreen = ({ game }: InputScreenProps) => {
  const [inputValue, setInputValue] = useState('')

  // Sincronizar input con userSequence del juego
  useEffect(() => {
    setInputValue(game.userSequence.join(''))
  }, [game.userSequence])

  const handleInputChange = useCallback(
    (text: string) => {
      const numericText = text.replace(/[^0-9]/g, '')

      if (numericText.length <= game.sequence.length) {
        const newSequence = numericText.split('').map(Number)
        const currentSequence = [...game.userSequence]

        // Determinar si agregar o quitar dígitos
        if (newSequence.length > currentSequence.length) {
          // Agregar dígitos nuevos
          for (let i = currentSequence.length; i < newSequence.length; i++) {
            game.addDigit(newSequence[i])
          }
        } else if (newSequence.length < currentSequence.length) {
          // Quitar dígitos
          const toRemove = currentSequence.length - newSequence.length
          for (let i = 0; i < toRemove; i++) {
            game.removeDigit()
          }
        }
      }
    },
    [game],
  )

  const handleSubmit = useCallback(() => {
    if (game.isSequenceComplete && !game.isPaused) {
      game.submitAnswer()
    }
  }, [game])

  return (
    <ThemedView style={styles.inputContainer}>
      <ThemedView style={styles.timeContainer}>
        <ThemedText
          type='title'
          style={[styles.timeText, game.timeLeft <= 10 && styles.timeWarning]}>
          ⏰ Tiempo: {game.timeLeft}s
        </ThemedText>

        {game.isPaused && (
          <ThemedText type='subtitle' style={styles.pausedText}>
            ⏸️ PAUSADO
          </ThemedText>
        )}
      </ThemedView>

      <ThemedText type='subtitle' style={styles.centeredText}>
        🔄 Ingresa la secuencia en orden inverso
      </ThemedText>

      <ThemedText type='default' style={styles.centeredText}>
        📊 Progreso: {game.progress.inputProgress}
      </ThemedText>

      <ThemedView style={styles.inputSection}>
        <TextInput
          value={inputValue}
          onChangeText={handleInputChange}
          style={styles.textInput}
          keyboardType='numeric'
          maxLength={game.sequence.length}
          placeholder={`Introduce ${game.sequence.length} dígitos`}
          placeholderTextColor='#666'
          autoFocus
          editable={!game.isPaused}
        />

        <ThemedText type='default' style={styles.sequenceDisplay}>
          📝 Tu secuencia: {game.userSequence.join(' ') || '---'}
        </ThemedText>

        <ThemedText type='default' style={styles.hintText}>
          💡 Secuencia original tenía {game.sequence.length} dígitos
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.buttonRow}>
        <Button onPress={game.togglePause} disabled={game.matches('finished')}>
          {game.isPaused ? '▶️ Reanudar' : '⏸️ Pausar'}
        </Button>

        <Button
          onPress={handleSubmit}
          disabled={!game.isSequenceComplete || game.isPaused}>
          ✅ Confirmar
        </Button>
      </ThemedView>

      <ThemedView style={styles.gameInfo}>
        <ThemedText type='default' style={styles.centeredText}>
          📊 Nivel: {game.currentLevel} | 🏆 Puntuación: {game.score}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  )
}

// Finished Screen
interface FinishedScreenProps {
  readonly game: ReturnType<typeof useMemoryGameMachine>
}

const FinishedScreen = ({ game }: FinishedScreenProps) => {
  const result = game.lastResult

  if (!result) {
    return <ErrorScreen game={game} error='No hay resultado disponible' />
  }

  const isCorrect = result.isCorrect

  return (
    <ThemedView style={styles.finishedContainer}>
      <ThemedText
        type='title'
        style={[
          styles.centeredText,
          isCorrect ? styles.successText : styles.errorText,
        ]}>
        {isCorrect ? '🎉 ¡Correcto!' : '❌ Incorrecto'}
      </ThemedText>

      <ThemedView style={styles.resultSection}>
        <ThemedText type='defaultSemiBold' style={styles.resultTitle}>
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
            <ThemedText type='default' style={styles.bonusText}>
              🏆 Puntos de ronda: {result.roundScore}
            </ThemedText>
            <ThemedText type='default' style={styles.bonusText}>
              ⚡ Bonus de tiempo: {result.timeBonus}
            </ThemedText>
          </>
        )}
      </ThemedView>

      <ThemedText type='subtitle' style={styles.centeredText}>
        🏆 Puntuación total: {game.score}
      </ThemedText>

      <ThemedView style={styles.buttonRow}>
        <Button onPress={game.nextRound}>
          {isCorrect ? '🎯 Siguiente Ronda' : '🔄 Reintentar'}
        </Button>
        <Button onPress={game.newGame}>🆕 Nuevo Juego</Button>
      </ThemedView>
    </ThemedView>
  )
}

// Error Screen
interface ErrorScreenProps {
  readonly game: ReturnType<typeof useMemoryGameMachine>
  readonly error?: string
}

const ErrorScreen = ({ game, error }: ErrorScreenProps) => {
  const errorMessage = error || game.context.error || 'Error inesperado'

  return (
    <ThemedView style={styles.errorContainer}>
      <ThemedText type='title' style={styles.errorText}>
        ⚠️ Error
      </ThemedText>
      <ThemedText style={styles.centeredText}>{errorMessage}</ThemedText>

      <ThemedView style={styles.buttonContainer}>
        <Button onPress={game.newGame}>🔄 Reiniciar Juego</Button>
      </ThemedView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  description: {
    gap: 8,
    marginBottom: 16,
  },
  levelIndicator: {
    backgroundColor: 'rgba(161, 206, 220, 0.3)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },

  // Sequence Screen
  sequenceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  digitDisplay: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    backgroundColor: 'rgba(161, 206, 220, 0.2)',
    marginVertical: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  largeDigit: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  preparingText: {
    fontSize: 16,
    opacity: 0.7,
  },

  // Transition Screen
  transitionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pulseContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
    marginVertical: 30,
  },
  pulseText: {
    fontSize: 32,
  },

  // Input Screen
  inputContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  timeWarning: {
    color: '#ff6b6b',
  },
  pausedText: {
    color: '#ffa726',
    marginTop: 8,
  },
  inputSection: {
    marginVertical: 30,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  sequenceDisplay: {
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 4,
    marginBottom: 8,
  },
  hintText: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    gap: 16,
  },

  // Finished Screen
  finishedContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  resultSection: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 16,
    borderRadius: 8,
    marginVertical: 20,
    gap: 8,
  },
  resultTitle: {
    marginBottom: 8,
  },
  successText: {
    color: '#4caf50',
  },
  errorText: {
    color: '#f44336',
  },
  bonusText: {
    color: '#2196f3',
    fontWeight: '500',
  },

  // Error Screen
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  // Game Info
  gameInfo: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },

  // Common
  centeredText: {
    textAlign: 'center',
  },
})

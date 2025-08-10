import ParallaxScrollView from '@/components/ParallaxScrollView'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useMemoryGame } from '@/hooks/useMemoryGame'
import { Button } from '@react-navigation/elements'
import { Image } from 'expo-image'
import { useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, StyleSheet, TextInput } from 'react-native'

export default function NReverseScreen() {
  const { level: levelParam } = useLocalSearchParams()
  const initialLevel = levelParam ? parseInt(levelParam as string, 10) || 1 : 1

  const game = useMemoryGame(3, initialLevel, {
    INPUT_TIME_LIMIT: 30,
    SEQUENCE_DISPLAY_TIME: 1200,
  })

  const handleGameComplete = useCallback(
    (result: any) => {
      if (result.isCorrect) {
        Alert.alert(
          '¡Correcto!',
          `Puntuación de esta ronda: ${result.roundScore}`,
          [{ text: 'Siguiente Ronda', onPress: () => game.startRound() }],
        )
      } else {
        Alert.alert(
          'Incorrecto',
          `Secuencia correcta: ${result.correctSequence.join(' ')}`,
          [
            { text: 'Reintentar', onPress: () => game.startRound() },
            { text: 'Nuevo Juego', onPress: () => game.startNewGame() },
          ],
        )
      }
    },
    [game],
  )

  // Route to appropriate screen based on game state
  switch (game.gameState) {
    case 'welcome':
      return <WelcomeScreen game={game} levelParam={levelParam} />

    case 'sequence':
      return <SequenceScreen game={game} />

    case 'input':
      return <InputScreen game={game} />

    case 'finished':
      return <FinishedScreen game={game} onComplete={handleGameComplete} />

    default:
      return <ErrorScreen onRestart={game.startNewGame} />
  }
}

// Welcome Screen Component
type WelcomeScreenProps = {
  game: ReturnType<typeof useMemoryGame>
  levelParam: string | string[] | undefined
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
            Iniciando juego en nivel: {levelParam}
          </ThemedText>
        </ThemedView>
      )}

      <ThemedView style={styles.titleContainer}>
        <ThemedText type='title'>¡Mejora tu memoria!</ThemedText>
      </ThemedView>

      <ThemedView style={styles.description}>
        <ThemedText>{t('welcome')}</ThemedText>
        <ThemedText>{t('nreverse.description')}</ThemedText>
        <ThemedText type='defaultSemiBold'>
          Nivel actual: {game.currentLevel} | Longitud de secuencia:{' '}
          {game.currentSequenceLength}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.buttonContainer}>
        <Button onPress={game.startRound}>Comenzar Juego</Button>
      </ThemedView>
    </ParallaxScrollView>
  )
}

// Sequence Display Screen
type SequenceScreenProps = {
  game: ReturnType<typeof useMemoryGame>
}

const SequenceScreen = ({ game }: SequenceScreenProps) => {
  return (
    <ThemedView style={styles.sequenceContainer}>
      <ThemedText type='title' style={styles.centeredText}>
        Memoriza la secuencia
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
            Preparando...
          </ThemedText>
        )}
      </ThemedView>

      <ThemedText type='default' style={styles.centeredText}>
        Nivel: {game.currentLevel} | Ronda: {game.round}
      </ThemedText>
    </ThemedView>
  )
}

// Input Screen
type InputScreenProps = {
  game: ReturnType<typeof useMemoryGame>
}

const InputScreen = ({ game }: InputScreenProps) => {
  const [inputValue, setInputValue] = useState('')

  // Update input value when user sequence changes
  useEffect(() => {
    console.log('Aqui')
    setInputValue(game.userSequence.join(''))
  }, [game.userSequence])

  const handleInputChange = useCallback(
    (text: string) => {
      const numericText = text.replace(/[^0-9]/g, '')

      if (numericText.length <= game.sequence.length) {
        setInputValue(numericText)

        // Update game state
        const newSequence = numericText.split('').map(Number)

        // Clear current sequence and rebuild
        while (game.userSequence.length > 0) {
          game.removeLastDigit()
        }

        // Add new digits
        newSequence.forEach(digit => {
          game.addDigitToUserSequence(digit)
        })
      }
    },
    [game],
  )

  const handleSubmit = useCallback(() => {
    if (game.userSequence.length === game.sequence.length) {
      game.submitAnswer(game.userSequence)
    }
  }, [game])

  return (
    <ThemedView style={styles.inputContainer}>
      <ThemedView style={styles.timeContainer}>
        <ThemedText
          type='title'
          style={[styles.timeText, game.timeLeft <= 10 && styles.timeWarning]}>
          Tiempo: {game.timeLeft}s
        </ThemedText>

        {game.isPaused && (
          <ThemedText type='subtitle' style={styles.pausedText}>
            PAUSADO
          </ThemedText>
        )}
      </ThemedView>

      <ThemedText type='subtitle' style={styles.centeredText}>
        Ingresa la secuencia en orden inverso
      </ThemedText>

      <ThemedText type='default' style={styles.centeredText}>
        Progreso: {game.progress.inputProgress}
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
        />

        <ThemedText type='default' style={styles.sequenceDisplay}>
          Tu secuencia: {game.userSequence.join(' ') || '---'}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.buttonRow}>
        <Button
          onPress={game.togglePause}
          disabled={game.gameState !== 'input'}>
          {game.isPaused ? 'Reanudar' : 'Pausar'}
        </Button>

        <Button
          onPress={handleSubmit}
          disabled={!game.isSequenceComplete || game.isPaused}>
          Confirmar
        </Button>
      </ThemedView>

      <ThemedText type='default' style={styles.centeredText}>
        Nivel: {game.currentLevel} | Puntuación: {game.score}
      </ThemedText>
    </ThemedView>
  )
}

// Finished Screen
type FinishedScreenProps = {
  game: ReturnType<typeof useMemoryGame>
  onComplete: (result: any) => void
}

const FinishedScreen = ({ game, onComplete }: FinishedScreenProps) => {
  const { t } = useTranslation()

  useEffect(() => {
    // Auto-calculate result when screen mounts
    const result = {
      isCorrect:
        game.userSequence.length === game.correctSequence.length &&
        game.userSequence.every(
          (digit, index) => digit === game.correctSequence[index],
        ),
      correctSequence: game.correctSequence,
      userInput: game.userSequence,
      roundScore: 0, // This would be calculated in submitAnswer
    }

    onComplete(result)
  }, [game, onComplete])

  const isCorrect =
    game.userSequence.length === game.correctSequence.length &&
    game.userSequence.every(
      (digit, index) => digit === game.correctSequence[index],
    )

  return (
    <ThemedView style={styles.finishedContainer}>
      <ThemedText type='title' style={styles.centeredText}>
        {isCorrect ? '¡Correcto!' : 'Incorrecto'}
      </ThemedText>

      <ThemedView style={styles.resultSection}>
        <ThemedText type='default'>
          Secuencia original: {game.sequence.join(' ')}
        </ThemedText>
        <ThemedText type='default'>
          Secuencia correcta (inversa): {game.correctSequence.join(' ')}
        </ThemedText>
        <ThemedText type='default'>
          Tu respuesta: {game.userSequence.join(' ')}
        </ThemedText>
      </ThemedView>

      <ThemedText type='subtitle' style={styles.centeredText}>
        Puntuación total: {game.score}
      </ThemedText>

      <ThemedView style={styles.buttonRow}>
        <Button onPress={game.startRound}>Siguiente Ronda</Button>
        <Button onPress={game.startNewGame}>Nuevo Juego</Button>
      </ThemedView>
    </ThemedView>
  )
}

// Error Screen
type ErrorScreenProps = {
  onRestart: () => void
}

const ErrorScreen = ({ onRestart }: ErrorScreenProps) => (
  <ThemedView style={styles.errorContainer}>
    <ThemedText type='title'>Error</ThemedText>
    <ThemedText>Ha ocurrido un error inesperado</ThemedText>
    <Button onPress={onRestart}>Reiniciar</Button>
  </ThemedView>
)

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  },
  largeDigit: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  preparingText: {
    fontSize: 16,
    opacity: 0.7,
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

  // Error Screen
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  // Common
  centeredText: {
    textAlign: 'center',
  },
})

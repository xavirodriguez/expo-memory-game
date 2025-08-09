import ParallaxScrollView from '@/components/ParallaxScrollView'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useMemoryGame } from '@/hooks/useMemoryGame'
import { Button } from '@react-navigation/elements'
import { Image } from 'expo-image'
import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TextInput } from 'react-native'
export default function HomeScreen() {
  const {
    gameState,
    timeLeft,

    currentDigit,
    displayIndex,
    currentLength,
    userSequence,
    score,
    handlerStart,
  } = useMemoryGame(5, 1)

  const sequence = [0]
  const currentIndex = 0

  switch (gameState) {
    case 'welcome':
      return <Welcome start={handlerStart} />
    case 'sequence':
      return (
        <ScreenSequence
          currentDigit={currentDigit}
          index={displayIndex}
          length={currentLength}
        />
      )

    case 'input':
      return <ScreenInput timeLeft={timeLeft} />
    //return <ScreenInput timeLeft={timeLeft} onPause={togglePause} />;
    //case 'finished':
    //return <ScreenFinished score={score} onNextRound={startRound} />
    //return <ScreenFinished score={score} onNextRound={startRound} />;

    default:
      return null
  }
}
/**
 * WELCOME PAGE
 * @returns
 */
type WelcomeProps = {
  start: () => void
}
const Welcome = ({ start: handlerStart }: WelcomeProps) => {
  const { t } = useTranslation()
  const { level } = useLocalSearchParams()

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <>Iniciando juego en nivel: {level}</>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type='title'>Improve your memory!</ThemedText>
      </ThemedView>
      <ThemedView style={styles.description}>
        <ThemedText>{t('welcome')}</ThemedText>
        <ThemedText>{t('nreverse.description')}</ThemedText>
      </ThemedView>
      <Button onPress={handlerStart}> start </Button>
    </ParallaxScrollView>
  )
}
/**
 * Sequence - START GAME
 * @returns
 */
type ScreenSequenceProps = {
  currentDigit: number
  index: number
  length: number
}
const ScreenSequence = ({
  currentDigit,
  index,
  length,
}: ScreenSequenceProps) => {
  //{`${displayIndex + 1}/${sequence.length}`}
  return (
    <>
      <ThemedText>{`${index}/${length}`}</ThemedText>
    </>
  )
}
/**
 * Input - The user has to insert the sequence
 * @returns
 */
const ScreenInput = ({ timeLeft }: { timeLeft: number }) => {
  const [value, setValue] = useState<string>()

  return (
    <>
      <ThemedText type='title'>{`Tiempo restante: ${timeLeft}s`}</ThemedText>
      <ThemedText type='title'>
        Ingresa la secuencia en orden inverso:"
      </ThemedText>
      <ThemedText type='title'>text=userSequence.join(" ")</ThemedText>
      <TextInput
        value={value}
        onChangeText={text => {
          // Solo permitir números
          const numeric = text.replace(/[^0-9]/g, '')
          setValue(numeric)
        }}
        keyboardType='numeric' // Muestra teclado numérico
        maxLength={4} // Ejemplo: máximo 4 dígitos
        placeholder='Introduce un número'
      />
      <Button>text="Pausar" onTap=onTogglePause</Button>
    </>
  )
}
/**
 * Finish - Show results and start new round.
 * @returns
 */
const ScreenFinished = ({
  score,
  onStartNewRound,
}: {
  score: number
  onStartNewRound: () => void
}) => {
  const { t } = useTranslation()
  return (
    <>
      <ThemedText>
        {score > 0 ? t('nreverse.correct') : t('nreverse.wrong')}
      </ThemedText>
      <ThemedText>{t('game.score')}</ThemedText>
      <Button onPress={onStartNewRound}>{t('nreverse.next_round')}</Button>
    </>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  description: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
})

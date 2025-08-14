import ParallaxScrollView from '@/components/ParallaxScrollView'
import { ThemedView } from '@/components/ThemedView'
import GameButton from '@/components/atoms/GameButton'
import GameSubtitle from '@/components/atoms/GameSubtitle'
import GameTitle from '@/components/atoms/GameTitle'
import { useMemoryGameMachine } from '@/hooks/useMemoryGameMachine'
import { Image } from 'expo-image'
import { useTranslation } from 'react-i18next'

interface WelcomeScreenProps {
  game: ReturnType<typeof useMemoryGameMachine>
  levelParam: string | string[] | undefined
}

export default function WelcomeScreen({
  game,
  levelParam,
}: WelcomeScreenProps) {
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
          <GameSubtitle>
            {t('welcome.startLevel', {
              level: Array.isArray(levelParam) ? levelParam[0] : levelParam,
            })}
          </GameSubtitle>
        </ThemedView>
      )}
      <ThemedView className='items-center gap-2 mb-4'>
        <GameTitle>{t('welcome.title')}</GameTitle>
        <GameSubtitle className='text-sm italic opacity-70'>
          {t('welcome.subtitle')}
        </GameSubtitle>
      </ThemedView>
      <ThemedView className='gap-2 mb-4'>
        <GameSubtitle>{t('welcome.intro')}</GameSubtitle>
        <GameSubtitle>{t('nreverse.description')}</GameSubtitle>
        <GameSubtitle>
          {t('game.levelLength', {
            level: game.currentLevel,
            length: game.currentSequenceLength,
          })}
        </GameSubtitle>
        <GameSubtitle>
          {t('game.scoreRound', { score: game.score, round: game.round })}
        </GameSubtitle>
      </ThemedView>
      <ThemedView className='mt-5'>
        <GameButton onPress={game.startGame}>
          {t('buttons.startGame')}
        </GameButton>
      </ThemedView>
    </ParallaxScrollView>
  )
}

import GameSubtitle from '@/components/atoms/GameSubtitle'
import GameTitle from '@/components/atoms/GameTitle'
import { ThemedView } from '@/components/ThemedView'
import { useMemoryGameMachine } from '@/hooks/useMemoryGameMachine'
import { useTranslation } from 'react-i18next'

interface TransitionScreenProps {
  game: ReturnType<typeof useMemoryGameMachine>
}

export default function TransitionScreen({ game }: TransitionScreenProps) {
  const { t } = useTranslation()
  return (
    <ThemedView className='flex-1 justify-center items-center p-5'>
      <GameTitle className='text-center'>
        {t('transition.preparingInput')}
      </GameTitle>
      <ThemedView className='w-pulse h-pulse justify-center items-center rounded-pulse bg-overlay-pulse my-8'>
        <GameSubtitle className='text-pulse'>⚡</GameSubtitle>
      </ThemedView>
      <GameSubtitle className='text-center'>
        {t('transition.instruction')}
      </GameSubtitle>
    </ThemedView>
  )
}

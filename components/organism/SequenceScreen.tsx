import { ThemedView } from '@/components/ThemedView'
import GameDigit from '@/components/atoms/GameDigit'
import GameTitle from '@/components/atoms/GameTitle'
import ScoreBlock from '@/components/molecules/ScoreBlock'
import SequenceProgress from '@/components/molecules/SequenceProgress'
import { useMemoryGameMachine } from '@/hooks/useMemoryGameMachine'
import { useTranslation } from 'react-i18next'

interface SequenceScreenProps {
  game: ReturnType<typeof useMemoryGameMachine>
}

export default function SequenceScreen({ game }: SequenceScreenProps) {
  const { t } = useTranslation()
  return (
    <ThemedView className='flex-1 justify-center items-center p-5'>
      <GameTitle className='text-center'>{t('sequence.title')}</GameTitle>
      <SequenceProgress progress={game.progress.sequenceProgress} />
      <GameDigit
        digit={game.currentDigit}
        preparingText={t('sequence.preparing')}
      />
      <ScoreBlock
        level={game.currentLevel}
        score={game.score}
        round={game.round}
        t={t}
      />
    </ThemedView>
  )
}

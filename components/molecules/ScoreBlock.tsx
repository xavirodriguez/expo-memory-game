import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

export default function ScoreBlock({ level, score, round, t }) {
  return (
    <ThemedView className='bg-overlay-light p-3 rounded-lg mt-4'>
      <ThemedText type='default' className='text-center'>
        {t('game.levelRound', { level, round })}
      </ThemedText>
      <ThemedText type='default' className='text-center'>
        {t('game.score', { score })}
      </ThemedText>
    </ThemedView>
  )
}

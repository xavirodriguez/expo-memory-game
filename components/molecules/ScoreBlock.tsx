import { ThemedText } from '@/components/atoms/ThemedText'
import { ThemedView } from '@/components/atoms/ThemedView'
type ScoreBlockProps = {
  level: number
  score: number
  round: number
  t: (key: string, options?: any) => string
}

export default function ScoreBlock({
  level,
  score,
  round,
  t,
}: ScoreBlockProps) {
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

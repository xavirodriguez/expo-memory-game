import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
type ScorePanelProps = {
  level: number
  score: number
  round: number
}

export default function ScorePanel({ level, score, round }: ScorePanelProps) {
  return (
    <ThemedView className='bg-overlay-light p-3 rounded-lg mt-4'>
      <ThemedText type='default' className='text-center'>
        Level: {level} | Round: {round}
      </ThemedText>
      <ThemedText type='default' className='text-center'>
        Score: {score}
      </ThemedText>
    </ThemedView>
  )
}

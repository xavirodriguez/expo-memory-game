import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
type GameResult = {
  isCorrect: boolean
  roundScore?: number
  timeBonus?: number
  correctSequence?: readonly number[]
  userInput?: readonly number[]
  [key: string]: any
}

type ResultBlockProps = {
  result: GameResult | null | undefined
  game: any // Cambia esto si tienes un tipo específico para game
  t: (key: string, options?: any) => string
}

export default function ResultBlock({ result, game, t }: ResultBlockProps) {
  const isCorrect = result.isCorrect
  return (
    <ThemedView className='bg-overlay-medium p-4 rounded-lg my-5 space-y-2'>
      <ThemedText type='defaultSemiBold'>{t('finished.results')}</ThemedText>
      <ThemedText type='default'>
        {t('finished.originalSequence', {
          sequence: game.sequence.join(' '),
        })}
      </ThemedText>
      <ThemedText type='default'>
        {t('finished.correctSequence', {
          sequence: result.correctSequence.join(' '),
        })}
      </ThemedText>
      <ThemedText type='default'>
        {t('finished.userInput', {
          sequence: result.userInput.join(' ') || t('finished.noAnswer'),
        })}
      </ThemedText>
      {isCorrect && (
        <>
          <ThemedText type='default' className='text-bonus font-medium'>
            {t('finished.roundPoints', { points: result.roundScore })}
          </ThemedText>
          <ThemedText type='default' className='text-bonus font-medium'>
            {t('finished.timeBonus', { bonus: result.timeBonus })}
          </ThemedText>
        </>
      )}
    </ThemedView>
  )
}

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

export default function ResultPanel({ result, t }) {
  const isCorrect = result?.isCorrect
  return (
    <ThemedView className='bg-overlay-medium p-4 rounded-lg my-5 space-y-2'>
      <ThemedText type='defaultSemiBold'>{t('finished.results')}</ThemedText>
      <ThemedText type='default'>
        {t('finished.originalSequence', {
          sequence: result?.originalSequence?.join(' '),
        })}
      </ThemedText>
      <ThemedText type='default'>
        {t('finished.correctSequence', {
          sequence: result?.correctSequence?.join(' '),
        })}
      </ThemedText>
      <ThemedText type='default'>
        {t('finished.userInput', {
          sequence: result?.userInput?.join(' ') || t('finished.noAnswer'),
        })}
      </ThemedText>
      {isCorrect && (
        <>
          <ThemedText type='default' className='text-bonus font-medium'>
            {t('finished.roundPoints', { points: result?.roundScore })}
          </ThemedText>
          <ThemedText type='default' className='text-bonus font-medium'>
            {t('finished.timeBonus', { bonus: result?.timeBonus })}
          </ThemedText>
        </>
      )}
    </ThemedView>
  )
}

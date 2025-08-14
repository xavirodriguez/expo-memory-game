import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import GameButton from '../atoms/GameButton'

export default function ErrorBlock({ errorMessage, onRestart, t }) {
  return (
    <ThemedView className='flex-1 justify-center items-center p-5'>
      <ThemedText type='title' className='text-error'>
        {t('errors.title')}
      </ThemedText>
      <ThemedText className='text-center'>{errorMessage}</ThemedText>
      <ThemedView className='mt-5'>
        <GameButton onPress={onRestart}>{t('buttons.restart')}</GameButton>
      </ThemedView>
    </ThemedView>
  )
}

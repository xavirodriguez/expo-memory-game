import { ThemedView } from '@/components/ThemedView'
import GameButton from '../atoms/GameButton'
import GameInput from '../atoms/GameInput'
import UserSequence from '../molecules/UserSequence'

export default function InputPanel({
  inputValue,
  onInputChange,
  sequenceLength,
  t,
  userSequence,
  originalLength,
  paused,
  onPause,
  onSubmit,
  canSubmit,
}) {
  return (
    <ThemedView className='my-8'>
      <GameInput
        value={inputValue}
        onChangeText={onInputChange}
        maxLength={sequenceLength}
        placeholder={t('input.placeholder', { length: sequenceLength })}
        placeholderTextColor='#666'
        autoFocus
        editable={!paused}
      />
      <UserSequence sequence={userSequence} t={t} />
      <ThemedView className='flex-row justify-around my-5 gap-4'>
        <GameButton onPress={onPause}>
          {paused ? t('buttons.resume') : t('buttons.pause')}
        </GameButton>
        <GameButton onPress={onSubmit} disabled={!canSubmit || paused}>
          {t('buttons.confirm')}
        </GameButton>
      </ThemedView>
      <ThemedView>
        <UserSequence sequence={userSequence} t={t} />
        <ThemedView className='text-center text-sm opacity-60'>
          {t('input.originalLength', { length: originalLength })}
        </ThemedView>
      </ThemedView>
    </ThemedView>
  )
}

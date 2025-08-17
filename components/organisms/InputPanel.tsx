import GameButton from '@/components/atoms/GameButton'
import GameInput from '@/components/atoms/GameInput'
import { ThemedView } from '@/components/atoms/ThemedView'
import UserSequence from '@/components/molecules/UserSequence'
interface InputPanelProps {
  inputValue: string
  onInputChange: (value: string) => void
  sequenceLength: number
  t: (key: string, options?: any) => string
  userSequence: number[]
  originalLength: number
  paused: boolean
  onPause: () => void
  onSubmit: () => void
  canSubmit: boolean
}
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
}: InputPanelProps) {
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

import { ThemedText } from '@/components/atoms/ThemedText'
type UserSequenceProps = {
  sequence: readonly number[]
  t: (key: string, options?: any) => string
}

export default function UserSequence({ sequence, t }: UserSequenceProps) {
  return (
    <ThemedText
      type='default'
      className='text-center text-base tracking-seq mb-2'>
      {t('input.userSequence', {
        sequence: sequence.length ? sequence.join(' ') : '---',
      })}
    </ThemedText>
  )
}

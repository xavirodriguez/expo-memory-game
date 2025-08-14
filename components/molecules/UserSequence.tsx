import { ThemedText } from '@/components/ThemedText'

export default function UserSequence({ sequence, t }) {
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

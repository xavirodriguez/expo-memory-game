import { ThemedText } from '@/components/ThemedText'

export default function UserSequenceDisplay({ userSequence, placeholder }) {
  return (
    <ThemedText
      type='default'
      className='text-center text-base tracking-seq mb-2'>
      {userSequence.length ? userSequence.join(' ') : placeholder || '---'}
    </ThemedText>
  )
}

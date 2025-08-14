import { ThemedText } from '@/components/ThemedText'
type UserSequenceDisplayProps = {
  userSequence: readonly number[]
  placeholder?: string
}

export default function UserSequenceDisplay({
  userSequence,
  placeholder,
}: UserSequenceDisplayProps) {
  return (
    <ThemedText
      type='default'
      className='text-center text-base tracking-seq mb-2'>
      {userSequence.length ? userSequence.join(' ') : placeholder || '---'}
    </ThemedText>
  )
}

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
type GameDigitDisplayProps = {
  digit: number | null
  preparingText?: string
}
export default function GameDigitDisplay({
  digit,
  preparingText,
}: GameDigitDisplayProps) {
  return (
    <ThemedView className='w-digit h-digit justify-center items-center rounded-digit bg-overlay-blue my-10 shadow'>
      {digit >= 0 ? (
        <ThemedText type='title' className='text-digit-lg font-bold'>
          {digit}
        </ThemedText>
      ) : (
        <ThemedText type='subtitle' className='text-digit-sm opacity-70'>
          {preparingText}
        </ThemedText>
      )}
    </ThemedView>
  )
}

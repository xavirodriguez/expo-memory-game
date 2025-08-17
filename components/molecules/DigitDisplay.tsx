import { ThemedView } from '@/components/atoms/ThemedView'
import React from 'react'
import GameText from '../atoms/GameText'

type DigitDisplayProps = {
  digit: number | null
  isPreparing?: boolean
  preparingText?: string
}

const DigitDisplay: React.FC<DigitDisplayProps> = ({
  digit,
  isPreparing = false,
  preparingText = '...',
}) => (
  <ThemedView className='w-28 h-28 justify-center items-center rounded-full bg-blue-100 dark:bg-blue-800 my-8 shadow-lg'>
    {isPreparing || digit === null ? (
      <GameText type='subtitle' className='text-2xl opacity-70'>
        {preparingText}
      </GameText>
    ) : (
      <GameText type='title' className='text-5xl font-bold'>
        {digit}
      </GameText>
    )}
  </ThemedView>
)

export default DigitDisplay

import { ThemedView } from '@/components/atoms/ThemedView'
import React from 'react'
import GameText from '../atoms/GameText'

type ScoreBoardProps = {
  score: number
  round?: number
  totalRounds?: number
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  round,
  totalRounds,
}) => (
  <ThemedView className='bg-blue-50 dark:bg-blue-900 p-3 rounded-lg mt-4 items-center'>
    <GameText type='default' className='text-center'>
      Score:{' '}
      <GameText type='success' className='font-bold'>
        {score}
      </GameText>
    </GameText>
    {typeof round === 'number' && typeof totalRounds === 'number' && (
      <GameText type='default' className='text-center'>
        Round: {round} / {totalRounds}
      </GameText>
    )}
  </ThemedView>
)

export default ScoreBoard

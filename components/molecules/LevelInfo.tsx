import { ThemedView } from '@/components/ThemedView'
import React from 'react'
import GameText from '../atoms/GameText'

type LevelInfoProps = {
  level: number
  sequenceLength: number
}

const LevelInfo: React.FC<LevelInfoProps> = ({ level, sequenceLength }) => (
  <ThemedView className='bg-blue-100 dark:bg-blue-800 p-3 rounded-lg mb-4 items-center'>
    <GameText type='subtitle' className='mb-1'>
      Level {level}
    </GameText>
    <GameText type='default'>
      Sequence Length: <GameText type='success'>{sequenceLength}</GameText>
    </GameText>
  </ThemedView>
)

export default LevelInfo

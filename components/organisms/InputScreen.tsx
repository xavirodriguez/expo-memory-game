import { ThemedView } from '@/components/ThemedView'
import ScoreBlock from '@/components/molecules/ScoreBlock'
import TimerBlock from '@/components/molecules/TimerBlock'
import InputPanel from '@/components/organisms/InputPanel'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
interface InputScreenProps {
  game: ReturnType<
    typeof import('@/hooks/useMemoryGameMachine').useMemoryGameMachine
  >
}
export default function InputScreen({ game }: InputScreenProps) {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState('')
  useEffect(() => {
    setInputValue(game.userSequence.join(''))
  }, [game.userSequence])

  const handleInputChange = useCallback(
    (text: string) => {
      const numericText = text.replace(/[^0-9]/g, '')
      if (numericText.length <= game.sequence.length) {
        const newSequence = numericText.split('').map(Number)
        const currentSequence = [...game.userSequence]
        if (newSequence.length > currentSequence.length) {
          for (let i = currentSequence.length; i < newSequence.length; i++) {
            game.addDigit(newSequence[i])
          }
        } else if (newSequence.length < currentSequence.length) {
          for (
            let i = 0;
            i < currentSequence.length - newSequence.length;
            i++
          ) {
            game.removeDigit()
          }
        }
      }
    },
    [game],
  )

  const handleSubmit = useCallback(() => {
    if (game.isSequenceComplete && !game.isPaused) game.submitAnswer()
  }, [game])

  return (
    <ThemedView className='flex-1 p-5 justify-center'>
      <TimerBlock
        timeLeft={game.timeLeft}
        warning={game.timeLeft <= 10}
        paused={game.isPaused}
        t={t}
      />
      <InputPanel
        inputValue={inputValue}
        onInputChange={handleInputChange}
        sequenceLength={game.sequence.length}
        t={t}
        userSequence={game.userSequence}
        originalLength={game.sequence.length}
        paused={game.isPaused}
        onPause={game.togglePause}
        onSubmit={handleSubmit}
        canSubmit={game.isSequenceComplete}
      />
      <ScoreBlock
        level={game.currentLevel}
        score={game.score}
        round={game.round}
        t={t}
      />
    </ThemedView>
  )
}

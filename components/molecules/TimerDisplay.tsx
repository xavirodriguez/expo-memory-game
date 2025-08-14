import GameTitle from '../atoms/GameTitle'
type TimerDisplayProps = {
  timeLeft: number
  warning?: boolean
  pausedText?: string
}
export default function TimerDisplay({
  timeLeft,
  warning,
  pausedText,
}: TimerDisplayProps) {
  return (
    <>
      <GameTitle className={warning ? 'text-danger' : ''}>
        {pausedText ? pausedText : timeLeft}
      </GameTitle>
    </>
  )
}

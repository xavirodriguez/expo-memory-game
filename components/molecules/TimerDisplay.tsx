import GameTitle from '../atoms/GameTitle'

export default function TimerDisplay({ timeLeft, warning, pausedText }) {
  return (
    <>
      <GameTitle className={warning ? 'text-danger' : ''}>
        {pausedText ? pausedText : timeLeft}
      </GameTitle>
    </>
  )
}

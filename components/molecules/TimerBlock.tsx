import GameSubtitle from '../atoms/GameSubtitle'
import GameTitle from '../atoms/GameTitle'
type TimerBlockProps = {
  timeLeft: number
  warning?: boolean
  paused?: boolean
  t: (key: string, options?: any) => string
}

export default function TimerBlock({
  timeLeft,
  warning,
  paused,
  t,
}: TimerBlockProps) {
  return (
    <>
      <GameTitle className={warning ? 'text-danger' : ''}>
        {t('input.timeLeft', { seconds: timeLeft })}
      </GameTitle>
      {paused && (
        <GameSubtitle className='text-warning mt-2'>
          {t('input.paused')}
        </GameSubtitle>
      )}
    </>
  )
}

import GameSubtitle from '../atoms/GameSubtitle'
import GameTitle from '../atoms/GameTitle'

export default function TimerBlock({ timeLeft, warning, paused, t }) {
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

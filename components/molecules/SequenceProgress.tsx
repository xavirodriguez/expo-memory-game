import GameSubtitle from '../atoms/GameSubtitle'

export default function SequenceProgress({ progress }) {
  return <GameSubtitle className='text-center'>{progress}</GameSubtitle>
}

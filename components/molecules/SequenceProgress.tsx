import GameSubtitle from '../atoms/GameSubtitle'
type SequenceProgressProps = {
  progress: number
}
export default function SequenceProgress({ progress }: SequenceProgressProps) {
  return <GameSubtitle className='text-center'>{progress}</GameSubtitle>
}

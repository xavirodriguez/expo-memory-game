import { ThemedText } from '@/components/atoms/ThemedText'
import { ReactNode } from 'react'
type GameSubtitleProps = {
  children: ReactNode
  className?: string
  [key: string]: any
}
export default function GameSubtitle({
  children,
  className = '',
  ...props
}: GameSubtitleProps) {
  return (
    <ThemedText
      type='subtitle'
      className={`text-base opacity-70 ${className}`}
      {...props}>
      {children}
    </ThemedText>
  )
}

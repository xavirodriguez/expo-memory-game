import { ThemedText } from '@/components/atoms/ThemedText'
import { ReactNode } from 'react'
type GameTitleProps = {
  children: ReactNode
  className?: string
  [key: string]: any
}

export default function GameTitle({
  children,
  className = '',
  ...props
}: GameTitleProps) {
  return (
    <ThemedText
      type='title'
      className={`text-2xl font-bold ${className}`}
      {...props}>
      {children}
    </ThemedText>
  )
}

import { ThemedText } from '@/components/ThemedText'

export default function GameSubtitle({ children, className = '', ...props }) {
  return (
    <ThemedText
      type='subtitle'
      className={`text-base opacity-70 ${className}`}
      {...props}>
      {children}
    </ThemedText>
  )
}

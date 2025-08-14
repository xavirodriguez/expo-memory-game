import { ThemedText } from '@/components/ThemedText'

export default function GameTitle({ children, className = '', ...props }) {
  return (
    <ThemedText
      type='title'
      className={`text-2xl font-bold ${className}`}
      {...props}>
      {children}
    </ThemedText>
  )
}

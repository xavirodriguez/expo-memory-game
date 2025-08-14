import React from 'react'
import { Text, TextProps } from 'react-native'

type GameTextProps = TextProps & {
  type?: 'title' | 'subtitle' | 'default' | 'warning' | 'success' | 'error'
  children: React.ReactNode
}

const typeClasses: Record<string, string> = {
  title: 'text-2xl font-bold text-center text-blue-800 dark:text-blue-300',
  subtitle: 'text-lg italic text-slate-600 dark:text-slate-300 text-center',
  warning: 'text-orange-500',
  success: 'text-green-600',
  error: 'text-red-500',
  default: 'text-base text-slate-800 dark:text-slate-100',
}

export const GameText: React.FC<GameTextProps> = ({
  type = 'default',
  style,
  children,
  ...props
}) => {
  return (
    <Text
      {...props}
      className={[typeClasses[type], (props.className as string) || ''].join(
        ' ',
      )}>
      {children}
    </Text>
  )
}

export default GameText

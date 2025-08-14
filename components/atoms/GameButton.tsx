import React from 'react'
import { Pressable, PressableProps, Text } from 'react-native'

type GameButtonProps = PressableProps & {
  variant?: 'primary' | 'secondary' | 'danger'
  children: React.ReactNode
}

const variantClasses: Record<string, string> = {
  primary: 'bg-blue-600',
  secondary: 'bg-slate-500',
  danger: 'bg-red-500',
}

export const GameButton: React.FC<GameButtonProps> = ({
  variant = 'primary',
  children,
  disabled,
  ...props
}) => {
  return (
    <Pressable
      accessibilityRole='button'
      className={[
        'rounded-lg py-3 px-6 my-1 min-w-[120px] items-center',
        variantClasses[variant],
        disabled ? 'opacity-50' : '',
      ].join(' ')}
      disabled={disabled}
      {...props}>
      {typeof children === 'string' ? (
        <Text className='text-white font-bold text-base'>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  )
}

export default GameButton

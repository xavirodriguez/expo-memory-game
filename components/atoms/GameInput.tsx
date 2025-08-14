import React from 'react'
import { TextInput, TextInputProps } from 'react-native'

type GameInputProps = TextInputProps & {
  error?: boolean
}

export const GameInput: React.FC<GameInputProps> = ({
  error,
  className,
  ...props
}) => (
  <TextInput
    {...props}
    className={[
      'border-2 rounded-lg p-3 text-lg text-center my-2 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700',
      error ? 'border-red-500 bg-red-50 dark:bg-red-900' : '',
      className ?? '',
    ].join(' ')}
    keyboardType='numeric'
    autoCorrect={false}
    autoCapitalize='none'
  />
)

export default GameInput

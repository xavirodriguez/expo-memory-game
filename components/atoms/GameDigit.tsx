import React from 'react'
import { Text, View } from 'react-native'
import { useTailwind } from 'tailwind-rn'

type GameDigitProps = {
  digit: number | null
  style?: object
}

export default function GameDigit({ digit, style }: GameDigitProps) {
  const tailwind = useTailwind()
  return (
    <View style={[tailwind('items-center justify-center p-2'), style]}>
      {digit !== null && digit >= 0 ? (
        <Text style={tailwind('text-4xl font-bold text-gray-800')}>
          {digit}
        </Text>
      ) : (
        <Text style={tailwind('text-4xl font-bold text-gray-400 opacity-50')}>
          ?
        </Text>
      )}
    </View>
  )
}

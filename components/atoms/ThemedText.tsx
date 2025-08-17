import { Text, type TextProps } from 'react-native'

import { useThemeColor } from '@/hooks/useThemeColor'

export type ThemedTextProps = TextProps & {
  lightColor?: string
  darkColor?: string
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link'
}

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  //todo refactor darktheme/ light
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')

  return (
    <Text
      className={
        'text-base leading-6 font-normal dark:text-white text-gray-900 dark:bg-gray-800' +
        (type === 'title' ? ' text-2xl font-bold' : '') +
        (type === 'defaultSemiBold' ? ' font-semibold' : '') +
        (type === 'subtitle' ? ' text-lg font-bold' : '') +
        (type === 'link' ? ' text-blue-600 underline' : '') +
        (type === 'default' ? ' text-base font-normal' : '')
      }
      {...rest}
    />
  )
}

import { useState } from 'react'
// ejemplo en StorybookToggle.tsx
import { Platform, Pressable, Text, View } from 'react-native'

let StorybookUIRoot: any = null
if (__DEV__ && Platform.OS !== 'web') {
  StorybookUIRoot = require('../.rnstorybook').default
}

interface Props {
  children: React.ReactNode
}

export function StorybookToggle({ children }: Props) {
  const [showStorybook, setShowStorybook] = useState(false)

  // Solo mostrar en desarrollo
  if (!__DEV__) {
    return <>{children}</>
  }

  if (showStorybook && StorybookUIRoot) {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            position: 'absolute',
            top: 50,
            right: 20,
            zIndex: 1000,
            backgroundColor: '#ff6b6b',
            padding: 8,
            borderRadius: 4,
          }}>
          <Pressable onPress={() => setShowStorybook(false)}>
            <Text style={{ color: 'white', fontSize: 12 }}>Exit Storybook</Text>
          </Pressable>
        </View>
        <StorybookUIRoot />
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          position: 'absolute',
          top: 50,
          right: 20,
          zIndex: 1000,
          backgroundColor: '#4ecdc4',
          padding: 8,
          borderRadius: 4,
        }}>
        <Pressable onPress={() => setShowStorybook(true)}>
          <Text style={{ color: 'white', fontSize: 12 }}>📚 Storybook</Text>
        </Pressable>
      </View>
      {children}
    </View>
  )
}

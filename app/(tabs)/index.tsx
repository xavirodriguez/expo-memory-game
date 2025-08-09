import { Image } from 'expo-image'
import { Button, StyleSheet } from 'react-native'

import ParallaxScrollView from '@/components/ParallaxScrollView'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
export default function HomeScreen() {
  const { t } = useTranslation()
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type='title'>{t('home.welcome')}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type='subtitle'>Section1</ThemedText>
        <Button
          title={t('home.game1')}
          onPress={() => router.push('/nreverse/nreverse')}
        />
        <Button
          title={t('home.game.level')}
          onPress={() =>
            router.push({
              pathname: '/nreverse/nreverse',
              params: { level: 'easy' },
            })
          }
        />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type='subtitle'>Section2</ThemedText>
        <Button
          title={t('home.game1')}
          onPress={() => router.push('/nreverse')}
        />
        <Button
          title={t('home.game1')}
          onPress={() => router.push('/nreverse')}
        />
      </ThemedView>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
})

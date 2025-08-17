import type { Meta, StoryObj } from '@storybook/react-native'
import { View } from 'react-native'
import InputScreen from '../../components/organisms/InputScreen'

// Mock del hook useMemoryGameMachine
const mockGame = {
  userSequence: [1, 2, 3],
  sequence: [1, 2, 3, 4, 5],
  timeLeft: 30,
  isPaused: false,
  isSequenceComplete: false,
  currentLevel: 2,
  score: 150,
  round: 3,
  addDigit: (digit: number) => {},
  removeDigit: () => {},
  submitAnswer: () => {},
  togglePause: () => {},
}

// Mock de react-i18next
const mockT = (key: string, options?: any) => {
  const translations: Record<string, string> = {
    'input.timeLeft': `Time: ${options?.seconds}s`,
    'input.placeholder': `Enter ${options?.length} digits`,
    'input.userSequence': `Your sequence: ${options?.sequence}`,
    'buttons.pause': 'Pause',
    'buttons.resume': 'Resume',
    'buttons.confirm': 'Confirm',
    'input.originalLength': `Original length: ${options?.length}`,
    'game.levelRound': `Level ${options?.level} - Round ${options?.round}`,
    'game.score': `Score: ${options?.score}`,
  }
  return translations[key] || key
}

// Mock de useTranslation

const meta: Meta<typeof InputScreen> = {
  title: 'Organisms/InputScreen',
  component: InputScreen,
  decorators: [
    Story => (
      <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <Story />
      </View>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: 'Pantalla de entrada de secuencia del juego.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    game: mockGame,
  },
}

export const Paused: Story = {
  args: {
    game: { ...mockGame, isPaused: true },
  },
}

export const TimeWarning: Story = {
  args: {
    game: { ...mockGame, timeLeft: 5 },
  },
}

export const SequenceComplete: Story = {
  args: {
    game: { ...mockGame, isSequenceComplete: true },
  },
}

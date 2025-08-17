import GameButton from '@/components/atoms/GameButton'
import type { Meta, StoryObj } from '@storybook/react-native'
import { View } from 'react-native'

const meta: Meta<typeof GameButton> = {
  title: 'Atoms/GameButton',
  component: GameButton,
  decorators: [
    Story => (
      <View style={{ padding: 16, backgroundColor: '#f5f5f5' }}>
        <Story />
      </View>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: 'Botón reutilizable del juego con variantes visuales.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger'],
      description: 'Variante visual del botón',
    },
    disabled: {
      control: 'boolean',
      description: 'Estado deshabilitado',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
}

export const Danger: Story = {
  args: {
    children: 'Danger Button',
    variant: 'danger',
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
}

export const LongText: Story = {
  args: {
    children: 'Button with very long text content',
    variant: 'primary',
  },
}

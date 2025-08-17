import type { Meta, StoryObj } from '@storybook/react-native'
import { View } from 'react-native'
import { ThemedText } from '../../components/atoms/ThemedText'

const meta: Meta<typeof ThemedText> = {
  title: 'Atoms/ThemedText',
  component: ThemedText,
  decorators: [
    Story => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['default', 'title', 'defaultSemiBold', 'subtitle', 'link'],
    },
    lightColor: { control: 'color' },
    darkColor: { control: 'color' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Default text style',
    type: 'default',
  },
}

export const Title: Story = {
  args: {
    children: 'Title text',
    type: 'title',
  },
}

export const Subtitle: Story = {
  args: {
    children: 'Subtitle text',
    type: 'subtitle',
  },
}

export const Link: Story = {
  args: {
    children: 'Link text',
    type: 'link',
  },
}

export const CustomColors: Story = {
  args: {
    children: 'Custom colored text',
    lightColor: '#ff6b6b',
    darkColor: '#feca57',
  },
}

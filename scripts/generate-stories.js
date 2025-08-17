#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const COMPONENTS_DIR = './components'
const STORIES_DIR = './.rnstorybook/stories'

// Template para atoms
const atomTemplate = (componentName, importPath) => `
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import ${componentName} from '${importPath}';

const meta: Meta<typeof ${componentName}> = {
  title: 'Atoms/${componentName}',
  component: ${componentName},
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
`

// Template para molecules
const moleculeTemplate = (componentName, importPath) => `
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import ${componentName} from '${importPath}';

const meta: Meta<typeof ${componentName}> = {
  title: 'Molecules/${componentName}',
  component: ${componentName},
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
`

// Función para escanear componentes
function scanComponents(dir, level = '') {
  const items = fs.readdirSync(dir)

  items.forEach(item => {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (
      stat.isDirectory() &&
      ['atoms', 'molecules', 'organisms'].includes(item)
    ) {
      console.log(`📁 Scanning ${item}...`)
      scanComponents(fullPath, item)
    } else if (
      stat.isFile() &&
      item.endsWith('.tsx') &&
      !item.endsWith('.stories.tsx')
    ) {
      const componentName = path.basename(item, '.tsx')
      const storyName = `${componentName}.stories.tsx`
      const storyPath = path.join(STORIES_DIR, level, storyName)

      // Crear directorio si no existe
      const storyDir = path.dirname(storyPath)
      if (!fs.existsSync(storyDir)) {
        fs.mkdirSync(storyDir, { recursive: true })
      }

      // Solo crear si no existe
      if (!fs.existsSync(storyPath)) {
        const importPath = path
          .relative(path.dirname(storyPath), fullPath)
          .replace(/\\/g, '/')
          .replace('.tsx', '')

        let template
        if (level === 'atoms') {
          template = atomTemplate(componentName, importPath)
        } else if (level === 'molecules') {
          template = moleculeTemplate(componentName, importPath)
        } else {
          template = moleculeTemplate(componentName, importPath) // Default
        }

        fs.writeFileSync(storyPath, template)
        console.log(`✅ Created story: ${storyPath}`)
      } else {
        console.log(`⏭️  Story exists: ${storyPath}`)
      }
    }
  })
}

// Ejecutar
console.log('🚀 Generating Storybook stories...')
scanComponents(COMPONENTS_DIR)
console.log('✨ Done!')

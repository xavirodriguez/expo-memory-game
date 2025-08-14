import { TextInput } from 'react-native'

export default function GameInput(props) {
  return (
    <TextInput
      className='border-2 border-gray-300 rounded-lg p-3 text-lg text-center mb-4 bg-white'
      keyboardType='numeric'
      {...props}
    />
  )
}

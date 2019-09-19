import React from 'react'
import { View } from 'react-native'
import { DEVICE_WIDTH, DisplayStyle } from '../../../../../styles/commonStyles'

export default function Row(props) {
  const count = props.children.length
  return (
    <View
      style={{
        ...DisplayStyle('row', 'center', 'flex-start'),
        paddingVertical: 3,
        width: DEVICE_WIDTH - 30
      }}
    >
      {React.Children.map(props.children, child => {
        return (
          <View
            style={{
              width: count === 2 ? (DEVICE_WIDTH - 30) / 2 : DEVICE_WIDTH - 30
            }}
          >
            {child}
          </View>
        )
      })}
    </View>
  )
}

import React from 'react'
import { View } from 'react-native'
import { Separator } from '../../../../../components'
export default function Panel(props) {
  return (
    <View>
      <Separator label={props.label} />
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 15,
          backgroundColor: '#fff'
        }}
      >
        {props.children}
      </View>
    </View>
  )
}

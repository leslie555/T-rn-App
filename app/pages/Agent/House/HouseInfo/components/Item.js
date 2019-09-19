import React from 'react'
import { DisplayStyle } from '../../../../../styles/commonStyles'
import { View, Text } from 'react-native'

const lineHeight = 19
export default class Item extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      rowHeight: lineHeight
    }
  }
  render() {
    return (
      <View
        style={{
          ...DisplayStyle('row', 'center', 'flex-start'),
          height: this.state.rowHeight
        }}
      >
        <Text
          style={{
            textAlign: 'justify',
            width: 60,
            color: '#363636',
            marginRight: 5,
            textAlignVertical: 'top',
            height: this.state.rowHeight,
          }}
        >
          {this.props.label}
        </Text>
        <Text
          style={{
            color: '#999',
            flex: 1,
            lineHeight
          }}
          numberOfLines={5}
          onLayout={e => {
            if (e.nativeEvent.layout.height > lineHeight) {
              this.setState({
                rowHeight: e.nativeEvent.layout.height
              })
            }
          }}
        >
          {this.props.children}
        </Text>
      </View>
    )
  }
}
/* export default function Item(props) {
  const lineHeight = 22
  return (
    <View
      style={{
        ...DisplayStyle('row', 'center', 'flex-start'),
        height: lineHeight
      }}
    >
      <Text
        style={{
          textAlign: 'justify',
          width: 60,
          color: '#363636',
          textAlignVertical: 'top',
          textAlign: 'left'
        }}
      >
        {props.label}
      </Text>
      <Text
        style={{
          color: '#666',
          flex: 1,
          lineHeight
        }}
        numberOfLines={5}
        onLayout={e => {
          if (e.nativeEvent.layout.height > lineHeight) {
            this.setState({
              color: 'red'
            })
          }
        }}
      >
        {props.children}
      </Text>
    </View>
  )
}
 */

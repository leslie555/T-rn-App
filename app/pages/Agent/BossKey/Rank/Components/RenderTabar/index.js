import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import {
  CommonColor,
  DisplayStyle,
} from '../../../../../../styles/commonStyles'

const Button = props => {
  return (
    <TouchableOpacity {...props} activeOpacity={0.95}>
      {props.children}
    </TouchableOpacity>
  )
}

export default class RenderTabar extends Component {
  constructor(props) {
    super(props)
  }
  renderTab(name, page, isTabActive, onPressHandler) {
    const textColor = isTabActive ? '#0086E5' : '#fff'
    const backgroundColor = isTabActive ? '#fff' : CommonColor.color_primary
    return (
      <Button
        style={[styles.button, { backgroundColor }]}
        key={name}
        onPress={() => onPressHandler(page)}
      >
        <View style={[styles.tab]}>
          <Text style={{ color: textColor, fontSize: 18 }}>{name}</Text>
        </View>
      </Button>
    )
  }

  render() {
    return (
      <View style={styles.tabBarBox}>
        <View style={{ flexDirection: 'row' }}>
          {this.props.tabs.map((name, page) => {
            const isTabActive = this.props.activeTab === page
            const renderTab = this.props.renderTab || this.renderTab
            return renderTab(name, page, isTabActive, this.props.goToPage)
          })}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  tabBarBox: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3f47df',
  },
  tab: {
    flex: 1,
    ...DisplayStyle('row', 'center', 'center'),
  },
  button: {
    flex: 1,
    height: 40,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
})

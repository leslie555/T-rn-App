import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import { DisplayStyle, CommonColor } from '../../styles/commonStyles'
// import MenuDatePicker from './components/DatePicker'
import MenuCheckbox from './components/Checkbox'
import MenuItem from './components/MenuItem'
import { StatusBarHeight } from '../../styles/commonStyles'

const DEVICE_WIDTH = Dimensions.get('window').width
export default class SelectFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  static defaultProps = {}

  render() {
    return (
      <View>
        <View style={style.menu}>
          {this.props.options.map((v, idx) => (
            <MenuItem key={idx} title={v.title}>
              {v.component}
            </MenuItem>
          ))}
          <View style={style.menu_item_bottom}>
            <TouchableOpacity
              style={[style.menu_comfirm, style.menu_reset]}
              onPress={this.props.reset}
            >
              <Text style={style.menu_bottom_text}>重置</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={style.menu_comfirm}
              onPress={this.props.confirm}
            >
              <Text style={style.menu_bottom_text}>确认</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const style = StyleSheet.create({
  menu: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 20 + StatusBarHeight,
    paddingBottom: 20
  },
  menu_item_bottom: {
    ...DisplayStyle('row', 'center', 'space-between')
  },
  menu_bottom_text: {
    color: CommonColor.color_white
  },
  menu_reset: {
    backgroundColor: '#999999'
  },
  menu_comfirm: {
    width: (DEVICE_WIDTH / 5) * 2 - 20,
    height: 40,
    borderRadius: 8,
    backgroundColor: CommonColor.color_primary,
    ...DisplayStyle('row', 'center', 'center')
  }
})

export { MenuCheckbox }

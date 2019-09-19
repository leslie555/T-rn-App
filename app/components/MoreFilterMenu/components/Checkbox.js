import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { DisplayStyle, CommonColor } from '../../../styles/commonStyles'

export default class Checkbox extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const list = [...this.props.list]
    list.unshift({ label: '全部', value: '' })
    const auditList = list.map(v => v.label)
    const AuditBtns = auditList.map((val, index) => {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => {
            this.props.setChecked(index, list[index])
          }}
        >
          <View
            style={[
              style.menu_item_button,
              this.props.curIndex === index
                ? style.menu_item_button_active
                : null
            ]}
          >
            <Text
              style={[
                style.menu_item_button_text,
                this.props.curIndex === index
                  ? style.menu_item_button_text_active
                  : null
              ]}
            >
              {val}
            </Text>
          </View>
        </TouchableOpacity>
      )
    })
    return <View style={style.menu_item_btns}>{AuditBtns}</View>
  }
}

const style = StyleSheet.create({
  menu_item_btns: {
    ...DisplayStyle('row', 'center', 'flex-start'),
    flexWrap: 'wrap'
  },
  menu_item_button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#999999',
    borderRadius: 8,
    marginRight: 8,
    marginLeft: 8,
    marginBottom: 10,
    width: 110
  },
  menu_item_button_active: {
    borderColor: CommonColor.color_primary
  },
  menu_item_button_text: {
    color: CommonColor.color_text_secondary
  },
  menu_item_button_text_active: {
    color: CommonColor.color_primary
  }
})

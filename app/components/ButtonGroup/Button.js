import React, { Component } from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import { CommonColor, DisplayStyle } from '../../styles/commonStyles'
import ApslButton from 'apsl-react-native-button'
import IconFont from '../../utils/IconFont'

export default class Button extends Component {
  constructor(props) {
    super(props)
  }
  static defaultProps = {
    activityIndicatorColor: 'black',
    isLoading: false,
    isDisabled: false,
    title: '',
    hasIcon: true,
    color: CommonColor.color_primary,
    iconName: 'checkout',
    fontSize: 15
  }
  render() {
    return (
      <ApslButton
        style={{
          ...style.btn,
          ...this.props.btnStyle
        }}
        textStyle={style.detail_page_btn_text}
        disabledStyle={{ opacity: 0.5 }}
        isLoading={this.props.isLoading}
        isDisabled={this.props.isDisabled}
        activityIndicatorColor={this.props.activityIndicatorColor}
        onPress={this.props.onPress}
      >
        {this.props.hasIcon ? (
          <View style={style.iconContainer}>
            <IconFont
              name={this.props.iconName}
              size={this.props.fontSize}
              color={this.props.color}
            />
            <Text
              style={{ color: this.props.color, marginTop: 2, fontSize: 12 }}
            >
              {this.props.title}
            </Text>
          </View>
        ) : this.props.hasImage ? (
          <View style={style.iconContainer}>
            <Image
              source={this.props.require}
              style={{ marginBottom: this.props.btnStyle.marginBottom }}
            />
            <Text style={{ color: this.props.color }}>{this.props.title}</Text>
          </View>
        ) : (
          this.props.title
        )}
      </ApslButton>
    )
  }
}

const style = StyleSheet.create({
  btn: {
    height: 45,
    borderRadius: 6,
    backgroundColor: '#389ef2',
    ...DisplayStyle('row', 'center', 'center'),
    borderWidth: 0
  },
  detail_page_btn_text: {
    color: CommonColor.color_white,
    fontSize: 18
  },
  iconContainer: {
    ...DisplayStyle('column', 'center', 'center')
  }
})

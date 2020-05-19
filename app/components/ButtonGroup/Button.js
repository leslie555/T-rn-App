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
    isIconContainer: true,
    color: CommonColor.color_primary,
    iconName: '',
    fontSize: 15
  }
  render() {
    const {
      isIconContainer,
      btnStyle,
      isLoading,
      isDisabled,
      activityIndicatorColor,
      onPress,
      iconName,
      fontSize,
      color,
      imgSource,
      title
    } = this.props
    return (
      <ApslButton
        style={{
          ...style.btn,
          ...btnStyle
        }}
        textStyle={style.detail_page_btn_text}
        disabledStyle={{ opacity: 0.5 }}
        isLoading={isLoading}
        isDisabled={isDisabled}
        activityIndicatorColor={activityIndicatorColor}
        onPress={onPress}
      >
        {isIconContainer ? (
          <View style={style.iconContainer}>
            {iconName ? (
              <IconFont name={iconName} size={fontSize} color={color} />
            ) : (
              <Image
                source={imgSource}
                style={{
                  marginBottom: btnStyle.marginBottom
                }}
              />
            )}
            <Text
              style={{
                color: color,
                marginTop: 2,
                fontSize: 12
              }}
            >
              {title}
            </Text>
          </View>
        ) : (
          title
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

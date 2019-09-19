import React from 'react'
import createReactClass from 'create-react-class'
import { DEVICE_WIDTH } from '../../../styles/commonStyles'
import {
  View,
  Text,
  TextInput,
  PixelRatio,
  TouchableOpacity
} from 'react-native'

var WidgetMixin = require('../mixins/WidgetMixin.js')

module.exports = createReactClass({
  mixins: [WidgetMixin],

  getDefaultProps() {
    return {
      inline: true,
      // @todo type avec suffix Widget pour all
      type: 'TextInputWidget',
      underlined: false,
      required: true,
      disabled: false,
      onTextInputFocus: value => value,
      onTextInputBlur: value => value
    }
  },

  getInitialState() {
    return {
      focused: false
    }
  },
  componentDidMount() {
    this.getDefaultValidators({
      validator: args => {
        if (!args) {
          return false
        }
        return true
      },
      message: '{TITLE} 不能为空'
    })
  },
  _renderTitle() {
    if (this.props.title !== '') {
      return (
        <Text
          numberOfLines={1}
          style={[
            ...this.getStyle(['textInputTitleInline']),
            { width: this.props.textWidth }
          ]}
        >
          {this.props.title}
        </Text>
      )
    }
    return <View style={this.getStyle(['spacer'])} />
  },
  _renderRow() {
    if (this.props.inline === false) {
      return (
        <View style={this.getStyle(['rowContainer'])}>
          <View style={this.getStyle(['textInlineAreaRow'])}>
            {this._renderImage()}
            {this._renderStar()}
            {this._renderTitle()}

            <TextInput
              ref='input'
              multiline={true}
              placeholder={'请输入'}
              style={this.getStyle(['textInlineArea'])}
              {...this.props}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onChangeText={this._onChange}
              value={this.state.value}
              editable={this.props.disabled ? false : true}
            />
          </View>
          {/* {this._renderValidationError()} */}
          {this._renderUnderline()}
        </View>
      )
    }
    return (
      <TouchableOpacity
        style={this.getStyle(['rowContainer'])}
        activeOpacity={1}
        onPress={() => {
          if (this.input && !this.state.focused) {
            this.input.focus()
          }
        }}
      >
        <View
          style={this.getStyle(['row'])}
          pointerEvents={this.state.focused ? 'auto' : 'none'}
        >
          {this._renderImage()}
          {this._renderStar()}
          {this._renderTitle()}

          {this.props.disabled ? (
            <Text
              style={[
                this.getStyle(['detailText']),
                { paddingRight: this.props.tail ? 5 : 30 }
              ]}
            >
              {this.state.value}
            </Text>
          ) : (
            <TextInput
              ref={input => (this.input = input)}
              style={[
                this.getStyle(['textInputInline']),
                { paddingRight: this.props.tail ? 5 : 30 }
              ]}
              placeholder={'请输入'}
              clearButtonMode='while-editing'
              {...this.props}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onChangeText={this._onChange}
              value={this.state.value}
            />
          )}
          {this._renderTail()}
        </View>
        {/* {this._renderValidationError()} */}
        {this._renderUnderline()}
      </TouchableOpacity>
    )
  },

  onFocus() {
    this.setState({
      focused: true
    })
    this.props.onFocus()
    let oldText = this.state.value
    let newText = this.props.onTextInputFocus(this.state.value)
    if (newText !== oldText) {
      this._onChange(newText)
    }
  },

  onBlur() {
    this.setState({
      focused: false
    })
    this.props.onBlur()
    this.props.onTextInputBlur(this.state.value)
  },

  _renderTail() {
    if (this.props.tail) {
      return (
        <View style={{ backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 15, paddingRight: 10 }}>
            {this.props.tail}
          </Text>
        </View>
      )
    }
  },
  _renderUnderline() {
    if (this.props.underlined === true) {
      if (this.state.focused === false) {
        return <View style={this.getStyle(['underline', 'underlineIdle'])} />
      }
      return <View style={this.getStyle(['underline', 'underlineFocused'])} />
    }
    return null
  },

  render() {
    return this._renderRow()
  },

  defaultStyles: {
    rowImage: {
      height: 20,
      width: 20,
      marginLeft: 10
    },
    underline: {
      marginRight: 10,
      marginLeft: 10
    },
    underlineIdle: {
      borderBottomWidth: 1,
      borderColor: '#eee'
    },
    underlineFocused: {
      borderBottomWidth: 1,
      borderColor: '#3498db'
    },
    spacer: {
      width: 10
    },
    rowContainer: {
      width: DEVICE_WIDTH,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderColor: '#eee',
      borderRadius: 0.1
    },
    row: {
      flexDirection: 'row',
      height: 44,
      alignItems: 'center',
      backgroundColor: '#fff'
    },
    titleContainer: {
      paddingTop: 10,
      flexDirection: 'row',
      alignItems: 'center'
      // selfAlign: 'center',
      // backgroundColor: '#ff0000',
    },
    textInputInline: {
      fontSize: 15,
      flex: 1,
      height: 44, // @todo should be changed if underlined
      marginTop: 2,
      textAlign: 'right'
    },
    detailText: {
      fontSize: 15,
      flex: 1,
      marginTop: 2,
      textAlign: 'right'
    },
    textInputTitleInline: {
      width: 120,
      fontSize: 15,
      color: '#000'
      // paddingLeft: 20
    },
    textInputTitle: {
      fontSize: 13,
      color: '#333',
      paddingLeft: 10,
      flex: 1
    },
    textInput: {
      fontSize: 15,
      flex: 1,
      height: 40,
      marginLeft: 40
    },
    textInlineAreaRow: {
      width: DEVICE_WIDTH,
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'flex-start',
      paddingTop: 15
    },
    textInlineArea: {
      backgroundColor: '#fff',
      fontSize: 15,
      height: 80,
      flex: 1,
      paddingTop: 0,
      paddingRight: 30,
      textAlignVertical: 'top',
      textAlign: 'right'
    }
  }
})

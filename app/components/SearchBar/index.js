import React, {Component} from 'react';
import {Dimensions, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import IconFont from '../../utils/IconFont/index';
import {debounce} from '../../utils/debounce';
import {CommonColor, DisplayStyle} from '../../styles/commonStyles';
import {withNavigation} from "react-navigation";
import PropTypes from 'prop-types';

class SearchBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: []
    }
  }

  //如果没有传递该属性时的默认值
  static defaultProps = {
    hideLeft: false,
    hideCancelText: false,
    cancelText: '取消',
    placeholder: '',
    onChangeText: null,
    onCancel: null,
    onClear: null,
    multiple: false
  }
  //如果传递该属性，该属性值必须为字符串
  static propTypes = {
    hideLeft: PropTypes.bool,  // 是否隐藏后退键 和Header组件共用时保持一致
    hideCancelText: PropTypes.bool,  //  是否隐藏右侧 取消
    cancelText: PropTypes.string, // 右侧取消的 文案
    placeholder: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array
    ]), // 输入框占位符
    onChangeText: PropTypes.func, // 文字改变时触发 已集成debounce
    onCancel: PropTypes.func, // 取消的点击事件
    onClear: PropTypes.func, // ios 清除事件
    multiple: PropTypes.bool, // 是否多个搜索框
  }

  onChangeText(text,index=0) {
    this.state.text[index] = text
    this.setState({text: this.state.text})
    this.props.onChangeText && this.props.onChangeText(text,index)
  }

  onCancel() {
    if (this.props.onCancel) {
      this.props.onCancel(true)
      this.setState({text: []})
    }
  }

  onClear(index=0) {
    if (!this.state.text[index]) {
      return
    } else {
      this.state.text[index] = ''
      this.setState({text: this.state.text})
      this.props.onClear && this.props.onClear(index)
    }
  }

  render() {
    return (
        <View style={style.search_bar}>
          <View style={style.search_bar_content}>
            {!this.props.hideLeft && <View
                style={style.search_bar_back}
            >
            </View>}
            {!this.props.multiple&&<View style={style.search_text_box}>
              <IconFont style={style.search_icon} name='search' size={15} color='#999'/>
              <TextInput
                  autoFocus={true}
                  style={style.search_text}
                  onChangeText={debounce((text) => {
                    this.onChangeText(text)
                  })}
                  placeholder={this.props.placeholder}
                  defaultValue={this.state.text[0]||''}
              />
              {this.state.text[0]?
                  <TouchableOpacity style={style.search_bar_delete} onPress={()=>{
                    this.onClear()
                  }}>
                    <IconFont name='jiahao1' size={8} color='#ffffff'></IconFont>
                  </TouchableOpacity>:null
              }
            </View>}
            {this.props.multiple&&this.props.placeholder.map((item,index)=>{
              return (
                  <View style={[style.search_text_box,index>0?{marginLeft: 10}:null]} key={index}>
                    <IconFont style={style.search_icon} name='search' size={15} color='#999'/>
                    <TextInput
                        autoFocus={index===0}
                        style={style.search_text}
                        onChangeText={debounce((text) => {
                          this.onChangeText(text,index)
                        })}
                        placeholder={item}
                        defaultValue={this.state.text[index]}
                    />
                    {this.state.text[index]?
                        <TouchableOpacity style={style.search_bar_delete} onPress={()=>{
                          this.onClear(index)
                        }}>
                          <IconFont name='jiahao1' size={8} color='#ffffff'></IconFont>
                        </TouchableOpacity>:null
                    }
                  </View>
              )
            })}
          </View>
          {!this.props.hideCancelText && <TouchableOpacity style={style.cancel_btn} onPress={this.onCancel.bind(this)}>
            <Text style={style.cancel_btn_text}>{this.props.cancelText}</Text>
          </TouchableOpacity>}
        </View>
    )
  }
}

export default withNavigation(SearchBar)

const style = StyleSheet.create({
  search_bar: {
    flex: 1,
    // paddingTop: StatusBarHeight,
    paddingLeft: 15,
    paddingRight: 15,
    position: 'relative',
    zIndex: 10,
    backgroundColor: CommonColor.color_primary,
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  search_bar_content: {
    flex: 1,
    position: 'relative',
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  search_bar_back: {
    width: 35,
    ...DisplayStyle('row', 'center', 'space-between')
  },
  search_text_box: {
    flex: 1,
    height: 34,
    position: 'relative',
    ...DisplayStyle('row', 'center', 'flex-start'),
  },
  search_icon: {
    position: 'absolute',
    zIndex: 10,
    left: 8
  },
  search_text: {
    position: 'relative',
    zIndex: 8,
    height: 34,
    fontSize: 12,
    paddingLeft: 26,
    paddingRight: 40,
    paddingVertical: 0,
    flex: 1,
    backgroundColor: CommonColor.color_white,
    borderRadius: 8
  },
  cancel_btn: {
    width: 50,
    ...DisplayStyle('row', 'center', 'flex-end'),
    backgroundColor: CommonColor.color_primary
  },
  cancel_btn_text: {
    color: CommonColor.color_white
  },
  search_bar_delete: {
    backgroundColor: '#bbbbbb',
    width: 20,
    height: 20,
    borderRadius: 16,
    position: 'absolute',
    zIndex: 10,
    right: 10,
    ...DisplayStyle('row', 'center', 'center')
  }
})

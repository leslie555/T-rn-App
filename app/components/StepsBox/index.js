import React, {Component} from 'react'
import {Alert, BackHandler, Text, TouchableOpacity, View} from 'react-native'
import styles from './style'
import './style';
import ScrollableTabView from 'react-native-scrollable-tab-view'
import {DEVICE_WIDTH} from "../../styles/commonStyles";

export default class StepBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentStep: 1
    }
    this.tabView = null
    this.backHandler = null
    // 路由监听
    this.willFocusSubscription = this.props.navigation.addListener(
        'didFocus',
        payload => {
          this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.state.currentStep > 1) {
              this.prevStep()
            }else{
              Alert.alert('温馨提示', '表单还未保存，确定要退出吗？', [
                {text: '取消', onPress: () => {}},
                {text: '确认', onPress: () => this.props.navigation.goBack()}
              ], {cancelable: false})
            }
            return true
          })
        }
    )
    this.willBlurSubscription = this.props.navigation.addListener(
        'willBlur',
        payload => {
          this.backHandler&&this.backHandler.remove()
        }
    )
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
    this.willBlurSubscription.remove();
    this.backHandler&&this.backHandler.remove() // replace的时候先进入 componentWillUnmount 再进入willBlur
  }

  changeTab = ({i}) => {
    console.log(i)
    this.setState({
      currentStep: i + 1
    })
  }

  nextStep() {
    if (this.state.currentStep < this.props.list.length) {
      this.setState({
        currentStep: this.state.currentStep + 1
      }, () => {
        this.goTop()
      })
    }
  }

  prevStep() {
    if (this.state.currentStep > 1) {
      this.setState({
        currentStep: this.state.currentStep - 1
      }, () => {
        this.goTop()
      })
    }
  }

  goStep(index) {
    if (this.state.currentStep > index + 1) {
      this.setState({
        currentStep: index + 1
      }, () => {
        this.goTop()
      })
    }
  }

  goTop() {
    this.tabView.goToPage(this.state.currentStep - 1)
    // document.documentElement.scrollTop = document.body.scrollTop = window.pageYOffset = 0
    this.props.handleChange && this.props.handleChange(this.state.currentStep)
  }

  render() {
    return (
        <View style={styles.steps_box}>
          <View style={styles.steps_panel}>
            <View style={styles.steps_herder}>
              {this.getStepHeaderView()}
            </View>
            <View style={styles.steps_content}>
              {this.getStepContentView()}
            </View>
          </View>
          <ScrollableTabView style={styles.tab_page_wrap} initialPage={0}
                             onChangeTab={this.changeTab}
                             locked
                             ref={(tabView) => {
                               this.tabView = tabView;
                             }}
                             prerenderingSiblingsNumber={this.props.renderNum || Infinity}
                             renderTabBar={() => <View/>}
          >
            {this.getFormView()}
          </ScrollableTabView>
        </View>
    )
  }

  getStepHeaderView() {
    return this.props.list.map((item, index) => {
      return (
          <Text style={[styles.step_item_title, this.state.currentStep > index ? styles.titleActive : null]}
                key={index}>{item.title}</Text>
      )
    })

  }

  getStepContentView() {
    return this.props.list.map((item, index) => {
      return (
          <View style={styles.step_item} key={index}>
            {index > 0 &&
            <View style={[
              styles.step_item_progress,
              {width: DEVICE_WIDTH / this.props.list.length - 16},
              this.state.currentStep > index ? styles.step_item_progress_active : null]}>
            </View>}
            <TouchableOpacity onPress={() => {
              this.goStep(index)
            }} style={[
              styles.step_item_icon,
              this.state.currentStep > index ? styles.step_item_icon_active : null]}>
              <View style={[
                styles.step_item_icon_inner,
                this.state.currentStep > index ? styles.step_item_icon_inner_active : null,
                this.state.currentStep === index + 1 ? styles.step_item_icon_inner_current : null]}>
              </View>
            </TouchableOpacity>
          </View>
      )
    })

  }

  getFormView() {
    return this.props.viewList.map((item, index) => {
      return (<View style={{flex: 1}} tabLabel={'step' + index} key={index}>{item}</View>)
    })
  }
}

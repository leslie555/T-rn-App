import React, { Component, PureComponent, Fragment } from 'react'
import {
  StyleSheet,
  Animated,
  ScrollView,
  Dimensions,
  PixelRatio,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TouchableOpacity,
  ART,
  View,
  Platform
} from 'react-native'
import { DisplayStyle, DEVICE_WIDTH } from '../../styles/commonStyles'
import DatePicker from './DatePicker'
import deepClone from '../../utils/deepClone'

const { Surface, Shape, Path, Group } = ART
const AnimatedTouchableWithoutFeedback = Animated.createAnimatedComponent(
  TouchableWithoutFeedback
)

const Dim = Dimensions.get('window')
const width = Dim.width
const HEIGHT = Dim.height

const T_WIDTH = 7
const T_HEIGHT = 4

const COLOR_HIGH = '#389ef2'
const COLOR_NORMAL = '#6c6c6c'

const LINE = 1 / PixelRatio.get()

class Triangle extends PureComponent {
  render() {
    var path
    var fill
    if (this.props.selected) {
      fill = COLOR_HIGH
      path = new Path()
        .moveTo(T_WIDTH / 2, 0)
        .lineTo(0, T_HEIGHT)
        .lineTo(T_WIDTH, T_HEIGHT)
        .close()
    } else {
      // fill = COLOR_NORMAL
      fill = '#999'
      path = new Path()
        .moveTo(0, 0)
        .lineTo(T_WIDTH, 0)
        .lineTo(T_WIDTH / 2, T_HEIGHT)
        .close()
    }

    return (
      <Surface width={T_WIDTH} height={T_HEIGHT}>
        <Shape d={path} stroke='#00000000' fill={fill} strokeWidth={0} />
      </Surface>
    )
  }
}

export const TopMenuItem = props => {
  const onPress = () => {
    if (props.customize) {
      props.onPress()
    } else {
      props.onSelect(props.index)
    }
  }
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={props.selected ? styles.menuTextHigh : styles.menuText}>
        {props.label}
      </Text>
      <Triangle selected={props.selected} />
    </TouchableOpacity>
  )
}

const Subtitle = props => {
  let textStyle = props.selected
    ? [styles.tableItemText, styles.highlight, styles.marginHigh]
    : [styles.tableItemText, styles.margin]

  let rightTextStyle = props.selected
    ? [styles.tableItemText, styles.highlight]
    : styles.tableItemText

  let onPress = () => {
    props.onSelectMenu(props.index, props.subindex, props.data)
  }

  return (
    <TouchableHighlight onPress={onPress} underlayColor='#f5f5f5'>
      <View style={styles.tableItem}>
        <View style={styles.row}>
          {props.selected && <Check />}
          <Text style={textStyle}>{props.data.title}</Text>
        </View>
        <Text style={rightTextStyle}>{props.data.subtitle}</Text>
      </View>
    </TouchableHighlight>
  )
}

const Title = props => {
  let textStyle = props.selected
    ? [styles.tableItemText, styles.highlight, styles.marginHigh]
    : [styles.tableItemText, styles.margin]

  let onPress = () => {
    props.onSelectMenu(props.index, props.subindex, props.data)
  }

  return (
    <TouchableHighlight onPress={onPress} underlayColor='#f5f5f5'>
      <View style={styles.titleItem}>
        {props.selected && <Check />}
        <Text style={textStyle}>{props.data.title}</Text>
      </View>
    </TouchableHighlight>
  )
}

const Checkbox = props => {
  return (
    <View style={styles.checkBoxContainer}>
      <View style={styles.checkBoxTitle}>
        <Text style={styles.checkBoxTitleText}>{props.title}</Text>
      </View>
      <View style={styles.checkBoxItemContainer}>
        {props.data.map((val, index) => {
          const isSelected =
            props.tempPanelSelected[props.subindex].selected === index
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={1}
              style={{
                ...styles.checkBoxItem,
                minWidth: (DEVICE_WIDTH - 60) / 4,
                borderColor: isSelected ? COLOR_HIGH : COLOR_NORMAL
              }}
              onPress={() => {
                const tempPanelSelected = deepClone(props.tempPanelSelected)
                if (
                  tempPanelSelected[props.subindex].selected &&
                  tempPanelSelected[props.subindex].selected === index
                ) {
                  tempPanelSelected[props.subindex].selected = null
                  tempPanelSelected[props.subindex].data = null
                } else {
                  tempPanelSelected[props.subindex].selected = index
                  tempPanelSelected[props.subindex].data = val
                }
                props.setPanelSelected(tempPanelSelected)
              }}
            >
              <Text
                style={{
                  ...styles.checkBoxItemText,
                  color: isSelected ? COLOR_HIGH : COLOR_NORMAL
                }}
              >
                {val.title}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const Check = () => {
  return (
    <Surface width={18} height={12}>
      <Group scale={0.03}>
        <Shape
          fill={COLOR_HIGH}
          d={`M494,52c-13-13-33-13-46,0L176,324L62,211c-13-13-33-13-46,0s-13,33,0,46l137,136c6,6,15,10,23,10s17-4,23-10L494,99
      C507,86,507,65,494,52z`}
        />
      </Group>
    </Surface>
  )
}

export default class TopMenu extends Component {
  constructor(props) {
    super(props)
    let array = props.config
    let top = []
    let maxHeight = []
    let subselected = []
    let height = []
    let panelSelected = []
    //最大高度
    var max = parseInt(((HEIGHT - 80) * 0.7) / 43)
    for (let i = 0, c = array.length; i < c; ++i) {
      let item = array[i]
      if (item.type === 'customize') {
        top[i] = {
          key: item.componentKey
        }
      } else {
        top[i] = item.title
        if (
          (item.selectedIndex || item.selectedIndex === 0) &&
          item.data[item.selectedIndex]
        ) {
          top[i] = item.data[item.selectedIndex].title
        }
      }
      if (item.type === 'panel') {
        maxHeight[i] = item.height || max * 43
        item.components.forEach(val => {
          if (val.type === 'checkbox') {
            panelSelected.push({
              type: 'checkbox',
              title: val.title,
              selected: val.selected,
              data: null
            })
          } else if (val.type === 'datepicker') {
            panelSelected.push({
              type: 'datepicker',
              title: val.title,
              data: {
                startTime: '',
                endTime: ''
              }
            })
          }
        })
      } else if (item.type === 'customize') {
        maxHeight[i] = 0
      } else {
        maxHeight[i] = Math.min(item.data.length, max) * 43
      }
      subselected[i] = item.selectedIndex
      height[i] = new Animated.Value(0)
    }

    //分析数据
    this.state = {
      top: top,
      maxHeight: maxHeight,
      subselected: subselected,
      height: height,
      fadeInOpacity: new Animated.Value(0),
      selectedIndex: null,
      panelSelected,
      tempPanelSelected: [...panelSelected]
    }
    this.manually = false // 是否外部调用函数去修改state,如果是则不触发渲染list
  }

  componentDidMount() {}

  createAnimation = (index, height, isShow) => {
    if (Platform.OS === 'android') {
      return Animated.timing(this.state.height[index], {
        toValue: isShow ? 0 : -this.state.maxHeight[index],
        duration: 350,
        useNativeDriver: true
      })
    } else if (Platform.OS === 'ios') {
      return Animated.timing(this.state.height[index], {
        toValue: height,
        duration: 350
      })
    }
  }

  createFade = value => {
    return Animated.timing(this.state.fadeInOpacity, {
      toValue: value,
      duration: 350,
      useNativeDriver: true
    })
  }

  onSelect = index => {
    this.manually = false
    if (index === this.state.selectedIndex) {
      //消失
      this.hide(index)
    } else {
      this.setState({
        selectedIndex: index,
        current: index
      })
      this.onShow(index)
    }
  }

  manuallySelect = (index, subselected, panelIndex) => {
    // 供外部改变内部状态的函数
    let opts = null
    let data = null
    this.manually = true
    if (this.props.config[index].type === 'panel') {
      const tempPanelSelected = [...this.state.panelSelected]
      const panelData = {
        selected: panelIndex,
        data:
          panelIndex !== null
            ? this.props.config[index].components[subselected].data[panelIndex]
            : null
      }
      tempPanelSelected[subselected] = {
        ...tempPanelSelected[subselected],
        ...panelData
      }
      opts = {
        selectedIndex: null,
        current: index,
        tempPanelSelected,
        panelSelected: tempPanelSelected
      }
      data = tempPanelSelected
    } else {
      this.state.subselected[index] = subselected
      this.state.top[index] = this.props.config[index].data[subselected].title
      opts = {
        selectedIndex: null,
        current: index,
        subselected: this.state.subselected.concat()
      }
      data = this.props.config[index].data[subselected]
    }
    this.setState(opts)
    this.props.onSelectMenu && this.props.onSelectMenu(index, subselected, data)
  }

  manuallyHide = () => {
    // 提供外部隐藏list的方法
    if (this.state.selectedIndex !== null) {
      this.hide(this.state.selectedIndex)
    }
  }

  hide = (index, subselected) => {
    let opts = {
      selectedIndex: null,
      current: index
    }
    if (
      subselected !== undefined &&
      this.props.config[index].type !== 'panel'
    ) {
      this.state.subselected[index] = subselected
      if (subselected !== 0) {
        this.state.top[index] = this.props.config[index].data[subselected].title
      } else {
        this.state.top[index] = this.props.config[index].title
      }
      opts = {
        selectedIndex: null,
        current: index,
        subselected: this.state.subselected.concat()
      }
    } else if (this.props.config[index].type === 'panel') {
      opts = {
        selectedIndex: null,
        current: index,
        tempPanelSelected: [...this.state.panelSelected]
      }
    }
    this.setState(opts)
    this.onHide(index)
  }

  onShow = index => {
    Animated.parallel([
      this.createAnimation(index, this.state.maxHeight[index], true),
      this.createFade(1)
    ]).start()
  }

  onHide = index => {
    //其他的设置为0
    for (let i = 0, c = this.state.height.length; i < c; ++i) {
      if (index != i) {
        this.state.height[i].setValue(0)
      }
    }
    Animated.parallel([
      this.createAnimation(index, 0, false),
      this.createFade(0)
    ]).start()
  }

  onSelectMenu = (index, subindex, data) => {
    this.hide(index, subindex)
    this.props.onSelectMenu && this.props.onSelectMenu(index, subindex, data)
  }
  handleResetClick = () => {
    const tempPanelSelected = this.state.tempPanelSelected.map(val => {
      if (val.type === 'checkbox') {
        return {
          type: 'checkbox',
          title: val.title,
          selected: null,
          data: null
        }
      } else if (val.type === 'datepicker') {
        return {
          type: 'datepicker',
          title: val.title,
          data: {
            startTime: '',
            endTime: ''
          }
        }
      }
    })
    this.setState({ tempPanelSelected })
  }
  handleConfirmClick = () => {
    if (!this.state.selectedIndex) return // 防止点击多次
    // 点击完成之后才应用改变,否则不改动已选的项
    this.setState(
      {
        panelSelected: [...this.state.tempPanelSelected]
      },
      () => {
        this.onSelectMenu(this.state.selectedIndex, 0, this.state.panelSelected)
        this.hide(this.state.selectedIndex)
      }
    )
  }
  renderList = (d, index) => {
    let subselected = this.state.subselected[index]
    let Comp = null
    if (d.type == 'title') {
      Comp = Title
    } else if (d.type === 'subtitle') {
      Comp = Subtitle
    } else if (d.type === 'customize') {
      return null
    }

    let enabled =
      this.state.selectedIndex == index || this.state.current == index
    return (
      <Animated.View
        key={index}
        pointerEvents={enabled ? 'auto' : 'none'}
        style={[
          styles.content,
          {
            opacity: enabled ? 1 : 0,
            [Platform.OS === 'android' ? 'translateY' : 'height']: this.state
              .height[index]
          }
        ]}
      >
        <ScrollView
          style={{
            ...styles.scroll,
            height: this.state.maxHeight[index]
          }}
        >
          {d.type === 'panel' ? (
            <View style={styles.panelContainer}>
              {d.components.map((data, subindex) => {
                switch (data.type) {
                  case 'checkbox':
                    return (
                      <Checkbox
                        index={index}
                        tempPanelSelected={this.state.tempPanelSelected}
                        setPanelSelected={tempPanelSelected =>
                          this.setState({
                            tempPanelSelected
                          })
                        }
                        subindex={subindex}
                        key={subindex}
                        {...data}
                      />
                    )
                  case 'datepicker':
                    return (
                      <DatePicker
                        index={index}
                        tempPanelSelected={this.state.tempPanelSelected}
                        setPanelSelected={tempPanelSelected =>
                          this.setState({
                            tempPanelSelected
                          })
                        }
                        subindex={subindex}
                        key={subindex}
                        {...data}
                      />
                    )
                }
              })}
            </View>
          ) : (
            d.data.map((data, subindex) => {
              return (
                <Comp
                  onSelectMenu={this.onSelectMenu}
                  index={index}
                  subindex={subindex}
                  data={data}
                  selected={subselected == subindex}
                  key={subindex}
                />
              )
            })
          )}
        </ScrollView>
        {d.type === 'panel' && (
          <View style={styles.panelButtons}>
            <TouchableOpacity
              style={styles.panelButton}
              onPress={this.handleResetClick}
            >
              <Text>重置</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.panelButton, styles.bgPanelButton]}
              onPress={this.handleConfirmClick}
            >
              <Text style={{ color: '#fff' }}>完成</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.topMenu}>
          {this.state.top.map((t, index) => {
            if (typeof t === 'string') {
              return (
                <TopMenuItem
                  key={index}
                  index={index}
                  onSelect={this.onSelect}
                  label={t}
                  selected={this.state.selectedIndex === index}
                />
              )
            } else {
              return (
                <Fragment key={index}>
                  {this.props.customComponent[t.key]}
                </Fragment>
              )
            }
          })}
        </View>
        {this.props.renderContent()}
        <View
          style={styles.bgContainer}
          pointerEvents={this.state.selectedIndex !== null ? 'auto' : 'none'}
        >
          <AnimatedTouchableWithoutFeedback
            onPress={() => {
              this.hide(this.state.selectedIndex)
            }}
          >
            <Animated.View
              style={[
                styles.bg,
                {
                  opacity: this.state.fadeInOpacity
                }
              ]}
            />
          </AnimatedTouchableWithoutFeedback>
          {!this.manually &&
            this.props.config.map((d, index) => {
              return this.renderList(d, index)
            })}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: '#fff', overflow: 'hidden' },
  bgContainer: {
    position: 'absolute',
    top: 40,
    width: width,
    height: HEIGHT,
    zIndex: -1
  },
  bg: { flex: 1, backgroundColor: 'rgba(50,50,50,0.2)' },
  content: {
    position: 'absolute',
    width: width
  },

  highlight: {
    color: COLOR_HIGH
  },

  marginHigh: { marginLeft: 10 },
  margin: { marginLeft: 28 },

  titleItem: {
    height: 43,
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: LINE,
    borderBottomColor: '#eee',
    flexDirection: 'row'
  },

  tableItem: {
    height: 43,
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: LINE,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tableItemText: { fontWeight: '300', fontSize: 14 },
  row: {
    flexDirection: 'row'
  },

  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuTextHigh: {
    marginRight: 3,
    fontSize: 13,
    color: COLOR_HIGH
  },
  menuText: {
    marginRight: 3,
    fontSize: 13,
    color: COLOR_NORMAL
  },
  topMenu: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: '#fff',
    borderTopWidth: LINE,
    borderTopColor: '#bdbdbd',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2'
  },

  panelContainer: {
    padding: 10,
    marginBottom: 60
  },
  panelButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 60,
    width: DEVICE_WIDTH,
    flexDirection: 'row',
    borderTopWidth: LINE,
    borderColor: '#ededed'
  },
  panelButton: {
    width: DEVICE_WIDTH / 2,
    borderRightWidth: LINE,
    borderColor: '#ededed',
    backgroundColor: '#fff',
    height: 60 - LINE,
    ...DisplayStyle('row', 'center', 'center')
  },
  bgPanelButton: {
    backgroundColor: COLOR_HIGH
  },
  checkBoxContainer: {
    marginBottom: 5
  },
  checkBoxTitle: {
    paddingBottom: 10
  },
  checkBoxTitleText: {
    color: COLOR_NORMAL,
    fontSize: 12
  },
  checkBoxItemContainer: {
    ...DisplayStyle('row', 'flex-start', 'flex-start'),
    flexWrap: 'wrap'
  },
  checkBoxItem: {
    borderWidth: LINE,
    borderColor: '#ddd',
    borderRadius: 3,
    height: 30,
    paddingHorizontal: 5,
    margin: 5,
    ...DisplayStyle('row', 'center', 'center')
  },
  checkBoxItemText: {
    fontSize: 14,
    color: COLOR_NORMAL
  }
})

import React, { Component } from 'react'
import { CommonColor, DisplayStyle } from '../../../../styles/commonStyles'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import { dateFormat } from '../../../../utils/dateFormat'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import IconFont from '../../../../utils/IconFont'

const DEVICE_WIDTH = Dimensions.get('window').width

class ListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      RentLeaseStatus: {
        label: '',
        color: 'rgb(0,0,0)'
      }
    }
    this.EnumReimbursementStatus = []
    this.EnumRentLeaseStatus = []
  }
  componentWillMount() {
    // 获取枚举
    this.EnumReimbursementStatus = this.props.enumList.EnumReimbursementStatus.map(
      val => ({
        label: val.Description,
        value: val.Value
      })
    )
    const status = this.props.item.Status
    const statusEnum = this.EnumReimbursementStatus

    const statusText = statusEnum.find(v => v.value === status)
    this.filterStatusText(statusText)
  }
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.item) !== JSON.stringify(nextProps.item)) {
      const status = nextProps.item.Status
      const statusEnum = this.EnumReimbursementStatus
      const statusText = statusEnum.find(v => v.value === status)
      this.filterStatusText(statusText)
    }
  }
  filterStatusText(statusText) {
    switch (statusText.value) {
      // case 1:
      //   this.setState({
      //     RentLeaseStatus: {
      //       ...statusText,
      //       color: 'rgb(255,153,0)'
      //     }
      //   })
      //   break

      case 3:
        this.setState({
          RentLeaseStatus: {
            ...statusText,
            color: '#ff5a5a'
          }
        })
        break
      case 4:
        this.setState({
          RentLeaseStatus: {
            ...statusText,
            color: '#389ef2'
          }
        })
        break
      case 7:
        this.setState({
          RentLeaseStatus: {
            ...statusText,
            color: '#389ef2'
          }
        })
        break

      default:
        this.setState({
          RentLeaseStatus: {
            ...statusText,
            color: '#ff9900'
          }
        })
        break
    }
  }
  _onPress = () => {
    const { item } = this.props
    this.props.navigation.navigate('AgentWriteOffDetail', {
      id: item.KeyID
    })
  }
  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.4}
        onPress={this._onPress}
        style={style.container}
      >
        <View style={style.headContainer}>
          <Text style={style.headTitle}>
            {this.props.item.UserName + '  ' + this.props.item.Phone}
          </Text>
          <Text
            style={{
              ...style.headStatus,
              color: this.state.RentLeaseStatus.color
            }}
          >
            {this.state.RentLeaseStatus.label}
          </Text>
        </View>
        <View style={style.contentContainer}>
          <View style={style.rowContainer}>
            <Text style={style.itemTitle}>
              {'房源名称'}:{'  '}
            </Text>
            <Text style={style.itemText}>{this.props.item.HouseName}</Text>
          </View>
          <View
            style={{ ...style.rowContainer, justifyContent: 'space-between' }}
          >
            <View style={{ flexDirection: 'row' }}>
              <Text style={style.itemTitle}>
                {'报销金额'}:{'  '}
              </Text>
              <Text style={style.itemText}>
                {this.props.item.reimbursementTypes.reduce((acc, cur) => {
                  return acc + cur.Money
                }, 0)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={style.itemTitle}>
                {'申请时间'}:{'  '}
              </Text>
              <Text style={style.itemText}>
                {dateFormat(this.props.item.ApplyTime)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const style = StyleSheet.create({
  container: {
    ...DisplayStyle('column', 'center', 'center'),
    height: 100,
    width: DEVICE_WIDTH - 30,
    backgroundColor: CommonColor.color_white,
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowColor: '#cccccc'
  },
  headContainer: {
    ...DisplayStyle('row', 'center', 'space-between'),
    width: DEVICE_WIDTH - 60,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgb(238,238,238)'
  },
  headTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: CommonColor.color_text_primary,
    paddingTop: 10,
    paddingBottom: 10
  },
  headStatus: {
    fontSize: 14
  },
  contentContainer: {
    flex: 1,
    width: DEVICE_WIDTH - 60,
    ...DisplayStyle('column', 'flex-start', 'center')
  },
  rowContainer: {
    width: DEVICE_WIDTH - 60,
    height: 22,
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  itemTitle: {
    fontSize: 12,
    color: '#363636'
  },
  itemText: {
    fontSize: 12,
    color: '#999'
  }
})

const mapToProps = state => ({ enumList: state.enum.enumList })
export default connect(mapToProps)(withNavigation(ListItem))

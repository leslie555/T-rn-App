import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { List } from '../../../../../../components'
import {
  DisplayStyle,
} from '../../../../../../styles/commonStyles'
import RenderItem from '../RenderItem'
import ListItem from '../ListItem'

class RenderContent extends Component {
  constructor(props) {
    super(props)
    this.timeKey = this.props.timeKey || 'StartTime'
    this.state = {
      form: {
        parm: {
          page: 1,
          size: 20,
        },
        CityCode: this.props.isAgent ? null : this.props.cityCode,
        [this.props.rankFormParam || '']: this.props.isAgent ? this.props.cityCode : this.props.activeBtn,
        SortWay: this.props.sortWay,
        VacancyType: this.props.activeBtn === 2 ? 1 : 2,
        ...this.props.otherParm,
        [this.timeKey]: this.props.dateTime || '',
        CallType: 1 // 用于后端判断是不是老板键调用高管版接口
      },
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.activeBtn !== this.props.activeBtn ||
      nextProps.dateTime !== this.props.dateTime ||
      nextProps.sortWay !== this.props.sortWay
    ) {
      this.setState({
        form: {
          ...this.state.form,
          parm: {
            page: 1,
            size: 20,
          },
          [this.props.rankFormParam]: this.props.isAgent ? nextProps.cityCode : nextProps.activeBtn,
          [this.timeKey]: nextProps.activeBtn === 1 ? '' : nextProps.dateTime,
          SortWay: nextProps.sortWay,
          ...this.props.otherParm,
          VacancyType: nextProps.activeBtn === 2 ? 1 : 2,
        }
      })
    } else {
      return null
    }
  }

  render() {
    const Item = this.props.rankType === 7 ? ListItem : RenderItem
    return (
      <View style={{ flex: 1, marginTop: this.props.rankType !== 0 ? 50 : 10 }}>
        {this.props.rankType !== 7 && (
          <View style={styles.rankTitle}>
            <Text style={styles.rankNumber}>排名</Text>
            <Text style={[styles.rankNumber, {flex: 1}]}>门店</Text>
            <Text style={[styles.rankNumber, {flex: 1}]}>经理</Text>
            <Text style={[styles.rankNumber, {width: 60}]}>{this.props.listHeadTitle}</Text>
          </View>
        )}
        <List
          request={this.props.request}
          form={this.state.form}
          setForm={form => this.setState({ form })}
          listKey={this.props.listKey + this.props.cityCode}
          renderItem={({ item, index }) => <Item item={item} index={index} rankType={this.props.rankType} activeBtn={this.props.activeBtn} itemValue={this.props.itemValue}/>}
          hasSameKeyID
        ></List>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  rankTitle: {
    ...DisplayStyle('row', 'center', 'space-between'),
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  rankNumber: {
    fontSize: 14,
    color: '#999999',
    textAlign: "center",
  }
})

export default RenderContent

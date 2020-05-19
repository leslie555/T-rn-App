import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import styles from './style'
class ListItem extends Component {
  constructor(props) {
    super(props)
  }
  filterContractType(type) {
    console.log(this.props.item)
    return type === 0 ? '电子合同' : '纸质合同'
  }
  render() {
    const item = this.props.item
    const typeKey = this.props.typeKey
    return (
      <TouchableOpacity>
        <View style={styles.container}>
          <View style={styles.headContainer}>
            <View style={styles.header_title}>
              <Text style={styles.header_color}>{item.HouseName}</Text>
            </View>
            <View>
              <View style={styles.list_item}>
                <Text style={styles.title_color}>
                  合同编号：
                  <Text style={styles.content_color}>
                    {item.ContractNumber}
                  </Text>{' '}
                </Text>
                <Text style={styles.title_color}>
                  合同类型：
                  <Text style={styles.content_color}>
                    {this.filterContractType(item.PaperType)}
                  </Text>{' '}
                </Text>
              </View>
              <View style={styles.list_item}>
                <Text style={styles.title_color}>
                  {typeKey === 0 ? '业主：' : '租客：'}
                  <Text style={styles.content_color}>
                    {item.Name || item.TenantName}{' '}
                    {item.Phone || item.TenantPhone}
                  </Text>
                </Text>
                <Text style={styles.title_color}>
                  {' '}
                  <Text style={styles.money_color}>{`${item.Price ||
                    item.HouseRent}元/月`}</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

export default ListItem

import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { dateFormat } from '../../../../../../utils/dateFormat'
import styles from './style'
class ListItem extends Component {
  constructor(props) {
    super(props)
  }
  componentWillMount() {
    console.log(this.props.item)
  }
  render() {
    const item = this.props.item
    return (
      <TouchableOpacity>
        <View style={styles.container}>
          <View style={styles.headContainer}>
            <View style={styles.header_title}>
              <Text style={styles.header_color}>
                {' '}
                应收款日: {dateFormat(item.Date)}
              </Text>
              <Text style={(styles.header_color, styles.red_color)}>
                {' '}
                {item.InOrOutStatusDes}
              </Text>
            </View>
            <View>
              <View style={styles.list_item}>
                <Text style={styles.title_color}>
                  房源名称:{' '}
                  <Text style={styles.content_color}>{item.HouseName}</Text>{' '}
                </Text>
                <Text style={styles.title_color}>
                  {' '}
                  <Text style={styles.content_color}>
                    {' '}
                    {`${item.Amount}元`}
                  </Text>
                </Text>
              </View>
              <View style={styles.list_item}>
                <Text style={styles.title_color}>
                  项目:{' '}
                  <Text style={styles.content_color}>
                    {item.BillProjectName}
                  </Text>{' '}
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

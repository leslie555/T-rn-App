import React, { Component } from 'react'
import { View, Text } from 'react-native'
import styles from './style'

const ListItem = ({ item }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headContainer}>
        <View style={styles.header_title}>
          <Text style={styles.header_color}>
            {item.HouseName.length > 30
              ? item.HouseName.slice(0, 30) + '...'
              : item.HouseName}
          </Text>
          <Text style={styles.money_color}>{`${item.AvgMoney}元`}</Text>
        </View>
        <View>
          <View style={styles.list_item}>
            <Text style={styles.title_color}>
              业主租金：
              <Text style={styles.content_color}>
                {`${item.OwnerMoney}元/月`}
              </Text>
            </Text>
            <Text style={styles.title_color}>
              租客租金：
              <Text
                style={styles.content_color}
              >{`${item.TenMoney}元/月`}</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
export default ListItem

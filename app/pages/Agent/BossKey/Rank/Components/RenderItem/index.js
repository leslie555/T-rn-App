import React, { Component } from 'react'
import { Text, View, StyleSheet, Image } from 'react-native'
import { DisplayStyle } from '../../../../../../styles/commonStyles'
// import store from '../../../../../../redux/store/store'

export default class RenderItem extends Component {
  constructor(props) {
    super(props)
    this.isShowCrown = [2, 4].indexOf(this.props.rankType) === -1
  }


  
  render() {
    const { item, index } = this.props
    const { label1, label2 } = this.props.itemValue
    const quantity = this.props.activeBtn === 1 ? (item[label1] + (label1 === 'Rate' ? '%' : '')) : (item[label2] + (label2 === 'Rate' ? '%' : ''))
    return ( this.isShowCrown && index < 3) ? (
      <View
        style={[
          styles.bodyRow,
          { backgroundColor: index % 2 === 0 ? '#eef4ff' : '#ffffff' },
        ]}
      >
        <Image
          source={
            index === 0
              ? require('../Images/huangguan.png')
              : index === 1
              ? require('../Images/huangguan3.png')
              : require('../Images/huangguan_1.png')
          }
          style={styles.top3_icon}
        />
        <Text style={[styles.storeName]}>{item.Name}</Text>
        <Text style={[styles.storeName]}>{item.PrincipalUserName}</Text>
        <Text style={styles.quantity}>{quantity}</Text>
      </View>
    ) : (
      <View
        style={[
          styles.bodyRow,
          { backgroundColor: index % 2 === 0 ? '#eef4ff' : '#ffffff' },
        ]}
        key={index}
      >
        <Text style={styles.rank1}>{index + 1}</Text>
        <Text style={[styles.storeName]}>{item.Name}</Text>
        <Text style={[styles.storeName]}>{item.PrincipalUserName}</Text>
        <Text style={styles.quantity}>{quantity}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  top3_icon: {
    width: 25,
    height: 20,
  },
  bodyRow: {
    height: 40,
    ...DisplayStyle('row', 'center', 'space-between'),
    paddingHorizontal: 15,
  },
  rank1: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    width: 25,
    height: 20,
  },
  storeName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    flex: 1,
  },
  quantity: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    width: 60,
    flexWrap: "wrap"
  },
})

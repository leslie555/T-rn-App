import React, {Fragment} from 'react'
import {BossKeyShareHouseInfoReport} from '../../../../../api/bossKey'
import {Image, Text, TouchableOpacity, View} from 'react-native'
import {Container} from '../../../../../styles/commonStyles'
import {FullModal, Header, ListSelector} from '../../../../../components'
import styles from './style'

export default class MyHouseList extends React.Component {
  constructor(props) {
    super(props)
    this.searchRef = null
    this.form = {
      CityCode: '5101XX', // 区域城市码
      RentType: 0, // 整合租 值： 0，1,2
    }
    this.bgUrl = require('./images/bg.png')
    this.listConfig = [
      {
        type: 'title',
        title: '城市',
        selectedIndex: 0,
        data: [
          {
            title: '成都',
            value: '5101XX'
          },
          {
            title: '重庆',
            value: '5001XX'
          }
        ]
      },
      {
        type: 'title',
        title: '出租方式',
        data: [
          {
            title: '全部',
            value: 0
          },
          {
            title: '整租',
            value: 1
          },
          {
            title: '合租',
            value: 2
          }
        ]
      }
    ]
    this.state = {
      loadingVisible: false,
      result: [],
      total: 0
    }
  }

  componentDidMount() {
    this.getData()
  }

  componentWillUnmount() {

  }

  getData() {
    this.setState({
      loadingVisible: true
    })
    return BossKeyShareHouseInfoReport(this.form).then(({Data}) => {
      const total = Data.reduce((total, x) => {
        return total + x.Count
      }, 0)
      this.setState({
        total,
        result: Data
      })
    }).finally(() => {
      this.setState({
        loadingVisible: false
      })
    })
  }

  goList(item) {
    this.props.navigation.navigate('BossShareHouseList', {
      RentType: this.form.RentType,
      CityCode: item.CityCode
    })
  }

  renderContent() {
    return (
        <View style={styles.content}>
          <View style={styles.content_header}>
            <Text style={styles.header_text}>合计：</Text>
            <Text style={styles.header_num}>{this.state.total}</Text>
            <Text style={styles.header_text}>套</Text>
          </View>
          <View style={styles.content_box}>
            {this.state.result.map((item) => {
              return (
                  <TouchableOpacity onPress={() => {
                    this.goList(item)
                  }} style={styles.content_box_item} key={item.CityCode}>
                    <Image style={styles.content_box_item_img} source={this.bgUrl}/>
                    <Text style={styles.content_box_item_text}>{item.CityName}</Text>
                    <Text style={styles.content_box_item_num}>{item.Count}</Text>
                  </TouchableOpacity>
              )
            })}
          </View>
        </View>
    )
  }

  onSelectMenu(index, subindex, data) {
    switch (index) {
      case 0:
        if (subindex === 0) {
          this.searchRef.manuallySetTitle('成都', 0)
        }
        this.form.CityCode = data.value
        break
      case 1:
        this.form.RentType = data.value
        break
    }
    this.getData()
  }

  render() {
    return (
        <View style={Container}>
          <FullModal visible={this.state.loadingVisible} type={2}/>
          <Header title='共享房源'/>
          <ListSelector
              ref={(ref) => {
                this.searchRef = ref
              }}
              config={this.listConfig}
              onSelectMenu={this.onSelectMenu.bind(this)}
              renderContent={this.renderContent.bind(this)}
          />
        </View>
    )
  }
}

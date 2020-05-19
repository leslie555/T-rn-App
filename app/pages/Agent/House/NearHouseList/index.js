import React, {Fragment} from 'react'
import {SelectNearHouseList} from '../../../../api/house'
import {ScrollView, Text, TouchableOpacity, View} from 'react-native'
import {Container} from '../../../../styles/commonStyles'
import {Header, List} from '../../../../components'
import ListItem from './ListItem'
import ListSelector from "../../../../components/ListSelector";

class MyHouseList extends React.Component {
  constructor(props) {
    super(props)
    this.searchRef = null
    this.circleRef = null
    this.ListSelector = null
    this.query = this.props.navigation.state.params || {} // 路由参数 经纬度
    this.state = {
      form: {
        parm: {
          page: 1,
          size: 15
        },
        Type: 1,
        Lng: this.query.Lng,
        Lat: this.query.Lat,
        Meter: 2000,
        HouseID: this.query.HouseID
      },
      listConfig: [{
        type: 'title',
        title: '200米内',
        selectedIndex: 3,
        data: [
          {
            title: '200米内',
            value: 200
          },
          {
            title: '500米内',
            value: 500
          },
          {
            title: '1千米内',
            value: 1000
          },
          {
            title: '2千米内',
            value: 2000
          }
        ]
      }]
    }
  }

  onSelectMenu = (index, subindex, data) => {
    const form = {...this.state.form}
    form.parm.page = 1
    switch (index) {
      case 0:
        form.Meter = data.value
        this.setState({form})
        break
      default:
        break
    }
  }

  renderContent() {
    const renderItem = ({item}) => {
      return <ListItem item={item} form={this.state.form}/>
    }
    return (
        <List
            request={SelectNearHouseList}
            form={this.state.form}
            setForm={form => this.setState({form})}
            listKey={'AgentNearHouseList'}
            renderItem={renderItem}
        />
    )
  }

  render() {
    return (
        <View style={Container}>
          <Header title='附近房源'/>
          <ListSelector
              ref={ListSelector => (this.ListSelector = ListSelector)}
              config={this.state.listConfig}
              onSelectMenu={this.onSelectMenu}
              renderContent={this.renderContent.bind(this)}
          />
        </View>
    )
  }
}

export default MyHouseList

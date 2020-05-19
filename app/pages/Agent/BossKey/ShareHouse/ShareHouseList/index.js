import React from 'react'
import {ShowBossKeyShareHouseInfoList} from '../../../../../api/bossKey'
import {View} from 'react-native'
import {Container} from '../../../../../styles/commonStyles'
import {Header, List} from '../../../../../components'
import ListItem from "./ListItem";

export default class MyHouseList extends React.Component {
  constructor(props) {
    super(props)
    debugger
    this.query = this.props.navigation.state.params || {} // 路由参数
    this.state = {
      form: {
        parm: {
          page: 1,
          size: 10
        },
        CityCode: this.query.CityCode, // 区域城市码
        FullID: this.query.FullID || '', // 门店
        RentType: this.query.RentType || 0, // 整合租 值： 0，1,2
        VacancyType: this.query.VacancyType || 0, // 空置数据  0.全部空置  1.整租空置 2.合租空置
      }
    }
  }

  render() {
    return (
        <View style={Container}>
          <Header
              title='共享房源'
          />
          <List
              request={ShowBossKeyShareHouseInfoList}
              form={this.state.form}
              setForm={form => this.setState({form})}
              listKey={'BossShareHouseList'}
              primaryKey={'HouseID'}
              renderItem={({item}) => {
                return <ListItem item={item}/>
              }}
          />
        </View>
    )
  }
}

import React, { Component } from 'react'
// import { Text, View } from 'react-native'
import { BoosKeyAveragePriceyRanking, QueryAveragePriceyRanking } from '../../../../../api/bossKey'
import RankList from '../Components'
import store from '../../../../../redux/store/store'

export default class BossKeyRentPrice extends Component {
  constructor(props) {
    super(props)
    // this.fn = this.props.navigation.getParam('type', 'BossKey') === 'Agent' ? QueryAveragePriceyRanking : BoosKeyAveragePriceyRanking
    this.fn = BoosKeyAveragePriceyRanking
    this.isAgent = this.props.navigation.getParam('type', 'BossKey') === 'Agent'
    // this.fn = BoosKeyAveragePriceyRanking
  }
  render() {
    return (
      <RankList
        isAgent={this.isAgent}
        rankType={7}
        rankFormParam={'RentType'}
        request={BoosKeyAveragePriceyRanking}
      />
    )
  }
}

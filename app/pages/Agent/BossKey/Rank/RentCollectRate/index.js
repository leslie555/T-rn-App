import React, { Component } from 'react'
// import { Text, View } from 'react-native'
import { QueryBossKeyRentRateRankingList } from '../../../../../api/bossKey'
import RankList from '../Components'

export default class BossKeyRentCollectRate extends Component {
  render() {
    return (
      <RankList
        rankType={3}
        rankFormParam={'RentRateRankingType'}
        request={QueryBossKeyRentRateRankingList}
        itemValue={{ label1: 'Rate', label2: 'Rate' }}
        timeKey={'TimerShaft'}
      />
    )
  }
}

import React, { Component } from 'react'
import RankList from '../Components'
import { QueryHouseInList } from '../../../../../api/bossKey'

export default class BossKeyHouseIn extends Component {
  render() {
    return (
      <RankList
        request={QueryHouseInList}
        rankType={6}
        rankFormParam={'TakeHouseRankingType'}
        timeKey={'TimerShaft'}
        itemValue={{ label1: 'Count', label2: 'Count'}}
      />
    )
  }
}

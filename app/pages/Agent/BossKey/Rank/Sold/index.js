import React, { Component } from 'react'
import RankList from '../Components'
import { QueryBossKeyOutBillingRankingList } from '../../../../../api/bossKey'

export default class BossKeyOutBilling extends Component {
  render() {
    return (
      <RankList
        rankType={1}
        rankFormParam={'OutHouseRankingType'}
        request={QueryBossKeyOutBillingRankingList}
        timeKey={'TimerShaft'}
        itemValue={{ label1: 'Count', label2: 'Count'}}
      />
    )
  }
}

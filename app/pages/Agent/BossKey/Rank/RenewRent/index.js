import React, { Component } from 'react'
import RankList from '../Components'
import { QueryBossKeyOutBillingRankingList } from '../../../../../api/bossKey'

export default class RenewRent extends Component {
  render() {
    return (
      <RankList
        request={QueryBossKeyOutBillingRankingList}
        rankType={5}
        otherParm={{'OutHRIsRenewal': 1}}
        rankFormParam={'OutHouseRankingType'}
        itemValue={{ label1: 'Count', label2: 'Count'}}
        timeKey={'TimerShaft'}
      />
    )
  }
}

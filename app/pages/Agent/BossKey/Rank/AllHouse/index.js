import React, { Component } from 'react'
import RankList from '../Components'
import { QueryBossKeyAllHouseRankingList } from '../../../../../api/bossKey'

export default class BossKeyAllHouse extends Component {
  render() {
    return (
      <RankList
        request={QueryBossKeyAllHouseRankingList}
        rankType={0}
        itemValue={{ label1: 'Count', label2: 'Count' }}
        otherParm={{ SortWay: 2 }}
      />
    )
  }
}

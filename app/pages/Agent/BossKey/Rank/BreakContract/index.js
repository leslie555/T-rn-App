import React, { Component } from 'react'
import RankList from '../Components'
import { QueryBreakContractList } from '../../../../../api/bossKey'

export default class BossKeyBreakContract extends Component {
  render() {
    return (
      <RankList
        request={QueryBreakContractList}
        rankType={4}
        rankFormParam={'DefaultRankingType'}
        itemValue={{ label1: 'Value', label2: 'Value'}}
      />
    )
  }
}

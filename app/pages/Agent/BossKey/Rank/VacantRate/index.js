import React, { Component } from 'react'
import { QueryVacancyRankingList } from '../../../../../api/bossKey'
import RankList from '../Components'

export default class BossKeyRankVacant extends Component {
  render() {
    return (
      <RankList
        rankType={2}
        request={QueryVacancyRankingList}
        itemValue={{ label1: 'Count', label2: 'Rate' }}
        otherParm={{ SelectType: 1, RentType: 0 }}
      />
    )
  }
}

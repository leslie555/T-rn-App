import request from '../utils/request'

// 违约收入查询
export function SelectBossDefault(data) {
  return request({
      url: '/ExecutiveMethod/SelectDefault',
      method: 'post',
      data
  })
}

// 近七天违约
export function SelectDefaultNearlySevenDay(data) {
  return request({
      url: '/ExecutiveMethod/SelectDefaultNearlySevenDay',
      method: 'post',
      data
  })
}

// 近6月违约
export function SelectDefaultNearlySixMonth(data) {
  return request({
      url: '/ExecutiveMethod/SelectDefaultNearlySixMonth',
      method: 'post',
      data
  })
}

// // 近七天业主违约
// export function SelectOwnDefaultNearlySevenDay(data) {
//   return request({
//       url: '/ExecutiveMethod/SelectOwnDefaultNearlySevenDay',
//       method: 'post',
//       data
//   })
// }

// // 近6月业主违约
// export function SelectOwnDefaultNearlySixMonth(data) {
//   return request({
//       url: '/ExecutiveMethod/SelectOwnDefaultNearlySixMonth',
//       method: 'post',
//       data
//   })
// }

// 租客、业主违约列表
export function SelectBossDefaultList(data) {
  return request({
      url: '/OperateMethod/SelectBossDefaultList',
      method: 'post',
      data
  })
}

// 收入、支出列表
export function SelectBossDefaultInOrOut(data) {
  return request({
      url: '/OperateMethod/SelectBossDefaultInOrOut',
      method: 'post',
      data
  })
}

// 平均差价
export function BoosKeyAveragePriceyReport(data) {
  return request({
      url: '/OperateMethod/BoosKeyAveragePriceyReport',
      method: 'post',
      data
  })
}

// 租客出单列表
export function BossKeyTenantBillingDetailsList(data) {
  return request({
      url: '/OperateMethod/BossKeyTenantBillingDetailsList',
      method: 'post',
      data
  })
}

// 收租率头部
// export function GetBossKeyRentRateHead(data) {
//   return request({
//       url: '/OperateMethod/BossKeyRentRateList',
//       method: 'post',
//       data
//   })
// }

// 收租率头部 接口-改
export function GetBossKeyRentRateHead(data) {
  return request({
      url: '/ExecutiveMethod/ExecutiveQueryRentRate',
      method: 'post',
      data
  })
}

// 收租率报表
export function GetBossKeyRentRateMonthsReport(data) {
  return request({
      url: '/OperateMethod/BossKeyRentRate',
      method: 'post',
      data
  })
}

// 收租率报表-近七天
export function QueryRentRateSevenDaysChart(data) {
  return request({
      url: '/ExecutiveMethod/ExecutiveNearlySevenDaysRentRate',
      method: 'post',
      data
  })
}

// 收租率报表-近6个月
export function QueryRentRateSixMonthsChart(data) {
  return request({
      url: '/ExecutiveMethod/ExecutiveNearlyJuneRentRate',
      method: 'post',
      data
  })
}

// 合同到期首页
export function ContractExpireHomePage(data) {
  return request({
      url: '/ExecutiveMethod/SelectExpire',
      method: 'post',
      data
  })
}

// 合同到期列表
export function getContractExpireList(data) {
  return request({
      url: '/OperateMethod/SelectBossExpireMoreView',
      method: 'post',
      data
  })
}

// 出单头部
export function GetBossKeyOutBillingHead(data) {
  return request({
      url: '/ExecutiveMethod/SelectOutRoomHome',
      method: 'post',
      data
  })
}

// 出单(租客)报表7天
export function GetBossKeyOutBillingReportDay(data) {
  return request({
      url: '/ExecutiveMethod/SelectOutRoomNearlySevenDay',
      method: 'post',
      data
  })
}

// 出单(租客)报表6月
export function GetBossKeyOutBillingReportMonth(data) {
  return request({
      url: '/ExecutiveMethod/SelectOutRoomNearlySixMonth',
      method: 'post',
      data
  })
}

// 已收已付boss
export function QueryBossReceivable(data) {
  return request({
      url: '/OperateMethod/QueryBossReceivable',
      method: 'post',
      data
  })
}

// 已收已付boss 头部
export function QueryBossReceivableReport(data) {
  return request({
      url: '/OperateMethod/QueryBossReceivableReport',
      method: 'post',
      data
  })
}

// 应收boss 头部-改
// export function QueryBossReceivableReport(data) {
//   return request({
//       url: '/ExecutiveMethod/ShowIncome',
//       method: 'post',
//       data
//   })
// }

// 应收应付boss
export function QueryBossPayable(data) {
  return request({
      url: '/OperateMethod/QueryBossPayable',
      method: 'post',
      data
  })
}

// 应收应付boss 头部
export function QueryBossPayableReport(data) {
  return request({
      url: '/OperateMethod/QueryBossPayableReport',
      method: 'post',
      data
  })
}

// 应付boss 头部-改
// export function QueryBossPayableReport(data) {
//   return request({
//       url: '/ExecutiveMethod/ShowPayable',
//       method: 'post',
//       data
//   })
// }

// 空置率
// export function BoosKeyVacancyReport(data) {
//   return request({
//       url: '/OperateMethod/BoosKeyVacancyReport',
//       method: 'post',
//       data
//   })
// }

// 改-空置率头部
export function BoosKeyVacancyReportHead(data) {
  return request({
      url: '/ExecutiveMethod/ShowHouseVacancyOverview',
      method: 'post',
      data
  })
}

// 改-空置率-报表
export function BoosKeyVacancyReport(data) {
  return request({
      url: '/ExecutiveMethod/ShowHouseVacancyTop6',
      method: 'post',
      data
  })
}

// 房源首页
export function BossKeyShareHouseInfoReport(data) {
  return request({
      url: '/OperateMethod/BossKeyShareHouseInfoReport',
      method: 'post',
      data
  })
}

// 房源列表
export function ShowBossKeyShareHouseInfoList(data) {
  return request({
      url: '/OperateMethod/ShowBossKeyShareHouseInfoList',
      method: 'post',
      data
  })
}

// 房源详情
export function ShowBossKeyShareHouseInfoByID(data) {
  return request({
    url: '/OperateMethod/ShowBossKeyShareHouseInfoByID',
    method: 'post',
    data
  })
}

export function ShowStaffRelationIntoByEmployeeID(data) {
  return request({
    url: '/SystemMethod/ShowStaffRelationIntoByEmployeeID',
    method: 'post',
    data
  })
}

// 违约排行
export function QueryBreakContractList(data) {
  return request({
      url: '/ExecutiveMethod/SelectDefaultRank', 
      method: 'post',
      data
  })
}

// 续租排行
export function QueryRenewRentList(data) {
  return request({
      url: '/OperateMethod/BossRenewalRanking', 
      method: 'post',
      data
  })
}

// 拿房排行
export function QueryHouseInList(data) {
  return request({
      url: '/ExecutiveMethod/ExecutiveTakeRoomRanking', 
      method: 'post',
      data
  })
}

// 空置率排行榜
// export function QueryVacancyRankingList(data) {
//   return request({
//       url: '/OperateMethod/BossKeyVacancyRanking',
//       method: 'post',
//       data
//   })
// }

// 空置率排行榜-改
export function QueryVacancyRankingList(data) {
  return request({
      url: '/ExecutiveMethod/ShowHouseVacancyRanking',
      method: 'post',
      data
  })
}

// 总房源排行榜
// export function QueryBossKeyAllHouseRankingList(data) {
//   return request({
//       url: '/OperateMethod/BossKeyAllHouseRanking',
//       method: 'post',
//       data
//   })
// }

// 总房源排行榜-改
export function QueryBossKeyAllHouseRankingList(data) {
  return request({
      url: '/ExecutiveMethod/ShowHouseAllRanking',
      method: 'post',
      data
  })
}

// 出单排行榜
export function QueryBossKeyOutBillingRankingList(data) {
  return request({
      url: '/ExecutiveMethod/ExecutiveOutRoomRanking',
      method: 'post',
      data
  })
}

// // 收租率排行榜
// export function QueryBossKeyRentRateRankingList(data) {
//   return request({
//       url: '/OperateMethod/BossKeyRentRateRanking',
//       method: 'post',
//       data
//   })
// }

// 收租率排行榜-改
export function QueryBossKeyRentRateRankingList(data) {
  return request({
      url: '/ExecutiveMethod/ExecutiveRentRateRanking',
      method: 'post',
      data
  })
}

// // 租金差排行榜
// export function BoosKeyAveragePriceyRanking(data) {
//   return request({
//       url: '/OperateMethod/BoosKeyAveragePriceyRanking',
//       method: 'post',
//       data
//   })
// }

// 租金差排行榜-经理
export function QueryAveragePriceyRanking(data) {
  return request({
      url: '/OperateMethod/AveragePriceyRanking',
      method: 'post',
      data
  })
}

// 新接口-租金差排行榜
export function BoosKeyAveragePriceyRanking(data) {
  return request({
      url: '/ExecutiveMethod/ShowAvgRentRanking',
      method: 'post',
      data
  })
}

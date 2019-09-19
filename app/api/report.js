import request from '../utils/request'

// 报表 -----> 财务统计模块

// 财务统计报表的头部数据
export function GetFinanceReportHeadData(data) {
  return request({
    url: '/Excel/APPFinanceReport/AppFinanceReportHead',
    method: 'post',
    data
  })
}

// 应收统计报表
export function GetReceivedChartData(data) {
  return request({
    url: '/Excel/APPFinanceReport/AppReceviableStatistics',
    method: 'post',
    data
  })
}

// 应付统计报表
export function GetPayableChartData(data) {
  return request({
    url: '/Excel/APPFinanceReport/AppPayableStatistics',
    method: 'post',
    data
  })
}

// 待收账单分析报表
export function GetWaitBillsChartData(data) {
  return request({
    url: '/Excel/APPFinanceReport/AppReceviableAnalysis',
    method: 'post',
    data
  })
}

// 本月收入报表
export function GetIncomeMonthChartData(data) {
  return request({
    url: '/Excel/APPFinanceReport/AppIncomeMonth',
    method: 'post',
    data
  })
}

// 本月支出报表
export function GetPayMonthChartData(data) {
  return request({
    url: '/Excel/APPFinanceReport/AppPayOutMonth',
    method: 'post',
    data
  })
}

// 近六月税收
export function GetJuneRevenueChartData(data) {
  return request({
    url: '/APPHouse/ShowRevenueSixMonth',
    method: 'post',
    data
  })
}
// 近六月平均差价
export function GetAveragePriceChartData(data) {
  return request({
    url: '/APPHouse/AVGPrice',
    method: 'post',
    data
  })
}

// 租客合同已到期
export function GetTenantExpiredChartData(data) {
  return request({
    url: '/Excel/AppFinanceReport/AppTenantExpired',
    method: 'post',
    data
  })
}

// 业主合同已到期
export function GetOwnerExpiredChartData(data) {
  return request({
    url: '/Excel/AppFinanceReport/AppOwnerExpired',
    method: 'post',
    data
  })
}

// 财务报表查看详细模块
// 待收账单
export function GetWaitBillsData(data) {
  return request({
    url: '/ReportExcel/AppBillReceivable',
    method: 'post',
    data
  })
}

// 获取门店下拉列表的数据
export function GetStoreList(data) {
  return request({
    url: '/SystemMethod/ShowOrganizationbigList',
    method: 'post',
    data
  })
}

// 租客合同到期
export function GetTenantList(data) {
  return request({
    url: '/ReportExcel/QueryAppTenantExpiresList',
    method: 'post',
    data
  })
}

// 业主合同到期
export function GetOwnerList(data) {
  return request({
    // url: '/ReportExcel/QueryAppOwnerExpiresList',
    url: '/OperateMethod/QueryOwnerExpiresList',
    method: 'post',
    data
  })
}

/*近一年收入 */
export function GetNearYearReceivedData(data) {
  return request({
    url: '/ReportExcel/AppNearlyYearReceivable',
    method: 'post',
    data
  })
}

/* 近一年支出 */
export function GetNearYearPayData(data) {
  return request({
    url: '/ReportExcel/AppNearlyYearPayable',
    method: 'post',
    data
  })
}

/**
 *
 * 房源统计
 */

/**头部 */
export function GetStatisticsVacantHeadData(data) {
  return request({
    url: '/OperateMethod/HousingTotal',
    method: 'post',
    data
  })
}

/**柱状图模块 */
/**整租 */
export function GetHouseStatisticsBarEnRentData(data) {
  return request({
    url: '/APPHouse/ShowEntireTenancy',
    method: 'post',
    data
  })
}

/**合租 */
export function GetHouseStatisticsBarShRentData(data) {
  return request({
    url: '/APPHouse/ShowJointTenancy',
    method: 'post',
    data
  })
}

/**空置 */
export function GetStatisticsVacantRateData(data) {
  return request({
    url: '/OperateMethod/ShowVacancyRate',
    method: 'post',
    data
  })
}

/**折线图 */
/**空置 */
export function GetHouseStatisticsLineVacRentData(data) {
  return request({
    url: '/APPHouse/ShowVacancyHouseCount',
    method: 'post',
    data
  })
}

/**整租 */
export function GetHouseStatisticsWholeCountData(data) {
  return request({
    url: '/OperateMethod/ShowVacancyHouseWholeCount',
    method: 'post',
    data
  })
}
// 空置率
export function GetVacancyListQuery(data) {
  return request({
    url: '/OperateMethod/VacancyQuery',
    method: 'post',
    data
  })
}

/**合租 */
export function GetHouseStatisticsCloseCountData(data) {
  return request({
    url: '/OperateMethod/ShowVacancyHouseCloseCount',
    method: 'post',
    data
  })
}

/**其他统计 */
export function GetAppOtherStatisticsData(data) {
  return request({
    url: '/ReportExcel/AppOtherStatistics',
    method: 'post',
    data
  })
}

/**查看更多 空置房源*/
export function GetAppShowVacantHouse(data) {
  return request({
    url: '/OperateMethod/ShowVacantHouse',
    method: 'post',
    data
  })
}
// 业绩统计模块
// 业绩报表——统计页面
export function SelectAllAppPerformance(data) {
    return request({
        url: '/APPFinanceReport/SelectAllAppPerformance',
        method: 'post',
        data
    })
}

// 业绩报表详情——查询近7天/近一年的拿房业绩数据
export function ShowReceiveHousePerformance(data) {
    return request({
        url: '/SystemMethod/ShowReceiveHousePerformance',
        method: 'post',
        data
    })
}

// 业绩报表详情——查询近一年租客续约数据
export function ShowLeaseContract(data) {
    return request({
        url: '/APPHouse/ShowLeaseContract',
        method: 'post',
        data
    })
}

// 业绩报表详情——查询近7天出房/近一年出房业绩数据
export function ShowOutHousePerformance(data) {
    return request({
        url: '/APPHouse/ShowOutHousePerformance',
        method: 'post',
        data
    })
}

//收租率 已收 未收 收租率
export function ShowRentCollection(data) {
  return request({
      url: '/OperateMethod/AppShowRentCollection',
      method: 'post',
      data
  })
}
// 近6月收租率
export function ShowRentingCollection(data) {
  return request({
      url: '/OperateMethod/AppShowRentingCollection',
      method: 'post',
      data
  })
}



//本月已收未收
export function ShowRentCollectionList(data) {
  return request({
      url: '/OperateMethod/AppShowRentCollectionList',
      method: 'post',
      data
  })
}
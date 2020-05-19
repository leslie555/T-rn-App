import NavigationService from '../../router/NavigationService'

const showSelectAny = function(options) {
  let selectAnyProps = {}
  switch (options.apiType) {
    case 1:
      selectAnyProps = {
        searchKey: 'HouseName',
        placeholder:'输入房源关键字进行搜索',
        isPaging: false,
        pageKey: 'para',
        leftLabel: 'HouseName',
        ...options
      }
      break
    case 2:
      selectAnyProps = {
        searchKey: 'CommunityName',
        placeholder: '输入小区关键字进行搜索',
        leftLabel: 'CommunityName',
        rightLabel: 'CityName',
        lightFirstLine: true,
        ...options
      }
      break
    case 3:
      selectAnyProps = {
        placeholder: '输入姓名或电话进行搜索',
        isPaging: false,
        leftLabel: 'UserName',
        rightLabel: 'Tel',
        ...options
      }
      break
    case 4:
      selectAnyProps = {
        placeholder: '输入门店名称进行搜索',
        leftLabel: 'Organization',
        showRestBtn: true,
        pageKey: 'pageParam',
        ...options
      }
      break
    case 5:
      selectAnyProps = {
        isPaging: false,
        placeholder: '输入街道关键字进行搜索',
        leftLabel: 'Street',
        pageKey: 'pageParam',
        emptyRender: true,
        ...options
      }
      break
  }
  NavigationService.navigate('AgentSelectAny', selectAnyProps)
}

export { showSelectAny }

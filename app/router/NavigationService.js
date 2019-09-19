import {NavigationActions} from 'react-navigation'

let _navigator

const setTopLevelNavigator = function (navigatorRef) {
  if (!navigatorRef) return
  _navigator = navigatorRef
}

const navigate = function (routeName, params) {
  _navigator.dispatch(
      NavigationActions.navigate({
        routeName,
        params
      })
  )
}

// 经纪人端tabIndex
let agentTabIndex = 0

// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
  agentTabIndex
}

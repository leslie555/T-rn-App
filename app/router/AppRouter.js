import React from 'react'
import NavigationService from './NavigationService'
import {createAppContainer, createStackNavigator, createSwitchNavigator} from 'react-navigation'
import AuthLoadingScreen from '../pages/Common/Login/AuthLoadingScreen'
import LoginScreen from '../pages/Common/Login/LoginScreen'
import AgentRootStack from './AgentRouter'


export default class AppContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const ManageRootStack = createStackNavigator({Login: LoginScreen}) //预留管理端
    const AuthStack = createStackNavigator({Login: LoginScreen}) // 预留注册相关页面的配置
    const AppContainer = createAppContainer(
        createSwitchNavigator(
            {
              AuthLoading: AuthLoadingScreen,
              AgentApp: AgentRootStack,
              ManageApp: ManageRootStack,
              Auth: AuthStack,
            },
            {
              headerMode: 'none',
              initialRouteName: 'AuthLoading'
            }
        )
    )
    return (
        <AppContainer
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef)
            }}
        />
    )
  }
}

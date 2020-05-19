import {createAppContainer, createStackNavigator, createSwitchNavigator} from 'react-navigation'
import LoginScreen from '../pages/Common/Login/LoginScreen'
//  服务协议 政策隐私
import ServiceContractLogin from '../pages/Common/protocolPolicy/serviceContract'
import PrivacyPolicyLogin from '../pages/Common/protocolPolicy/privacyPolicy'

const AuthStackLogin =  createStackNavigator(
    {
        Login: LoginScreen,
        ServiceContractLogin,
        PrivacyPolicyLogin
    },
    {
      initialRouteName: 'Login',
    //   mode: 'modal',
      headerMode: 'none'
    }
  )

  export default AuthStackLogin
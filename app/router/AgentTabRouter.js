import React from 'react'
import {SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {createBottomTabNavigator, createDrawerNavigator} from 'react-navigation'
import NavigationService from "./NavigationService"
import IconFont from "../utils/IconFont"
import {CommonColor, DEVICE_WIDTH, DisplayStyle} from "../styles/commonStyles"
import HomePage from "../pages/Agent/HomePage";
import HomePageDrawer from "../pages/Agent/HomePage/components/DrawerBox";
import MyHouseList from "../pages/Agent/House/MyHouseList";
import ContractList from "../pages/Agent/Contract/ContractList";
import PayReceiptList from "../pages/Agent/Finance/PayReceiptList";

const AgentBottomTab = createBottomTabNavigator(
    {
      AgentHomePage: {
        screen: HomePage
      },
      AgentMyHouseList: {
        screen: MyHouseList
      },
      AgentAddIcon: {
        screen: MyHouseList // 随便放一个组件 反正没用
      },
      AgentContractList: {
        screen: ContractList
      },
      AgentPayReceiptList: {
        screen: PayReceiptList
      }
    },
    {
      backBehavior: 'none',
      defaultNavigationOptions: ({navigation}) => ({
        tabBarIcon: ({focused, horizontal, tintColor}) => {
          const {routeName} = navigation.state;
          let title = ''
          let index = 0
          let iconName;
          let activeIconName;
          if (routeName === 'AgentHomePage') {
            title = '首页'
            index = 0
            iconName = 'homedefault'
            activeIconName = 'shouye'
          } else if (routeName === 'AgentMyHouseList') {
            title = '个人房源'
            index = 1
            iconName = 'househollow'
            activeIconName = 'fangyuan'
          } else if (routeName === 'AgentAddIcon') {
            return (
                <TouchableOpacity style={styles.barBox} onPress={() => {
                  console.log(0)
                  NavigationService.navigate('AgentAddBox', {index: NavigationService.agentTabIndex})
                }}>
                  <View style={styles.addIconBox}>
                    <IconFont name={'jiahao'} size={14} color={'#fff'}/>
                  </View>
                </TouchableOpacity>
            )
          } else if (routeName === 'AgentContractList') {
            title = '合同管理'
            index = 2
            iconName = 'precontract'
            activeIconName = 'hetong'
          } else if (routeName === 'AgentPayReceiptList') {
            title = '收付款'
            index = 3
            iconName = 'shiliangzhinengduixiang1'
            activeIconName = 'shiliangzhinengduixiang'
          }

          // You can return any component that you like here!
          return (<TouchableOpacity style={styles.barBox} onPress={() => {
            NavigationService.agentTabIndex = index
            NavigationService.navigate(routeName)
          }}>
            <View style={styles.barIconBox}>
              <IconFont style={styles.barIconMain} name={iconName} size={20} color={'#000'}/>
              {focused && <IconFont style={styles.barIconActive} name={activeIconName} size={17} color={tintColor}/>}
            </View>
            <Text style={{...styles.barLabel, color: tintColor}}>{title}</Text>
          </TouchableOpacity>);
        },
      }),
      tabBarOptions: {
        activeTintColor: CommonColor.color_primary,
        inactiveTintColor: '#444',
        showLabel: false,
        style: {
          borderTopColor: '#ddd'
        }
      }
    }
)
export default createDrawerNavigator({
  AgentBottomTabInner: {
    screen: AgentBottomTab,
  }
}, {
  drawerLockMode: 'unlocked',//设置是否响应手势
  //'unlocked'   可以通过手势和代码 打开关闭抽屉
  //'locked-closed' 抽屉关闭状态  不能通过手势打开  只能通过代码实现
  //'locked-open'  抽屉打开状态  不能通过手势关闭  只能通过代码实现


  drawerWidth: 300, //抽屉的宽度或返回的功能。
  drawerPosition: 'left', //选项是left或right。默认是left位置。
  // useNativeAnimations: true, //启用原生动画。默认是true。
  // drawerBackgroundColor: 'pink', //使用抽屉背景获取某种颜色。默认是white。

  //用于呈现抽屉内容的组件，例如导航项。收到navigation抽屉的道具。默认为DrawerItems
  //用于自定义
  contentComponent: HomePageDrawer,
  // drawerType: 'slide',
  overlayColor: 'rgba(0,0,0,.5)'
});


const styles = StyleSheet.create({
  barBox: {
    width: DEVICE_WIDTH / 5 + 50, // +50 解决点击错乱问题
    // flex: 1,
    height: 50,
    ...DisplayStyle('column', 'center', 'center')
  },
  barIconBox: {
    width: 24,
    height: 24,
    position: 'relative',
    ...DisplayStyle('row', 'center', 'center')
  },
  barLabel: {
    fontSize: 12,
    color: '#444'
  },
  barIconMain: {
    position: 'absolute',
    zIndex: 9
  },
  barIconActive: {
    position: 'relative',
    zIndex: 8,
    left: 2
  },
  addIconBox: {
    width: 44,
    height: 32,
    backgroundColor: CommonColor.color_primary,
    borderRadius: 5,
    ...DisplayStyle('row', 'center', 'center')
  }
})

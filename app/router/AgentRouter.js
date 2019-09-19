import React from 'react'
import {Animated, Easing, Platform, Text, View} from 'react-native'
import StackViewStyleInterpolator from 'react-navigation-stack/src/views/StackView/StackViewStyleInterpolator'
import {createStackNavigator} from 'react-navigation'
import AgentTabNavigator from './AgentTabRouter'
import AgentResetPassword from '../pages/Agent/UserCenter/ResetPassword'
// modal 页面
import AgentUploadImage from '../pages/Common/UploadImage'
import AgentSelectAny from '../pages/Common/SelectAny'
import AgentAddBox from '../pages/Agent/HomePage/components/AddBox'
import AgentEditFitUpEquipments from '../pages/Agent/Contract/EditFitUpEquipments'
import AgentEditRentIncludeCost from '../pages/Agent/Contract/EditRentIncludeCost'
import AgentEditContractEquipments from '../pages/Agent/Contract/EditContractEquipments'
// 主页面
import AgentPrivateAccount from '../pages/Agent/UserCenter/PrivateAccount'
// 测算
import AgentInHouseCalculate from '../pages/Agent/Calculate/InHouse'
import AgentOutHouseCalculate from '../pages/Agent/Calculate/OutHouse'
// 房源
import AgentShareHouseList from '../pages/Agent/House/ShareHouseList'
import AgentEditHouse from '../pages/Agent/House/EditHouse'
import AgentHouseDetail from '../pages/Agent/House/HouseDetail'
import AgentSetFixtures from '../pages/Agent/House/SetFixtures'
import AgentHousePush from '../pages/Agent/House/HousePush'
import AgentHouseInfo from '../pages/Agent/House/HouseInfo'
import AgentOrderList from '../pages/Agent/House/Order/index'
import AgentOrderDetail from '../pages/Agent/House/Order/OrderDetail'
import AgentAddOrder from '../pages/Agent/House/Order/AddOrder'
import AgentAddOrderRemark from '../pages/Agent/House/Order/AddOrderRemark'
// 合同
import AgentEditOwnerContract from '../pages/Agent/Contract/EditOwnerContract'
import AgentEditTenantContract from '../pages/Agent/Contract/EditTenantContract'
import AgentContractSign from '../pages/Agent/Contract/ContractSign'
import AgentAddBookKeeping from '../pages/Agent/Contract/AddBookKeeping'
import AgentCheckOutContract from '../pages/Agent/Contract/CheckOutContract'
import AgentViewContractPDF from '../pages/Agent/Contract/ViewContractPDF'
import AgentContractDetail from '../pages/Agent/Contract/ContractDetail/index'
import AgentSignUpOnlineList from '../pages/Agent/Contract/ContractList/SignUpOnline'
// 消息
import AgentMyMsg from '../pages/Agent/UserCenter/MyMsg/index'
import AgentMsgDetail from '../pages/Agent/UserCenter/MyMsg/pages/MsgDetail'
// 待办
import AgentMyThings from '../pages/Agent/UserCenter/MyThings/index'
import AgentAddThing from '../pages/Agent/UserCenter/MyThings/pages/AddThing'
import AgentThingDetail from '../pages/Agent/UserCenter/MyThings/pages/ThingDetail'
// 收付款
import AgentPayReceiptList from '../pages/Agent/Finance/PayReceiptList'
import AgentPayReceiptDetail from '../pages/Agent/Finance/PayReceiptDetail'
import AgentEditPayReceipt from '../pages/Agent/Finance/EditPayReceipt'
import AgentEditBillDetails from '../pages/Agent/Finance/EditBillDetails'
// 审批
import AgentMyApprovalList from '../pages/Agent/UserCenter/MyApprovalList'
import AgentApprovalDetail from '../pages/Agent/UserCenter/ApprovalDetail'
import AgentConfirmAudit from '../pages/Agent/UserCenter/ConfirmAudit'
// 聚合支付
import AgentAggregatePayList from '../pages/Agent/Finance/AggregatePayList'
import AgentAggregatePayDetail from '../pages/Agent/Finance/AggregatePayDetail'
import AgentAggPayPage from '../pages/Agent/Finance/AggPayPage'
import AgentSelectAggPayMode from '../pages/Agent/Finance/SelectAggPayMode'
// 支付
import AgentPayPage from '../pages/Agent/Finance/PayPage'
import AgentSelectPayMode from '../pages/Agent/Finance/SelectPayMode'
// 转介绍（租客）
import AgentReferTenant from '../pages/Agent/Statistics/ReferTenantOwner'
// 转介绍（房东）
import AgentReferLandlord from '../pages/Agent/Statistics/ReferLandlordOwner'
// 租客违约
import AgentTenantDefaults from '../pages/Agent/Statistics/TenantDefaultsOwner'
import AgentOwnerExpire from '../pages/Agent/Statistics/PersonAccount/OwnerExpire'
import AgentTenantExpire from '../pages/Agent/Statistics/PersonAccount/TenantExpire'
import AgentBreachContract from '../pages/Agent/Statistics/PersonAccount/OwnerBreachContract'
import AgentBreachList from '../pages/Agent/Statistics/PersonAccount/OwnerBreachContract/OwnerBreachList'
//收租率
import AgentCollectRentalsRate from '../pages/Agent/Statistics/CollectRentalsRate'
import AgentReceivedList from '../pages/Agent/Statistics/CollectRentalsRate/pages/Received'
import AgentUnReceivedList from '../pages/Agent/Statistics/CollectRentalsRate/pages/UnReceived'
//空置率
import AgentVacantRate from '../pages/Agent/Statistics/VacantRate'
import AgentVacantHouseList from '../pages/Agent/Statistics/VacantRate/pages/VacantHouseList'
//资源 房东房源备案
import AgentOwnerResource from '../pages/Agent/Resource/OwnerResource'
import AgentPrivateGuestDetail from '../pages/Agent/Resource/OwnerResource/pages/PrivateGuestDetail'
import AgentEditOwnerResource from '../pages/Agent/Resource/OwnerResource/pages/EditOwnerResource'
// 收入/支出记账
import AgentIncomeOrExpendAccount from '../pages/Agent/Finance/IncomeOrExpendAccount'
import AgentTenantDefaultsDetail from '../pages/Agent/Statistics/TenantDefaultsDetail'
//新增记账
import AgentEditCashBook from '../pages/Agent/Finance/EditCashBook'
// 记账详情
import AgentAccountDetails from '../pages/Agent/Finance/IncomeOrExpendAccount/AccountDetails'
//装修申请
import AgentRenovationNav from "../pages/Agent/RenovationApply/RenovationNav"
import AgentRenovationApplyList from "../pages/Agent/RenovationApply/RenovationApplyList"
import AgentRenovationApplyDetail from "../pages/Agent/RenovationApply/RenovationApplyDetail"
import AgentRenovationApproval from "../pages/Agent/RenovationApply/RenovationApproval"
import AgentAddRenovationApply from '../pages/Agent/RenovationApply/AddRenovationApply'
import AgentRenovationProject from '../pages/Agent/RenovationApply/RenovationProject'
// 维修和保洁
import AgentRepairCleanApplyList from "../pages/Agent/RenovationApply/CleanRepairList"
import AgentRepairCleanApplyDetail from "../pages/Agent/RenovationApply/CleanRepairApplyDetail"
import AgentAddRepairCleanApply from "../pages/Agent/RenovationApply/AddCleanRepairApply"

// 用于配置页面
const AgentPages = createStackNavigator(
  {
    AgentBottomTab: AgentTabNavigator,
    AgentPrivateAccount,
    AgentShareHouseList,
    AgentEditHouse,
    AgentHouseDetail,
    AgentSetFixtures,
    AgentEditOwnerContract,
    AgentEditTenantContract,
    AgentContractSign,
    AgentAddBookKeeping,
    AgentCheckOutContract,
    AgentViewContractPDF,
    AgentContractDetail,
    AgentMyMsg,
    AgentMsgDetail,
    AgentMyThings,
    AgentAddThing,
    AgentThingDetail,
    AgentPayReceiptList,
    AgentEditPayReceipt,
    AgentEditBillDetails,
    AgentPayReceiptDetail,
    AgentReferTenant,
    AgentReferLandlord,
    AgentTenantDefaults,
    AgentAggregatePayList,
    AgentAggregatePayDetail,
    AgentAggPayPage,
    AgentSelectAggPayMode,
    AgentOwnerExpire,
    AgentTenantExpire,
    AgentBreachContract,
    AgentMyApprovalList,
    AgentApprovalDetail,
    AgentConfirmAudit,
    AgentBreachList,
    AgentPayPage,
    AgentSelectPayMode,
    AgentCollectRentalsRate,
    AgentReceivedList,
    AgentUnReceivedList,
    AgentVacantRate,
    AgentVacantHouseList,
    AgentOwnerResource,
    AgentPrivateGuestDetail,
    AgentEditOwnerResource,
    AgentOrderList,
    AgentAddOrder,
    AgentOrderDetail,
    AgentAddOrderRemark,
    AgentIncomeOrExpendAccount,
    AgentAccountDetails,
    AgentTenantDefaultsDetail,
    AgentResetPassword,
    AgentEditCashBook,
    AgentInHouseCalculate,
    AgentOutHouseCalculate,
    AgentSignUpOnlineList,
    AgentHousePush,
    AgentHouseInfo,
    AgentAddRenovationApply,
    AgentRenovationProject,
    AgentRenovationNav,
    AgentRenovationApplyList,
    AgentRenovationApplyDetail,
    AgentRenovationApproval,
    AgentRepairCleanApplyList,
    AgentRepairCleanApplyDetail,
    AgentAddRepairCleanApply,
  },
  {
    initialRouteName: "AgentBottomTab",
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      // 修改页面跳转动画方向
      screenInterpolator: StackViewStyleInterpolator.forHorizontal,
    }),
    headerMode: "none",
  }
)
// 用于配置页面性组件 modal
export default createStackNavigator(
    {
      AgentUploadImage,
      AgentSelectAny,
      AgentAddBox,
      AgentEditFitUpEquipments,
      AgentEditRentIncludeCost,
      AgentEditContractEquipments,
      AgentPages
    },
    {
      initialRouteName: 'AgentPages',
      mode: 'modal',
      headerMode: 'none'
    }
)

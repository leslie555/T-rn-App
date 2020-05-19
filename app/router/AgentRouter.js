import React from 'react'
import { Animated, Easing, Platform, Text, View } from 'react-native'
import StackViewStyleInterpolator from 'react-navigation-stack/src/views/StackView/StackViewStyleInterpolator'
import { createStackNavigator } from 'react-navigation'
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

// 同意免租声明书
import AgentAgreeFreeStatement from '../pages/Agent/Agreement/AgreeFreeStatement'
// 同意免租声明书--修改(新增)
import AgentEditAgreeFreeStatement from '../pages/Agent/Agreement/components/EditAgreeFreeStatement'
// 同意免租声明书--详情
import AgentDetailAgreeFreeStatement from '../pages/Agent/Agreement/components/DetailAgreeFreeStatement'
// 合同解除同意书
import AgentContractRemoveAgree from '../pages/Agent/Agreement/ContractRemoveAgree'
// 合同解除同意书--修改(新增)
import AgentEditContractRemoveAgree from '../pages/Agent/Agreement/components/EditContractRemoveAgree'
// 合同解除同意书--详情
import AgentDetailContractRemoveAgree from '../pages/Agent/Agreement/components/DetailContractRemoveAgree'
// 测算
import AgentInHouseCalculate from '../pages/Agent/Calculate/InHouse'
import AgentOutHouseCalculate from '../pages/Agent/Calculate/OutHouse'
// 房源
import AgentShareHouseList from '../pages/Agent/House/ShareHouseList'
import AgentNearHouseList from '../pages/Agent/House/NearHouseList'
import AgentEditHouse from '../pages/Agent/House/EditHouse'
import AgentHouseDetail from '../pages/Agent/House/HouseDetail'
import AgentSetFixtures from '../pages/Agent/House/SetFixtures'
import AgentHousePush from '../pages/Agent/House/HousePush'
import AgentHouseInfo from '../pages/Agent/House/HouseInfo'
import AgentOrderList from '../pages/Agent/House/Order/index'
import AgentOrderDetail from '../pages/Agent/House/Order/OrderDetail'
import AgentAddOrder from '../pages/Agent/House/Order/AddOrder'
import AgentEditOrder from '../pages/Agent/House/Order/EditOrder'
import AgentAddOrderRemark from '../pages/Agent/House/Order/AddOrderRemark'
import AgentSignUpDepositBar from '../pages/Agent/House/Order/SignUpDepositBar'
import AgentSignUpH5Container from '../pages/Agent/House/Order/SignUpH5Container'
// 合同
import AgentEditOwnerContract from '../pages/Agent/Contract/EditOwnerContract'
import AgentEditTenantContract from '../pages/Agent/Contract/EditTenantContract'
import AgentContractSign from '../pages/Agent/Contract/ContractSign'
import AgentAddBookKeeping from '../pages/Agent/Contract/AddBookKeeping'
import AgentCheckOutContract from '../pages/Agent/Contract/CheckOutContract'
// 租客退房（新）
import AgentTenantCheckout from '../pages/Agent/Contract/TenantCheckout'
import AgentEditSublease from '../pages/Agent/Contract/EditSublease'
import AgentSubleaseDetail from '../pages/Agent/Contract/SubleaseDetail'
import AgentCheckOutDetail from '../pages/Agent/Contract/CheckOutDetail'
import AgentCheckOutCostProject from '../pages/Agent/Contract/TenantCheckout/components/CostProject'
// 租客合同-费用项目（新）
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
import AgentPayReceiptDetail from '../pages/Agent/Finance/PayReceiptDetail/index'
import AgentPayReceiptWebView from '../pages/Agent/Finance/PayReceiptDetail/webView'
import AgentPayReceiptToast from '../pages/Agent/Finance/PayReceiptDetail/toast'
import AgentEditPayReceipt from '../pages/Agent/Finance/EditPayReceipt'
import AgentEditBillDetails from '../pages/Agent/Finance/EditBillDetails'
// 财务报销
import AgentWriteOff from '../pages/Agent/Finance/WriteOff'
import AgentWriteOffDetail from '../pages/Agent/Finance/WriteOff/detail'
import AgentAddWriteOff from '../pages/Agent/Finance/WriteOff/AddWriteOff'
// 审批
import AgentMyApprovalList from '../pages/Agent/UserCenter/MyApprovalList'
// 新审批
import AgentMyApprovalNewList from '../pages/Agent/UserCenter/MyApprovalList/newIndex'
import AgentApprovalDetail from '../pages/Agent/UserCenter/ApprovalDetail'
import AgentConfirmAudit from '../pages/Agent/UserCenter/ConfirmAudit'
import AgentPurchaseApproval from '../pages/Agent/UserCenter/MyApprovalList/PurchaseApproval'
import AgentAddPurchaseApproval from '../pages/Agent/UserCenter/MyApprovalList/AddPurchaseApproval'
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
import AgentRenovationNav from '../pages/Agent/RenovationApply/RenovationNav'
import AgentRenovationApplyList from '../pages/Agent/RenovationApply/RenovationApplyList'
import AgentRenovationApplyDetail from '../pages/Agent/RenovationApply/RenovationApplyDetail'
import AgentRenovationApproval from '../pages/Agent/RenovationApply/RenovationApproval'
import AgentAddRenovationApply from '../pages/Agent/RenovationApply/AddRenovationApply'
import AgentRenovationProject from '../pages/Agent/RenovationApply/RenovationProject'
// 维修和保洁
import AgentRepairCleanApplyList from '../pages/Agent/RenovationApply/CleanRepairList'
import AgentRepairCleanApplyDetail from '../pages/Agent/RenovationApply/CleanRepairApplyDetail'
import AgentAddRepairCleanApply from '../pages/Agent/RenovationApply/AddCleanRepairApply'
// 搬家
import AgentMoveApplyList from '../pages/Agent/RenovationApply/MoveApplyList'
import AgentMoveApplyDetail from '../pages/Agent/RenovationApply/MoveApplyDetail'
import AgentAddMoveApply from '../pages/Agent/RenovationApply/AddMoveApply'
// 老板键
// 首页
import BossHomePage from '../pages/Agent/BossKey/HomePage'
//房源
import BossShareHouseHome from '../pages/Agent/BossKey/ShareHouse/ShareHouseHome'
import BossShareHouseList from '../pages/Agent/BossKey/ShareHouse/ShareHouseList'
import BossShareHouseDetail from '../pages/Agent/House/HouseDetail'
// 违约
import BossDefault from '../pages/Agent/BossKey/Default'
// 收入支出列表
import BossIncomeExpendList from '../pages/Agent/BossKey/Default/IncomeExpendList'
// 业主/租客 -- 合同列表
import BossOwnerTenantContractList from '../pages/Agent/BossKey/Default/OwnerTenantContractList'
// 平均差价
import BossAveragePrice from '../pages/Agent/BossKey/AveragePrice'
// 收租率
import BossRentRate from '../pages/Agent/BossKey/RentRate'
// 出单(租客)
import BossOutBilling from '../pages/Agent/BossKey/OutSingle'
// 合同到期
import BossContractExpire from '../pages/Agent/BossKey/ContractExpires'
// 合同到期列表
import BossContractExpireList from '../pages/Agent/BossKey/ContractExpires/ContractExpireList'
// 合同到期详情
import BossContractExpireDetail from '../pages/Agent/BossKey/ContractExpires/ContractExpireDetail'
// 应收应付
import BossReceivable from '../pages/Agent/BossKey/ShouldPayReceive/BossReceivable'
import BossHandle from '../pages/Agent/BossKey/ShouldPayReceive/BossHandle'
// 空置率
import BossVacantRate from '../pages/Agent/BossKey/VacancyRate/index'

// 老板键排行榜
// 出单排行榜
import BossKeySoldRank from '../pages/Agent/BossKey/Rank/Sold'
// 空置率排行榜
import BossKeyVacantRateRank from '../pages/Agent/BossKey/Rank/VacantRate'
// 收租率排行榜
import BossKeyRentCollectRateRank from '../pages/Agent/BossKey/Rank/RentCollectRate'
// 违约排行榜
import BossKeyBreakContractRank from '../pages/Agent/BossKey/Rank/BreakContract'
// 续租排行榜
import BossKeyRenewRentRank from '../pages/Agent/BossKey/Rank/RenewRent'
// 拿房排行榜
import BossKeyHouseInRank from '../pages/Agent/BossKey/Rank/HouseIn'
// 总房源排行榜
import BossKeyAllHouseRank from '../pages/Agent/BossKey/Rank/AllHouse'
// 租金差排行榜
import BossKeyRentPrice from '../pages/Agent/BossKey/Rank/RentPrice/index'

//  服务协议 政策隐私
import ServiceContract from '../pages/Common/protocolPolicy/serviceContract'
import PrivacyPolicy from '../pages/Common/protocolPolicy/privacyPolicy'

// 用于配置页面
const AgentPages = createStackNavigator(
  {
    AgentBottomTab: AgentTabNavigator,
    AgentPrivateAccount,
    AgentAgreeFreeStatement,
    AgentEditAgreeFreeStatement,
    AgentDetailAgreeFreeStatement,
    AgentContractRemoveAgree,
    AgentEditContractRemoveAgree,
    AgentDetailContractRemoveAgree,
    AgentShareHouseList,
    AgentNearHouseList,
    BossContractExpire,
    BossContractExpireList,
    BossContractExpireDetail,
    AgentEditHouse,
    AgentHouseDetail,
    AgentSetFixtures,
    AgentEditOwnerContract,
    AgentEditTenantContract,
    AgentContractSign,
    AgentAddBookKeeping,
    AgentCheckOutContract,
    AgentEditSublease,
    AgentSubleaseDetail,
    AgentCheckOutDetail,
    AgentCheckOutCostProject,
    AgentTenantCheckout,
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
    AgentWriteOff,
    AgentWriteOffDetail,
    AgentAddWriteOff,
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
    AgentMyApprovalNewList,
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
    AgentEditOrder,
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
    AgentPayReceiptWebView,
    AgentPayReceiptToast,
    BossHomePage,
    BossShareHouseHome,
    BossShareHouseList,
    BossShareHouseDetail,
    BossDefault,
    BossIncomeExpendList,
    BossOwnerTenantContractList,
    BossAveragePrice,
    BossRentRate,
    BossOutBilling,
    BossReceivable,
    BossHandle,
    BossVacantRate,
    AgentSignUpDepositBar,
    AgentSignUpH5Container,
    BossKeyRentPrice,
    BossKeySoldRank,
    BossKeyVacantRateRank,
    BossKeyRentCollectRateRank,
    BossKeyBreakContractRank,
    BossKeyRenewRentRank,
    BossKeyHouseInRank,
    BossKeyAllHouseRank,
    AgentMoveApplyList,
    AgentMoveApplyDetail,
    AgentAddMoveApply,
    AgentPurchaseApproval,
    AgentAddPurchaseApproval,
    ServiceContract,
    PrivacyPolicy
  },
  {
    initialRouteName: 'AgentBottomTab',
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing
      },
      // 修改页面跳转动画方向
      screenInterpolator: StackViewStyleInterpolator.forHorizontal
    }),
    headerMode: 'none'
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

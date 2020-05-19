import { combineReducers } from 'redux'
import user from './user'
import enumList from './enum'
import uploadImg from './uploadImg'
import bookKeep from './bookKeep'
import appUpdate from './appUpdate'
import approvalList from './approvalList'
import contract from './contract'
import waitCollectBillList from './waitCollectBillList'
import guestGet from './guest'
import order from './order'
import repairList from './repairList'
import payReceiveList from './payReceive'
import list from './list'
import account from './account'
import accountDetail from './accountDetail'
import renovationDetail from './renovationDetail'
import movingDetail from './movingDetail'




export default combineReducers({
  user,
  enum: enumList,
  uploadImg,
  bookKeep,
  appUpdate,
  approvalList,
  contract,
  waitCollectBillList,
  guestGet,
  order,
  repairList,
  payReceiveList,
  list,
  account,
  accountDetail,
  renovationDetail,
  movingDetail
})

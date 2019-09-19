import { handleActions } from 'redux-actions'
import { SET_UPLOADIMG, REMOVE_UPLOADIMG } from '../actionTypes'
import AgentAddRepairCleanApply from "../../pages/Agent/RenovationApply/AddCleanRepairApply";
const initState = {
  AgentEditOwnerContract: {},
  AgentEditTenantContract: {},
  AgentAddRenovationApply: {},
  EditOwnerResource: {},
  CompleteHouse: {},
  SetFixtures: {},
  AddRepair: {},
  EditPayReceipt: {},
  AgentEditCashBook: {},
  AgentCheckOutContract: {},
  AgentAddRepairCleanApply: {},
}

const setUploadImg = handleActions(
  {
    [SET_UPLOADIMG]: (state, action) => {
      const stateOld = state[action.payload.type]
      stateOld[action.payload.id] = action.payload.data
      return {
        ...state,
        [action.payload.type]: stateOld
      }
    },
    [REMOVE_UPLOADIMG]: (state, action) => {
      return {
        ...state,
        [action.payload.type]: {}
      }
    }
  },
  initState
)
export default setUploadImg

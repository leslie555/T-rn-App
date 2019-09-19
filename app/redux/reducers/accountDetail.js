import { handleActions } from 'redux-actions'
import { SET_ACCOUNTDETAIL, UPDATE_ACCOUNTDETAIL} from '../actionTypes'
const defaultState = {
  // accountDetail: {}
}
const accountDetail = handleActions(
  {
    [SET_ACCOUNTDETAIL]: (state, action) => {
      return {
        ...state,
        ...action.payload.data
      }
    },
    [UPDATE_ACCOUNTDETAIL]: (state, action) => {
      return {
        ...state,
        ...action.payload.data
      }
    },
  },
  defaultState
)
export default accountDetail
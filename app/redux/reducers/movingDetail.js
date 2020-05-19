import { handleActions } from 'redux-actions'
import { SET_MOVINGDETAIL, UPDATE_MOVINGDETAIL } from '../actionTypes'
const defaultState = {
  // accountDetail: {}
}
const movingDetail = handleActions(
  {
    [SET_MOVINGDETAIL]: (state, action) => {
      return {
        ...state,
        ...action.payload.data
      }
    },
    [UPDATE_MOVINGDETAIL]: (state, action) => {
      return {
        ...state,
        ...action.payload.data
      }
    },
  },
  defaultState
)
export default movingDetail
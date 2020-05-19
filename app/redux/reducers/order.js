import { handleActions } from 'redux-actions'
import { SET_ORDERDETAIL } from '../actionTypes'

const initState = {
  orderDetail: {}
}

const order = handleActions(
  {
    [SET_ORDERDETAIL]: (state, action) => {
      return {
        ...state,
        orderDetail: action.payload
      }
    }
  },
  initState
)
export default order

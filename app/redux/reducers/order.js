import { handleActions } from 'redux-actions'
import {
  SET_ORDERLIST,
  UPDATE_ORDERLIST,
  DELETE_ORDERLIST
} from '../actionTypes'

const initState = {
  orderList: []
}

const order = handleActions(
  {
    [SET_ORDERLIST]: (state, action) => {
      return {
        ...state,
        orderList: action.payload
      }
    },
    [UPDATE_ORDERLIST]: (state, action) => {
      const id = action.payload.KeyID
      const data = action.payload.data
      const _list = [...state['orderList']]
      _list.forEach((val, index) => {
        if (val.KeyID === id) {
          _list[index] = { ...val, ...data }
        }
      })
      return {
        ...state,
        orderList: _list
      }
    },
    [DELETE_ORDERLIST]: (state, action) => {
      const id = action.payload.KeyID
      const index = state['orderList'].findIndex(val => val.KeyID === id)
      const _list = [...state['orderList']]
      _list.splice(index, 1)
      return {
        ...state,
        orderList: _list
      }
    }
  },
  initState
)
export default order

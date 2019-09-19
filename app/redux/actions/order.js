import {
  SET_ORDERLIST,
  UPDATE_ORDERLIST,
  DELETE_ORDERLIST
} from '../actionTypes'
import { createAction } from 'redux-actions'

export const setOrderList = createAction(SET_ORDERLIST)
export const updateOrderList = createAction(UPDATE_ORDERLIST)
export const deleteOrderList = createAction(DELETE_ORDERLIST)

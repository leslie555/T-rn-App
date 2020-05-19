import {
  SET_ORDERDETAIL,
  UPDATE_ORDERDETAIL,
  DELETE_ORDERDETAIL
} from '../actionTypes'
import { createAction } from 'redux-actions'

export const setOrderDetail = createAction(SET_ORDERDETAIL)
export const updateOrderDetail = createAction(UPDATE_ORDERDETAIL)
export const deleteOrderDetail = createAction(DELETE_ORDERDETAIL)

import {
  SET_CONTRACTDETAIL,
  UPDATE_CONTRACTDETAIL,
  SET_CONTRACTLIST,
  UPDATE_CONTRACTLIST,
  DELETE_CONTRACTLIST
} from '../actionTypes'
import { createAction } from 'redux-actions'
export const setContractDetail = createAction(SET_CONTRACTDETAIL)
export const updateContractDetail = createAction(UPDATE_CONTRACTDETAIL)

export const setContractList = createAction(SET_CONTRACTLIST)
export const updateContractList = createAction(UPDATE_CONTRACTLIST)
export const deleteContractList = createAction(DELETE_CONTRACTLIST)

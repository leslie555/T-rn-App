import { createAction } from 'redux-actions'
import { SET_ACCOUNTDETAIL, UPDATE_ACCOUNTDETAIL } from '../actionTypes'
export const setAccountDetail = createAction(SET_ACCOUNTDETAIL)
export const updateAccountDetail = createAction(UPDATE_ACCOUNTDETAIL)
import { SET_APPROVALLIST, UPDATE_APPROVALLIST,CLEAR_APPROVALLIST } from '../actionTypes'
import { createAction } from 'redux-actions'
export const setApprovalList = createAction(SET_APPROVALLIST)
export const updateApprovalList = createAction(UPDATE_APPROVALLIST)
export const clearApprovalList = createAction(CLEAR_APPROVALLIST)

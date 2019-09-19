import {SET_REPAIRLIST, UPDATE_REPAIRLIST,REMOVE_REPAIRLIST} from '../actionTypes'
import {createAction} from 'redux-actions'

export const setRepairList = createAction(SET_REPAIRLIST)
export const updateRepairList = createAction(UPDATE_REPAIRLIST)
export const removeRepairList = createAction(REMOVE_REPAIRLIST)

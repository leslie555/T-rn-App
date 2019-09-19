import {SET_PAYRECEIVELIST, UPDATE_PAYRECEIVELIST,REMOVE_PAYRECEIVELIST,REMOVE_PAYRECEIVELIST_ITEM} from '../actionTypes'
import {createAction} from 'redux-actions'

export const setPayReceiveList = createAction(SET_PAYRECEIVELIST)
export const updatePayReceiveList = createAction(UPDATE_PAYRECEIVELIST)
export const removePayReceiveList = createAction(REMOVE_PAYRECEIVELIST)
export const removePayReceiveListItem = createAction(REMOVE_PAYRECEIVELIST_ITEM)

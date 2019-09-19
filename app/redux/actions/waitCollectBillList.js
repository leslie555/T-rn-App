import { SET_WAITCOLLECTBILLLIST, REMOVE_WAITCOLLECTBILLLIST,CLEAR_WAITCOLLECTBILLLIST,UPDATE_WAITCOLLECTBILLLIST } from '../actionTypes'
import { createAction } from 'redux-actions'
export const setWaitCollectBillList = createAction(SET_WAITCOLLECTBILLLIST)
export const removeWaitCollectBillList = createAction(REMOVE_WAITCOLLECTBILLLIST)
export const clearWaitCollectBillList = createAction(CLEAR_WAITCOLLECTBILLLIST)
export const updateWaitCollectBillList = createAction(UPDATE_WAITCOLLECTBILLLIST)

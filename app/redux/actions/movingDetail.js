import { createAction } from 'redux-actions'
import { SET_MOVINGDETAIL, UPDATE_MOVINGDETAIL } from '../actionTypes'
export const setMovingDetail = createAction(SET_MOVINGDETAIL)
export const updateMovingDetail = createAction(UPDATE_MOVINGDETAIL)
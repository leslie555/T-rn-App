import { SET_UPDATE_STATUS, SET_UPDATE_PROGRESS } from '../actionTypes'
import { createAction } from 'redux-actions'
export const setUpdateStatus = createAction(SET_UPDATE_STATUS)
export const setUpdateProgress = createAction(SET_UPDATE_PROGRESS)

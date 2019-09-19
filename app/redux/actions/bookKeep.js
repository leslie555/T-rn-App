import { SET_BOOKKEEP, REMOVE_BOOKKEEP } from '../actionTypes'
import { createAction } from 'redux-actions'
export const setBookKeep = createAction(SET_BOOKKEEP)
export const removeBookKeep = createAction(REMOVE_BOOKKEEP)

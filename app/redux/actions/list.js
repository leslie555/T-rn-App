import { SETLIST, UPDATELIST, DELETELIST,ADDLIST } from '../actionTypes'
import { createAction } from 'redux-actions'

export const setList = createAction(SETLIST)
export const updateList = createAction(UPDATELIST)
export const deleteList = createAction(DELETELIST)
export const addList = createAction(ADDLIST)

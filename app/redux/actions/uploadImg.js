import { SET_UPLOADIMG, REMOVE_UPLOADIMG } from '../actionTypes'
import { createAction } from 'redux-actions'
export const setUploadImg = createAction(SET_UPLOADIMG)
export const removeUploadImg = createAction(REMOVE_UPLOADIMG)

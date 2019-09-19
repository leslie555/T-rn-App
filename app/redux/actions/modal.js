import { OPEN_MODAL, CLOSE_MODAL } from '../actionTypes'
import { createAction } from 'redux-actions'
export const startAction = createAction(OPEN_MODAL)
export const logInAction = createAction(CLOSE_MODAL)

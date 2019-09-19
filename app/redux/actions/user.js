import {
  LOG_IN,
  LOG_OUT,
  LOG_ERROR,
  LOG_START,
  LOG_FRONT_OUT
} from '../actionTypes'
import { createAction } from 'redux-actions'
import { Login, Logout } from '../../api/login'
import storage from '../../utils/storage'
export const startAction = createAction(LOG_START)
export const logInAction = createAction(LOG_IN)
export const logOutAction = createAction(LOG_OUT)
export const logErrorAction = createAction(LOG_ERROR)
export const logFrontOutAction = createAction(LOG_FRONT_OUT, () => {
  storage.remove('token')
})

// logout
export const logout = () => dispatch => {
  Logout()
    .then(() => {
      dispatch(logOutAction())
      storage.remove('token')
    })
    .catch(err => {
      //
    })
}

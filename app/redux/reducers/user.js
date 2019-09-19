import { handleActions } from 'redux-actions'
import {
  LOG_IN,
  LOG_OUT,
  LOG_ERROR,
  LOG_START,
  LOG_FRONT_OUT
} from '../actionTypes'

const initState = {
  userinfo: {},
  token: '',
  isLogin: false
}
const user = handleActions(
  {
    [LOG_IN]: (state, action) => ({
      ...state,
      isLogin: true,
      userinfo: action.payload,
      token: action.payload.Token
    }),
    [LOG_START]: (state, action) => ({ ...state }),
    [LOG_ERROR]: (state, action) => ({ ...state, err: action.err }),
    [LOG_OUT]: (state, action) => ({
      ...state,
      isLogin: false,
      token: '',
      userinfo: {}
    }),
    [LOG_FRONT_OUT]: (state, action) => ({
      ...state,
      isLogin: false,
      token: '',
      userinfo: {}
    })
  },
  initState
)

export default user

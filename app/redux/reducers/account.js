import { handleActions } from 'redux-actions'
import { ACCOUNTLIST } from '../actionTypes'

const initState = {}

const account = handleActions(
  {
    [ACCOUNTLIST]: (state, action) => {
      console.log(state, action)
      debugger
      const key = action.payload.key
      return {
        ...state,
        [key]: action.payload.data
      }
    },
  },
  initState
)
export default account

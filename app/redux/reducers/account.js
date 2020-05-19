import { handleActions } from 'redux-actions'
import { ACCOUNTLIST } from '../actionTypes'

const initState = {
  ShopListSelector: [],
  ShopListSelector2: []
}

const account = handleActions(
  {
    [ACCOUNTLIST]: (state, action) => {
      console.log(state, action)
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

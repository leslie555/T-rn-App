import { handleActions } from 'redux-actions'
import { SETSHOWMODAL } from '../actionTypes'
const initState = {
  showModal: false
}

const listSelect = handleActions(
  {
    [SETSHOWMODAL]: (state, action) => ({
      ...state,
      showModal: action.payload
    })
  },
  initState
)
export default listSelect

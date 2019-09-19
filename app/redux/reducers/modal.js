import { handleActions } from 'redux-actions'
import { OPEN_MODAL, CLOSE_MODAL } from '../actionTypes'
const initState = {
  modalVisible: true
}

const modal = handleActions(
  {
    [OPEN_MODAL]: (state, action) => ({
      ...state,
      modalVisible: true
    }),
    [CLOSE_MODAL]: (state, action) => ({ ...state, modalVisible: false })
  },
  initState
)
export default modal

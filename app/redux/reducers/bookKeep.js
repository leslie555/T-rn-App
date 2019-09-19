import {handleActions} from 'redux-actions'
import {REMOVE_BOOKKEEP, SET_BOOKKEEP} from '../actionTypes'

const initState = {
  data: null
}

const BookKeep = handleActions(
    {
      [SET_BOOKKEEP]: (state, action) => {
        return {
          ...state,
          data: action.payload
        }
      },
      [REMOVE_BOOKKEEP]: (state, action) => {
        return {
          ...state,
          data: null
        }
      }
    },
    initState
)
export default BookKeep

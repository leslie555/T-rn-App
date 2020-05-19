import { handleActions } from 'redux-actions'
import { SETLIST, UPDATELIST, DELETELIST, ADDLIST } from '../actionTypes'

const initState = {}

const list = handleActions(
  {
    [SETLIST]: (state, action) => {
      const key = action.payload.key
      return {
        ...state,
        [key]: action.payload.data
      }
    },
    [UPDATELIST]: (state, action) => {
      const key = action.payload.key
      if (!state[key]) return { ...state }
      const id = action.payload.KeyID
      const data = action.payload.data
      const _list = [...state[key]]
      _list.forEach((val, index) => {
        if (val[action.payload.primaryKey || 'KeyID'] === id) {
          _list[index] = { ...val, ...data }
        }
      })
      return {
        ...state,
        [key]: _list
      }
    },
    [ADDLIST]: (state, action) => {
      const key = action.payload.key
      if (!state[key]) return { ...state }
      const data = action.payload.data
      const _list = [...state[key]]
      _list.unshift(data)
      return {
        ...state,
        [key]: _list
      }
    },
    [DELETELIST]: (state, action) => {
      const key = action.payload.key
      if (!state[key]) return { ...state }
      const id = action.payload.KeyID
      const index = state[key].findIndex(
        val => val[action.payload.primaryKey || 'KeyID'] === id
      )
      const _list = [...state[key]]
      _list.splice(index, 1)
      return {
        ...state,
        [key]: _list
      }
    }
  },
  initState
)
export default list

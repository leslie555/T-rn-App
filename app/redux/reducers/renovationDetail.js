import { handleActions } from "redux-actions"
import { SET_RENOVATIONDETAIL, UPDATE_RENOVATIONDETAIL } from "../actionTypes"
const defaultState = {
  ApplyRecord: [{}],
  DecorationDetails: [],
  RenovationTrack: [],
  imageList:[]
}
const renovationDetail = handleActions(
  {
    [SET_RENOVATIONDETAIL]: (state, action) => {
      return {
        ...state,
        ...action.payload
      }
    },
    [UPDATE_RENOVATIONDETAIL]: (state, action) => {
      return {
        ...state,
        ...action.payload
      }
    },
  },
  defaultState
)
export default renovationDetail

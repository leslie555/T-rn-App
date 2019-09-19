import {handleActions} from 'redux-actions'
import { SET_UPDATE_STATUS, SET_UPDATE_PROGRESS } from '../actionTypes'

const initState = {
  status: 0, // 更新状态 0 未开始 1 进行中 2 更新完成
  progress: 0 // 下载安装包状态 0-100
}

const UpdateApp = handleActions(
    {
      [SET_UPDATE_STATUS]: (state, action) => {
        return {
          ...state,
          status: action.payload
        }
      },
      [SET_UPDATE_PROGRESS]: (state, action) => {
        return {
          ...state,
          progress: action.payload
        }
      }
    },
    initState
)
export default UpdateApp

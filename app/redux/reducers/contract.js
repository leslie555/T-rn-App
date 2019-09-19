import { handleActions } from 'redux-actions'
import {
  SET_CONTRACTDETAIL,
  UPDATE_CONTRACTDETAIL,
  SET_CONTRACTLIST,
  UPDATE_CONTRACTLIST,
  DELETE_CONTRACTLIST
} from '../actionTypes'

const initState = {
  detailData: {},
  tenantList: [],
  ownerList: []
}

const contract = handleActions(
  {
    [SET_CONTRACTDETAIL]: (state, action) => {
      return {
        ...state,
        detailData: action.payload
      }
    },
    [UPDATE_CONTRACTDETAIL]: (state, action) => {
      const data = action.payload
      const _detailData = { ...state.detailData }
      if (!Object.keys(_detailData).length) return { ...state }
      const arrWhiteList = ['BookKeep'] //数组白名单
      if(arrWhiteList.includes(data.key)){
        _detailData[data.key].push(...data.data)
      }else{
        _detailData[data.key] = { ..._detailData[data.key], ...data.data }
      }
      return {
        ...state,
        detailData: _detailData
      }
    },
    [SET_CONTRACTLIST]: (state, action) => {
      const key = action.payload.isOwner ? 'ownerList' : 'tenantList'
      return {
        ...state,
        [key]: action.payload.data
      }
    },
    [UPDATE_CONTRACTLIST]: (state, action) => {
      const key = action.payload.isOwner ? 'ownerList' : 'tenantList'
      const id = action.payload.KeyID
      const data = action.payload.data
      const _list = [...state[key]]
      _list.forEach((val,index) => {
        if (val.KeyID === id) {
          _list[index] = { ...val, ...data }
        }
      })
      return {
        ...state,
        [key]: _list
      }
    },
    [DELETE_CONTRACTLIST]: (state, action) => {
      const key = action.payload.isOwner ? 'ownerList' : 'tenantList'
      const id = action.payload.KeyID
      const index = state[key].findIndex(val => (val.KeyID === id))
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
export default contract

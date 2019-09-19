import {handleActions} from 'redux-actions'
import {REMOVE_REPAIRLIST, SET_REPAIRLIST, UPDATE_REPAIRLIST} from '../actionTypes'

const initState = {
    data: []
}

const repairList = handleActions(
    {
        [SET_REPAIRLIST]: (state, action) => {
            const list = action.payload.data
            initState.data.push(...list)
            return {
                ...state,
                data: initState.data
            }
        },
        [UPDATE_REPAIRLIST]: (state, action) => {
            initState.data.unshift(action.payload.data)
            return {
                ...state,
                data: initState.data
            }
        },
        [REMOVE_REPAIRLIST]:(state,action) => {
            initState.data = []
            return {
                ...state,
                data: initState.data
            }
        }
    },
    initState
)
export default repairList

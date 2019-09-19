import {handleActions} from 'redux-actions'
import {SET_APPROVALLIST, UPDATE_APPROVALLIST,CLEAR_APPROVALLIST} from '../actionTypes'

const initState = {
    data: [[],[],[]]
}

const approvalList = handleActions(
    {
        [SET_APPROVALLIST]:(state,action) => {
            const list = action.payload.data
            initState.data[action.payload.index].push(...list)
            return {
                ...state,
                data: initState.data
            }
        },
        // 待审核列表审核后删除原待审核数据，并将审核后数据新增至已通过/未通过列表
        [UPDATE_APPROVALLIST]: (state, action) => {
            const parm = action.payload
            const index = initState.data[0].findIndex(item=> {
                return item.KeyID === parm.KeyID
            })
            const newObj = initState.data[0][index]
            newObj.AuditStatus = parm.AuditContent.AuditStatus
            newObj.AuditRemark = parm.AuditContent.AuditRemark
            newObj.AuditTime = parm.AuditContent.AuditTime

            const TargetIndex = parm.AuditContent.AuditStatus === 2?1:2
            initState.data[TargetIndex].unshift(newObj)
            initState.data[0].splice(index,1)

            return {
                ...state,
                data: initState.data
            }
        },
        [CLEAR_APPROVALLIST]:(state,action) => {
            if(action.payload.index>-1) {
                initState.data[action.payload.index] = []
            } else {
                initState.data[0] = []
                initState.data[1] = []
                initState.data[2] = []
            }
            return {
                ...state,
                data: initState.data
            }
        }
    },
    initState
)
export default approvalList

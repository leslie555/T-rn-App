import {handleActions} from 'redux-actions'
import {
    SET_WAITCOLLECTBILLLIST,
    REMOVE_WAITCOLLECTBILLLIST,
    CLEAR_WAITCOLLECTBILLLIST,
    UPDATE_WAITCOLLECTBILLLIST
} from '../actionTypes'

const initState = {
    data: []
}

const waitCollectBillList = handleActions(
    {
        [SET_WAITCOLLECTBILLLIST]: (state, action) => {
            const list = action.payload.data
            initState.data.push(...list)
            return {
                ...state,
                data: initState.data
            }
        },
        [REMOVE_WAITCOLLECTBILLLIST]: (state, action) => {
            const index = initState.data.findIndex(item => {
                    return item.KeyID === action.payload.KeyID
                }
            )
            if(index>-1) {
                initState.data.splice(index, 1)
            }
            return {
                ...state,
                data: initState.data
            }
        },
        [CLEAR_WAITCOLLECTBILLLIST]: (state, action) => {
            initState.data = []
            return {
                ...state,
                data: initState.data
            }
        },
        [UPDATE_WAITCOLLECTBILLLIST]: (state, action) => {
            const billObj = action.payload.billObj
            const index = initState.data.findIndex(item => {
                    return item.KeyID === billObj.billId
                }
            )
            const newObj = {
                ...initState.data[index],
                PaidMoney: billObj.totalPaidMoney,
                UnPaidMoney: billObj.unPaidAmount
            }
            initState.data.splice(index,1,newObj)
            return {
                ...state,
                data: initState.data
            }
        }
    },
    initState)
export default waitCollectBillList


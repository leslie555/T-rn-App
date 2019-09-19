import {handleActions} from 'redux-actions'
import {REMOVE_PAYRECEIVELIST, SET_PAYRECEIVELIST, UPDATE_PAYRECEIVELIST,REMOVE_PAYRECEIVELIST_ITEM} from '../actionTypes'

const initState = {
  data: [[], []]
}

const payReceiveList = handleActions(
    {
      [SET_PAYRECEIVELIST]: (state, action) => {
        const list = action.payload.data
        initState.data[action.payload.index].push(...list)
        return {
          ...state,
          data: initState.data
        }
      },
      [UPDATE_PAYRECEIVELIST]: (state, action) => {
        // this.props.dispatch(updatePayReceiveList({
        //     KeyID: ,
        //     EditType: ,//新增0，修改1
        //      BusType: ,//收款0，付款1
        //     BillContent: {
        //         PaymentData: ,
        //         VerificationStatus: ,
        //         ProjectName: ,
        //         ContractNumber: ,
        //         PaymentMoney:
        //     }
        // }))
        const parm = action.payload
        const BusType = parm.BusType
        const newObj = {
          KeyID: parm.KeyID,
          ...parm.BillContent
        }
        if (parm.EditType === 0) {
          initState.data[BusType].unshift(newObj)
        } else {
          const index = initState.data[BusType].findIndex(item => {
            return item.KeyID === parm.KeyID
          })
          initState.data[BusType].splice(index, 1, newObj)
        }
        return {
          ...state,
          data: initState.data
        }
      },
      [REMOVE_PAYRECEIVELIST]: (state, action) => {
        if (action.payload.index > -1) {
          initState.data[action.payload.index] = []
        } else {
          initState.data[0] = []
          initState.data[1] = []
        }
        return {
          ...state,
          data: initState.data
        }
      },
      [REMOVE_PAYRECEIVELIST_ITEM]: (state, action) => {
        if (action.payload.index > -1) {

        }
        const list = initState.data[action.payload.index]
        const index = list.find(x=>x.KeyID===action.payload.KeyID)
        list.splice(index,1)
        return {
          ...state,
          data: initState.data
        }
      }
    },
    initState
)
export default payReceiveList

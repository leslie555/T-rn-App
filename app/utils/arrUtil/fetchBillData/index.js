import {QueryBillItem} from "../../../api/owner";

const fetchBillData = function (type = 0,hasAll = false) {
  return new Promise((resolve, reject) => {
    QueryBillItem({}).then(({Data}) => {
      if(hasAll) {
        Data.unshift({
          Name: '全部',
          KeyID: '',
          Children: [{
            Name: '全部',
            PID: '',
            KeyID: '',
          }]
        })
      }
      for (let i = 0; i < Data.length; i++) {
        const item = Data[i]
        item.children = item.Children
        item.label = item.Name
        item.value = item.KeyID
        if (!item.children || item.children.length === 0) {
          const obj = {...item}
          obj.PID = obj.KeyID
          delete obj.Children
          delete obj.children
          item.children = [obj]
        } else {
          for (let j = 0; j < item.children.length; j++) {
            const cItem = item.children[j]
            cItem.label = cItem.Name
            cItem.value = cItem.KeyID
          }
        }
      }
      if (type === 1) {
        const pickerData = []
        for (let i = 0; i < Data.length; i++) {
          const _data = {}
          let nameArr = []
          if (Data[i].children) {
            nameArr = Data[i].children.map(val => val.Name)
          }
          _data[Data[i].Name] = nameArr
          pickerData.push(_data)
        }
        resolve({
          Data: pickerData,
          realData: Data
        })
        return
      }
      resolve({
        Data
      })
    }).catch(() => {
      reject()
    })
  })
}

export {
  fetchBillData
}

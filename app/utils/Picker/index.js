import Picker from 'react-native-picker'
import areaData from './areaData/cityPickerData'
import { Platform } from 'react-native'

const defaultConfig = {
  pickerTitleColor: [187, 187, 187, 1],
  pickerBg: [255, 255, 255, 1],
  pickerToolBarBg: [255, 255, 255, 1],
  pickerConfirmBtnText: '确认',
  pickerCancelBtnText: '取消',
  pickerConfirmBtnColor: [56, 158, 242, 1],
  pickerCancelBtnColor: [255, 101, 101, 1],
  pickerRowHeight: 28
}
const _createDateData = () => {
  const years = []
  const months = []
  const days = []

  for (let i = 1; i < 51; i++) {
    years.push(i + 1980 + '年')
  }
  for (let i = 1; i < 13; i++) {
    months.push(i + '月')
  }
  for (let i = 1; i < 32; i++) {
    days.push(i + '日')
  }
  return [years, months, days]
}

const _createYearMonthData = () => {
  const years = []
  const months = []

  for (let i = 1; i < 51; i++) {
    years.push(i + 2000 + '年')
  }
  for (let i = 1; i < 13; i++) {
    months.push(i + '月')
  }
  return [years, months]
}

const _createTimeData = () => {
  let hours = [],
      minutes = []
  for (let i = 1; i < 13; i++) {
    hours.push(i)
  }
  for (let i = 1; i < 61; i++) {
    minutes.push(i)
  }
  return (pickerData = [['上午', '下午'], hours, minutes])
}
const dateDataStore = _createDateData()
const dateYearMonthStore = _createYearMonthData()
const timeDataStore = _createTimeData()
const pickerInit = config => {
  const defaultKey = {label: 'label', value: 'value'}
  const option = {...defaultKey, ...config.option}
  const {pickerData} = config
  const pickerDataLabels = pickerData.map(val => val[option.label])
  let selectVal = null
  let selectIdx = null
  Picker.init({
    ...defaultConfig,
    pickerTextEllipsisLen: 20,
    pickerTitleText: '请选择',
    pickerData: pickerDataLabels,
    selectedValue: [config.selectedValue],
    onPickerConfirm: (val, idx) => {
      if(Platform.OS === 'ios'){
        const data = pickerData[idx]
        config.onPickerConfirm && config.onPickerConfirm(data, idx)
      }else{
        config.onPickerConfirmCloseModal && config.onPickerConfirmCloseModal()
        setTimeout(() => {
          if (selectVal === null) {
            selectVal = val
            selectIdx = idx
          }
          const data = pickerData[selectIdx]
          config.onPickerConfirm && config.onPickerConfirm(data, selectIdx)
        }, 300)
      }
    },
    onPickerCancel: (val, idx) => {
      const data = pickerData[idx]
      config.onPickerCancel && config.onPickerCancel(data, idx)
    },
    onPickerSelect: (val, idx) => {
      selectVal = val
      selectIdx = idx
      const data = pickerData[idx]
      config.onPickerCancel && config.onPickerSelect(data, idx)
    }
  })
}
const datePickerInit = config => {
  let selectVal = null
  let selectIdx = null
  Picker.init({
    pickerData: dateDataStore,
    ...defaultConfig,
    pickerTitleText: '选择日期',
    ...config,
    onPickerSelect: (pickedValue,idx) => {
      let targetValue = pickedValue.map(v => parseInt(v))
      if (parseInt(targetValue[1]) === 2) {
        if (
            ((targetValue[0] % 4 === 0 && targetValue[0] % 100 !== 0) ||
                targetValue[0] % 400 === 0) &&
            targetValue[2] > 29
        ) {
          targetValue[2] = 29
        } else if (targetValue[0] % 4 !== 0 && targetValue[2] > 28) {
          targetValue[2] = 28
        }
      } else if (
          targetValue[1] in {4: 1, 6: 1, 9: 1, 11: 1} &&
          targetValue[2] > 30
      ) {
        targetValue[2] = 30
      }
      // forbidden some value such as some 2.29, 4.31, 6.31...
      targetValue[0] += '年'
      targetValue[1] += '月'
      targetValue[2] += '日'
      console.log(`onPickerSelect`,targetValue)
      selectVal = targetValue
      selectIdx = idx
      if (JSON.stringify(targetValue) !== JSON.stringify(pickedValue)) {
        Picker.select(targetValue)
        pickedValue = targetValue
      }
    },
    onPickerConfirm: (val, idx) => {
      if(Platform.OS === 'ios'){
        config.onPickerConfirm && config.onPickerConfirm(val, idx)
      }else{
        config.onPickerConfirmCloseModal && config.onPickerConfirmCloseModal()
        setTimeout(() => {
          if (selectVal === null) {
            selectVal = val
            selectIdx = idx
          }
          config.onPickerConfirm && config.onPickerConfirm(selectVal, selectIdx)
        }, 300)
      }
    },
  })
}
const dateYearMonthInit = config => {
  let selectVal = null
  let selectIdx = null
  Picker.init({
    pickerData: dateYearMonthStore,
    ...defaultConfig,
    pickerTitleText: '选择年月',
    ...config,
    onPickerSelect: (pickedValue,idx) => {
      let targetValue = pickedValue.map(v => parseInt(v))
      // forbidden some value such as some 2.29, 4.31, 6.31...
      targetValue[0] += '年'
      targetValue[1] += '月'
      console.log(`onPickerSelect`,targetValue)
      selectVal = targetValue
      selectIdx = idx
      if (JSON.stringify(targetValue) !== JSON.stringify(pickedValue)) {
        Picker.select(targetValue)
        pickedValue = targetValue
      }
    },
    onPickerConfirm: (val, idx) => {
      if(Platform.OS === 'ios'){
        config.onPickerConfirm && config.onPickerConfirm(val, idx)
      }else{
        config.onPickerConfirmCloseModal && config.onPickerConfirmCloseModal()
        setTimeout(() => {
          if (selectVal === null) {
            selectVal = val
            selectIdx = idx
          }
          config.onPickerConfirm && config.onPickerConfirm(selectVal, selectIdx)
        }, 300)
      }
    },
  })
}
const timePickerInit = config => {
  Picker.init({
    pickerData: timeDataStore,
    ...defaultConfig,
    pickerTitleText: '选择时间',
    ...config
  })
}

const areaPickerInit = config => {
  let selectVal = null
  let selectIdx = null
  Picker.init({
    ...defaultConfig,
    pickerTitleText: '请选择地区',
    pickerData: areaData,
    ...config,
    onPickerConfirm: (val, idx) => {
      if(Platform.OS === 'ios'){
        config.onPickerConfirm && config.onPickerConfirm(val, idx)
      }else{
        config.onPickerConfirmCloseModal && config.onPickerConfirmCloseModal()
        setTimeout(() => {
          if (selectVal === null) {
            selectVal = val
            selectIdx = idx
          }
          config.onPickerConfirm && config.onPickerConfirm(selectVal, selectIdx)
        }, 300)
      }
    },
    onPickerSelect: (val, idx) => {
      selectVal = val
      selectIdx = idx
      config.onPickerCancel && config.onPickerSelect(val, idx)
    }
  })
}
const cascaderInit = config => {
  let selectVal = null
  let selectIdx = null
  Picker.init({
    ...defaultConfig,
    pickerTitleText: '请选择',
    ...config,
    onPickerConfirm: (val, idx) => {
      if(Platform.OS === 'ios'){
        config.onPickerConfirm && config.onPickerConfirm(val, idx)
      }else{
        config.onPickerConfirmCloseModal && config.onPickerConfirmCloseModal()
        setTimeout(() => {
          if (selectVal === null) {
            selectVal = val
            selectIdx = idx
          }
          config.onPickerConfirm && config.onPickerConfirm(selectVal, selectIdx)
        }, 300)
      }
    },
    onPickerSelect: (val, idx) => {
      selectVal = val
      selectIdx = idx
      config.onPickerCancel && config.onPickerSelect(val, idx)
    }
  })
}
const regionCityInit = config => {
  let selectVal = null
  let selectIdx = null
  Picker.init({
    ...defaultConfig,
    pickerTitleText: '请选择',
    ...config,
    onPickerConfirm: (val, idx) => {
      if(Platform.OS === 'ios'){
        config.onPickerConfirm && config.onPickerConfirm(val, idx)
      }else{
        config.onPickerConfirmCloseModal && config.onPickerConfirmCloseModal()
        setTimeout(() => {
          if (selectVal === null) {
            selectVal = val
            selectIdx = idx
          }
          config.onPickerConfirm && config.onPickerConfirm(selectVal, selectIdx)
        }, 300)
      }
    },
    onPickerSelect: (val, idx) => {
      selectVal = val
      selectIdx = idx
      config.onPickerCancel && config.onPickerSelect(val, idx)
    }
  })
}


const hidePicker = Picker.hide
const showPicker = Picker.show
export {
  pickerInit,
  datePickerInit,
  timePickerInit,
  areaPickerInit,
  hidePicker,
  showPicker,
  cascaderInit,
  dateYearMonthInit,
  regionCityInit
}

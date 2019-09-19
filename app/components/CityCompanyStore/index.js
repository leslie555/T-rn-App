import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import ReportFilter from './ReportFilter'
import {
  DisplayStyle,
  CommonColor,
  DEVICE_WIDTH
} from '../../styles/commonStyles'
import { mobileGetVanantHouse } from '../../api/tenant'
import { groupBy } from '../../utils/arrUtil/index'

export default class CityCompanyStore extends Component {
  constructor(props) {
    super(props)

    this.state = {
      cityDataList: [],
      companyDataList: [],
      storeDataList: [],
      cityShowing: {
        text: '城市',
        color: '#363636',
        selectedValue: 0
      },
      companyShowing: {
        text: '公司',
        color: '#363636',
        selectedValue: 0
      },
      storeShowing: {
        text: '门店',
        color: '#363636',
        selectedValue: 0
      }
    }
    this.data = {
      groupedCompany: {},
      groupedStore: {}
    }
  }
  static defaultProps = {
    onChange: () => {},
    vacant: null
  }
  // RenderCityItem() {
  //   debugger
  //   if(this.props.RenderCityItem) {
  //     return this.RenderCityItem()
  //   }
  // }

  componentWillMount() {
    mobileGetVanantHouse().then(response => {
      // 城市的数据
      const cityDataList = response.Data.Filiale || []
      const companyDataList = response.Data.BigShop || []
      const storeDataList = response.Data.Subbranch || []
      this.allCityDataList = cityDataList // 所有城市
      this.allCompanyDataList = companyDataList // 所有公司
      this.allStoreDataList = storeDataList // 所有门店
      this.currentComStoreList = this.allStoreDataList // 当前城市下的所有门店
      this.setState({
        cityDataList,
        companyDataList,
        storeDataList
      })
      this.data.groupedCompany = groupBy(companyDataList, 'PID')
      this.data.groupedStore = groupBy(storeDataList, 'PID')
    })
  }
  _emitOnChange() {
    let selectedData = undefined
    if (this.state.storeShowing.selectedValue) {
      selectedData = this.allStoreDataList.find(
        v => v.KeyID === this.state.storeShowing.selectedValue
      )
    } else if (this.state.companyShowing.selectedValue) {
      selectedData = this.allCompanyDataList.find(
        v => v.KeyID === this.state.companyShowing.selectedValue
      )
    } else if (this.state.cityShowing.selectedValue) {
      selectedData = this.allCityDataList.find(
        v => v.KeyID === this.state.cityShowing.selectedValue
      )
    }
    this.props.onChange(
      this.state.cityShowing.selectedValue,
      this.state.companyShowing.selectedValue,
      this.state.storeShowing.selectedValue,
      selectedData
    )
  }
  _selectedCity = val => {
    if (val.CompanyName !== '全部') {
      const companyDataList = this.data.groupedCompany[val.KeyID] || []
      const storeList = []
      companyDataList.forEach(val => {
        const store = this.data.groupedStore[val.KeyID] || []
        storeList.push(...store)
      })
      this.currentComStoreList = storeList
      this.setState({
        companyDataList,
        storeDataList: storeList
      })
    } else {
      this.setState({
        companyDataList: this.allCompanyDataList,
        storeDataList: this.allStoreDataList
      })
    }
    this.setState(
      {
        companyShowing: {
          text: '公司',
          color: '#363636',
          selectedValue: 0
        },
        storeShowing: {
          text: '门店',
          color: '#363636',
          selectedValue: 0
        }
      },
      () => {
        this._emitOnChange()
      }
    )
  }
  _selectedCompany = val => {
    if (val.CompanyName !== '全部') {
      this.setState({
        storeDataList: this.data.groupedStore[val.KeyID] || []
      })
      if (!this.state.cityShowing.selectedValue) {
        const city = this.state.cityDataList.find(v => v.KeyID === val.PID)
        const companyDataList = this.data.groupedCompany[city.KeyID] || []
        this.setState({
          cityShowing: {
            text: city.CompanyName,
            color: '#389ef2',
            selectedValue: city.KeyID
          },
          companyDataList
        })
      }
    } else {
      this.setState({
        storeDataList: this.currentComStoreList
      })
    }
    this.setState(
      {
        storeShowing: {
          text: '门店',
          color: '#363636',
          selectedValue: 0
        }
      },
      () => {
        this._emitOnChange()
      }
    )
  }
  _selectedStore = val => {
    if (val.CompanyName !== '全部') {
      if (
        !this.state.cityShowing.selectedValue ||
        !this.state.companyShowing.selectedValue
      ) {
        const company = this.state.companyDataList.find(
          v => v.KeyID === val.PID
        )
        const storeDataList = this.data.groupedStore[company.KeyID] || []
        const city = this.state.cityDataList.find(v => v.KeyID === company.PID)
        const companyDataList = this.data.groupedCompany[city.KeyID] || []
        this.setState({
          cityShowing: {
            text: city.CompanyName,
            color: '#389ef2',
            selectedValue: city.KeyID
          },
          companyShowing: {
            text: company.CompanyName,
            color: '#389ef2',
            selectedValue: company.KeyID
          },
          companyDataList,
          storeDataList
        })
      }
    }
    this._emitOnChange()
  }
  render() {
    return (
      <View style={styles.select_box}>
        <ReportFilter
          showing={this.state.cityShowing}
          setShowing={showing => {
            this.setState({
              cityShowing: showing
            })
          }}
          pickerData={this.state.cityDataList}
          title={'城市'}
          selected={this._selectedCity}
        />
        {/**公司 */}
        <ReportFilter
          showing={this.state.companyShowing}
          setShowing={showing => {
            this.setState({
              companyShowing: showing
            })
          }}
          pickerData={this.state.companyDataList}
          title={'公司'}
          selected={this._selectedCompany}
        />
        {/**门店 */}
        <ReportFilter
          showing={this.state.storeShowing}
          setShowing={showing => {
            this.setState({
              storeShowing: showing
            })
          }}
          pickerData={this.state.storeDataList}
          title={'门店'}
          selected={this._selectedStore}
        />
        {this.props.vacant}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  select_box: {
    height: 50,
    width: DEVICE_WIDTH,
    backgroundColor: CommonColor.color_white,
    paddingLeft: 15,
    paddingRight: 15,
    ...DisplayStyle('row', 'center', 'space-between')
  }
})

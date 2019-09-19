import React, {Component} from 'react'
import {
  Dimensions,
  FlatList,
  PixelRatio,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native'
import {withNavigation} from 'react-navigation'
import {EmptyList, Header, ListFooterComponent, ListLoading, SearchBar} from '../../components'
import {searchHouseList, ShowMCommunityInfo} from '../../api/house'
import {getAllSmallCompany, getEmployeeInfoList} from '../../api/system'
import PropTypes from "prop-types";
import {CommonColor, DisplayStyle} from '../../styles/commonStyles'

const DEVICE_WIDTH = Dimensions.get('window').width

class SelectAny extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      listLoading: false,
      isRefresh: false,
      isAllShow: false
    }
    this.text = ''
    this.pageParam = {
      page: 1,
      size: 15
    }
    this.apiFn = this.getApiFn()
  }

  static defaultProps = {
    searchKey: 'Keyword',
    extraParam: {},
    paramInTheKey: '',
    isPaging: true,
    pageKey: 'parm',
    showRestBtn: false,
    placeholder: '',
    leftLabel: '',
    rightLabel: '',
    lightFirstLine: false
  }

  static propTypes = {
    // 1：房源  2：小区  3：员工 4: 共享房源所有分店
    apiType: PropTypes.number.isRequired, // 对应的业务，由于这里是页面组件 所以需要单独引入接口
    searchKey: PropTypes.string, // 关键字对应的字段
    extraParam: PropTypes.object, // 额外的参数
    paramInTheKey: PropTypes.string, // para 以外的参数在某个key内部 如果是就传入这个key
    isPaging: PropTypes.bool, // 接口是否有分页功能  没有分页功能时会直接读取Data用作list
    pageKey: PropTypes.string, // 分页参数对应的字段
    showRestBtn: PropTypes.bool, // 是否显示重置按钮
    placeholder: PropTypes.string, // 搜索框的placeholder
    leftLabel: PropTypes.string.isRequired, // 左侧显示的字段名
    rightLabel: PropTypes.string, // 右侧侧显示的字段名,
    lightFirstLine: PropTypes.bool, // 是否高亮第一行
    path: PropTypes.string.isRequired, // 完成后返回的路由
    returnKey: PropTypes.string.isRequired // 完成后返回的key
  }

  getApiFn() {
    switch (this.props.apiType) {
      case 1 :
        return searchHouseList
      case 2:
        return ShowMCommunityInfo
      case 3:
        return getEmployeeInfoList
      case 4:
        return getAllSmallCompany
    }
  }

  filterData(list) {
    switch (this.props.apiType) {
      case 2:
        list.unshift({
          CommunityName: '新增当前输入小区',
          CityCode: '',
          CityName: '',
          Location: '',
          isAdd: true
        })
        return list
    }
    return list
  }

  filterResult(item) {
    switch (this.props.apiType) {
      case 2:
        if (item.isAdd) {
          item.CommunityName = this.text
        }
        return item
    }
    return item
  }

  getList(type = 0) {
    if(!this.text){
      this.setState({
        list: [],
        listLoading: false,
      })
      return new Promise((resolve)=>resolve())
    }
    if (type === 0) {
      this.pageParam.page = 1
      this.setState({listLoading: true})
    }
    let param = {
      [this.props.searchKey]: this.text,
      [this.props.pageKey]: this.pageParam,
      ...this.props.extraParam
    }
    if (this.props.paramInTheKey) {
      param = {
        [this.props.paramInTheKey]: {
          [this.props.searchKey]: this.text,
          ...this.props.extraParam
        },
        [this.props.pageKey]: this.pageParam,
      }
    }
    return this.apiFn(param).then(({Data}) => {
      if (this.props.isPaging) {
        let list = Data.rows
        if (type === 1) {
          list = this.state.list.push(...list)
        }
        if (Data.records === list.length) {
          this.state.isAllShow = true
        }
        list = this.filterData(list)
        this.setState({
          list: list,
          listLoading: false,
          isAllShow: this.state.isAllShow
        })
      } else {
        this.setState({
          list: this.filterData(Data),
          isAllShow: true,
          listLoading: false
        })
      }
    })
  }

  onEndReached = () => {
    if (this.state.isRefresh) return
    if (!this.state.list || !this.state.list.length || this.state.isAllShow) {
      return
    }
    this.pageParam.page++
    this.getList(1)
  }
  onRefresh = () => {
    if (this.state.isRefresh) return
    this.pageParam.page = 1
    this.setState({
      isRefresh: true,
      isAllShow: false
    }, () => {
      this.getList(2).then(() => {
        this.setState({
          isRefresh: false
        })
      })
    })
  }

  onPress(item) {
    item = this.filterResult(item)
    this.props.navigation.navigate(this.props.path, {
      [this.props.returnKey]: JSON.stringify(item)
    })
  }

  onReset(item) {
    this.props.navigation.navigate(this.props.path, {
      [this.props.returnKey]: JSON.stringify({
        isReset: true
      })
    })
  }

  render() {
    const renderItem = ({item, index}) => {
      return (
          <TouchableHighlight
              stlye={style.itemContainer}
              underlayColor={'#c7c7cc'}
              onPress={this.onPress.bind(this, item)}
          >
            <View style={style.itemRow}>
              <Text
                  style={this.props.lightFirstLine && index === 0 ? {color: '#389ef2'} : null}>{item[this.props.leftLabel]}</Text>
              <Text>{this.props.rightLabel && item[this.props.rightLabel]}</Text>
            </View>
          </TouchableHighlight>
      )
    }
    return (
        <View style={style.container}>
          <Header>
            <SearchBar
                placeholder={this.props.placeholder}
                cancelText="重置"
                hideCancelText={!this.props.showRestBtn}
                onChangeText={(text) => {
                  this.text = text
                  this.getList()
                }}
                onClear={() => {
                  this.setState({
                    list: []
                  })
                }}
                onCancel={this.onReset.bind(this)}
            />
          </Header>
          {this.state.listLoading ? (
              <ListLoading isVisible={this.state.listLoading}/>
          ) : (
              <FlatList
                  contentContainerStyle={style.contentContainer}
                  data={this.state.list}
                  renderItem={renderItem}
                  ListEmptyComponent={<EmptyList text='暂无内容'/>}
                  keyboardShouldPersistTaps='always'
                  keyboardDismissMode='on-drag'
                  ListFooterComponent={
                    <ListFooterComponent
                        list={this.state.list}
                        isAll={this.state.isAllShow}
                    />
                  }
                  keyExtractor={(item, index) => {
                    return (item.KeyID||index) + ''
                  }}
                  onEndReached={this.onEndReached}
                  onEndReachedThreshold={0.1}
                  refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefresh}
                        onRefresh={this.onRefresh}
                        colors={['#389ef2']}
                        tintColor='#389ef2'
                        title='加载中...'
                    />
                  }
                  refreshing={this.state.isRefresh}
              />
          )}
        </View>
    )
  }
}

const style = StyleSheet.create({
  container: {
    width: DEVICE_WIDTH,
    flex: 1,
    backgroundColor: '#fff'
  },
  searchContainer: {
    height: 40,
    width: DEVICE_WIDTH - 70,
    marginLeft: 20,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    ...DisplayStyle('row', 'center', 'flex-start'),
    borderRadius: 20
  },
  textInput: {
    flex: 1,
    height: 45,
    color: CommonColor.color_white,
    fontSize: 16,
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  itemContainer: {
    ...DisplayStyle('row', 'center', 'center'),
    height: 50,
    width: DEVICE_WIDTH,
    backgroundColor: CommonColor.color_white
  },
  itemRow: {
    height: 50,
    marginLeft: 15,
    width: DEVICE_WIDTH - 30,
    ...DisplayStyle('row', 'center', 'space-between'),
    borderBottomWidth: 1 / PixelRatio.get(),
    borderColor: '#c8c7cc'
  },
  contentContainer: {
    backgroundColor: '#fff',
    width: DEVICE_WIDTH
  }
})

export default withNavigation(SelectAny)

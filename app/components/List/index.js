import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View, Text, FlatList, RefreshControl, Platform } from 'react-native'
import { Container } from '../../styles/commonStyles'
import {
  ListFooterComponent,
  ListLoading,
  EmptyList,
  ErrorList
} from '../../components'
import { connect } from 'react-redux'
import { setList } from '../../redux/actions/list'
// 解决ios 卡顿  
const delay = () => {
  return new Promise(resolve => {
    setTimeout(
      () => {
        resolve()
      },
      Platform.OS === 'ios' ? 500 : 0
    )
  })
}
class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isAllShow: false,
      isLoading: true,
      isError: false
    }
    this.data = {
      loadingType: 'dot', // loading类型 enum: ['dot','refresh']
      isRefreshing: false // 正在请求刷新数据
    }
  }

  static defaultProps = {
    pageKey: 'parm',
    primaryKey: 'KeyID',
    requestFirst: true,
    hasSameKeyID: false
  }

  static propTypes = {
    request: PropTypes.func.isRequired, // 请求列表api的函数
    form: PropTypes.object.isRequired, // 请求列表api的表单
    setForm: PropTypes.func.isRequired,
    renderItem: PropTypes.func.isRequired,
    listKey: PropTypes.string.isRequired, // redux中该页面列表的key
    requestFirst: PropTypes.bool, // 首次进入是否调接口
    onEndReached: PropTypes.func,
    onRefresh: PropTypes.func,
    pageKey: PropTypes.string,
    primaryKey: PropTypes.string,
    hasSameKeyID: PropTypes.bool,
  }
  componentDidMount() {
    if (this.props.requestFirst) {
      this.fetchList(this.props.form, true)
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.form !== nextProps.form) {
      if (nextProps.form.__loadingTypeFlag__) {
        this.data.loadingType = nextProps.form.__loadingTypeFlag__
      } else {
        this.data.loadingType = 'dot'
      }
      this.mark = new Date().getTime()
      this.fetchList(
        nextProps.form,
        false,
        this.mark,
        nextProps.form.__loadingTypeFlag__
      )
      delete nextProps.form.__loadingTypeFlag__
    }
  }
  fetchList = async (form, isFirstInit, mark, flag) => {
    this.setState({
      isLoading: true
    })
    try {
      let res = null
      if (isFirstInit) {
        const resArr = await Promise.all([this.props.request(form), delay()])
        res = resArr[0]
      } else {
        res = await this.props.request(form)
      }
      if (flag === 'refresh') {
        this.data.isRefreshing = false
      }
      if (this.mark !== mark) {
        return
      }
      const size = res.Data.Param.size
      const isAllShow = res.Data.rows.length < size
      let list
      if (res.Data.Param.page === 1) {
        list = res.Data.rows || []
      } else {
        // 下拉加载
        let rows = res.Data.rows
        const lastRows = this.props.allList[this.props.listKey].slice(-size)
        if (size && lastRows[0][this.props.primaryKey] != undefined) {
          const lastRowsPrimaryKeys = lastRows.map(
            v => v[this.props.primaryKey]
          )
          rows = rows.filter(
            val => !lastRowsPrimaryKeys.includes(val[this.props.primaryKey])
          )
        }
        list = this.props.allList[this.props.listKey].concat(...(rows || []))
      }
      if (this.props.hasSameKeyID) {
        list.forEach(x => {
          delete x.KeyID
        })
      }
      this.props.dispatch(
        setList({
          key: this.props.listKey,
          data: list
        })
      )
      this.setState({
        isAllShow,
        isLoading: false,
        isError: false
      })
    } catch (err) {
      this.setState({
        isLoading: false,
        isError: true
      })
    }
  }

  onEndReached = () => {
    if (this.state.isLoading || this.state.isAllShow || this.data.isRefreshing)
      return
    const form = { ...this.props.form }
    form[this.props.pageKey].page += 1
    form['__loadingTypeFlag__'] = 'onEnd'
    this.props.setForm(form)
    this.props.onEndReached && this.props.onEndReached()
  }
  onRefresh = () => {
    this.data.isRefreshing = true
    const form = { ...this.props.form }
    form[this.props.pageKey].page = 1
    form['__loadingTypeFlag__'] = 'refresh'
    this.props.setForm(form)
    this.props.onRefresh && this.props.onRefresh()
  }
  render() {
    if (!this.props.allList[this.props.listKey] && this.state.isError) {
      return (
        <ErrorList
          refresh={() => {
            const form = { ...this.props.form }
            this.props.setForm(form)
          }}
          text={'网络连接错误'}
        />
      )
    }
    return this.data.loadingType === 'dot' && this.state.isLoading ? (
      <ListLoading withList />
    ) : (
      <View style={{ ...Container, zIndex: -2 }}>
        <FlatList
          contentContainerStyle={{}}
          data={this.props.allList[this.props.listKey]}
          renderItem={this.props.renderItem}
          keyboardShouldPersistTaps="always"
          ListEmptyComponent={<EmptyList text={'暂无内容'} />}
          keyExtractor={(item, index) =>
            item[this.props.primaryKey] != undefined
              ? item[this.props.primaryKey] + ''
              : index + ''
          }
          // 上拉刷新
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            !this.data.isRefreshing && (
              <ListFooterComponent
                list={this.props.allList[this.props.listKey]}
                isAll={this.state.isAllShow}
              />
            )
          }
          // 下拉刷新
          refreshControl={
            <RefreshControl
              refreshing={
                this.state.isLoading && this.data.loadingType === 'refresh'
              }
              onRefresh={this.onRefresh}
              colors={['#389ef2']}
              tintColor="#389ef2"
              title="加载中..."
            />
          }
        />
      </View>
    )
  }
}

const mapToProps = state => {
  return { allList: state.list }
}
export default connect(mapToProps)(List)

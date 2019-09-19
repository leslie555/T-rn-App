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
      loadingType: 'dot' // loading类型 enum: ['dot','refresh']
    }
  }

  static defaultProps = {
    pageKey: 'parm',
    primaryKey: 'KeyID'
  }

  static propTypes = {
    request: PropTypes.func.isRequired, // 请求列表api的函数
    form: PropTypes.object.isRequired, // 请求列表api的表单
    setForm: PropTypes.func.isRequired,
    renderItem: PropTypes.func.isRequired,
    listKey: PropTypes.string.isRequired, // redux中该页面列表的key
    onEndReached: PropTypes.func,
    onRefresh: PropTypes.func,
    pageKey: PropTypes.string,
    primaryKey: PropTypes.string
  }
  componentDidMount() {
    this.fetchList(this.props.form, true)
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.form !== nextProps.form) {
      this.fetchList(nextProps.form)
    }
  }
  fetchList = async (form, isFirstInit) => {
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
      const isAllShow = res.Data.rows.length < res.Data.Param.size
      let list
      if (res.Data.Param.page === 1) {
        list = res.Data.rows || []
      } else {
        list = this.props.allList[this.props.listKey].concat(
          ...(res.Data.rows || [])
        )
      }
      this.props.dispatch(
        setList({
          key: this.props.listKey,
          data: list
        })
      )
      this.setState(
        {
          isAllShow,
          isLoading: false,
          isError: false
        },
        () => {
          this.data.loadingType = 'dot'
        }
      )
    } catch (err) {
      this.setState({
        isLoading: false,
        isError: true
      })
    }
  }

  onEndReached = () => {
    this.data.loadingType = null
    if (this.state.isLoading || this.state.isAllShow) return
    const form = { ...this.props.form }
    form[this.props.pageKey].page += 1
    this.props.setForm(form)
    this.props.onEndReached && this.props.onEndReached()
  }
  onRefresh = () => {
    this.data.loadingType = 'refresh'
    const form = { ...this.props.form }
    form[this.props.pageKey].page = 1
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
          keyboardShouldPersistTaps='always'
          ListEmptyComponent={<EmptyList text={'暂无内容'} />}
          keyExtractor={item => item[this.props.primaryKey] + ''}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            <ListFooterComponent
              list={this.props.allList[this.props.listKey]}
              isAll={this.state.isAllShow}
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={
                this.state.isLoading && this.data.loadingType === 'refresh'
              }
              onRefresh={this.onRefresh}
              colors={['#389ef2']}
              tintColor='#389ef2'
              title='加载中...'
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

import React, { Fragment } from 'react'
import { withNavigation } from 'react-navigation'
import { View, ScrollView, StyleSheet, Text, Alert } from 'react-native'
import { Container, DisplayStyle, _1PX } from '../../../../styles/commonStyles'
import {
  Separator,
  Header,
  ButtonGroup,
  FullModal,
  ImagePreview
} from '../../../../components'
import ReimbursementSteps from '../../RenovationApply/RenovationApplyDetail/RenovationProgress'
import { EditReimbursement } from '../../../../api/pay'
import { ShowReimbursementDetails } from '../../../../api/pay'
import { deleteList, updateList } from '../../../../redux/actions/list'
import { connect } from 'react-redux'
import { getEnumDesByValue } from '../../../../utils/enumData'
import { dateFormat } from '../../../../utils/dateFormat'

const TitleColor = '#363636'
const TextColor = '#999'

const Item = props => {
  return (
    <View style={styles.rowContainer}>
      <Text style={{ color: TitleColor }}>{props.title}</Text>
      <Text style={{ color: TextColor }}>{props.children}</Text>
    </View>
  )
}

const Remark = props => {
  return <Text style={styles.remarkContainer}>{props.children}</Text>
}

/* const statusLabelEnum = {
  1: '待确认',
  2: '预定成功',
  3: '预定失败',
  4: '快到签约',
  5: '已取消',
  6: '待付款',
  7: '已签约',
  8: '已过期',
  9: '已转定'
} */

class WriteOffDetail extends React.Component {
  constructor(props) {
    super(props)
    this.id = this.props.navigation.getParam('id')
    this.state = {
      btnOptions: [],
      loading: false
    }
    this.item = {}
    this.imgList = []
    this.reimbursementTypes = []
    this.reimbursementRecords = []
    /* btnOptions.push({
        label: '定金条',
        value: 'Print',
        imgSource: dingjintiao,
        color: '#4aa8f5'
      }) */
  }
  componentDidMount() {
    this.setState({
      loading: true
    })
    ShowReimbursementDetails({
      KeyID: this.id
    })
      .then(({ Data }) => {
        const btnOptions = []
        this.item = Data.reimbursements[0]
        this.imgList = Data.ImageList || []
        this.reimbursementTypes = Data.reimbursementTypes || []
        this.reimbursementRecords = Data.reimbursementRecords || []
        if (this.item.Status === 1 || this.item.Status === 3) {
          btnOptions.push(
            ...[
              {
                label: '修改',
                value: 'Edit'
              },
              {
                label: '删除',
                value: 'Delete'
              }
            ]
          )
        } else if (this.item.Status === 2) {
          btnOptions.push({
            label: '撤回',
            value: 'Revert'
          })
        }
        this.setState({
          loading: false,
          btnOptions
        })
      })
      .finally(() => {
        this.setState({
          loading: false
        })
      })
  }
  handleEditClick = () => {
    this.props.navigation.navigate('AgentAddWriteOff', {
      data: JSON.stringify(this.item),
      imgList: JSON.stringify(this.imgList),
      reimbursementTypes: JSON.stringify(this.reimbursementTypes)
    })
  }
  handleDeleteClick = () => {
    Alert.alert('温馨提示', '确定要删除吗？', [
      { text: '取消' },
      {
        text: '确认',
        onPress: () => {
          this.setState({
            loading: true
          })
          EditReimbursement({
            KeyID: this.item.KeyID,
            OperationType: 2
          }).then(() => {
            this.setState(
              {
                loading: false
              },
              () => {
                setTimeout(() => {
                  Alert.alert(
                    '提示',
                    '删除成功',
                    [
                      {
                        text: '确定',
                        onPress: () => {
                          this.props.dispatch(
                            deleteList({
                              key: 'writeOffList',
                              KeyID: this.item.KeyID
                            })
                          )
                          this.props.navigation.navigate('AgentWriteOff')
                        }
                      }
                    ],
                    { cancelable: false }
                  )
                }, 100)
              }
            )
          })
        }
      }
    ])
  }
  handleRevertClick = () => {
    Alert.alert('温馨提示', '确定要撤回吗？', [
      { text: '取消' },
      {
        text: '确认',
        onPress: () => {
          this.setState({
            loading: true
          })
          EditReimbursement({
            KeyID: this.item.KeyID,
            OperationType: 3
          })
            .then(() => {
              this.props.dispatch(
                updateList({
                  key: 'writeOffList',
                  KeyID: this.item.KeyID,
                  data: {
                    ...this.item,
                    reimbursementTypes: this.reimbursementTypes,
                    Status: 1
                  }
                })
              )
              this.props.navigation.navigate('AgentWriteOff')
            })
            .finally(() => {
              this.setState({
                loading: false
              })
            })
        }
      }
    ])
  }
  render() {
    const { item, reimbursementTypes, imgList } = this
    return (
      <View style={Container}>
        <Header title={'报销详情'} />
        <FullModal visible={this.state.loading} />
        <ScrollView style={styles.contentContainer}>
          <Item title={'房源名称'}>{item.HouseName}</Item>
          <Item title={'状态'}>
            {getEnumDesByValue('ReimbursementStatus', item.Status)}
          </Item>
          <Separator label={'费用项目'} />
          {reimbursementTypes.map(v => {
            return (
              <Item
                key={v.KeyID}
                title={`${v.BillProjectTypeName}>${v.BillProjectName}`}
              >
                {v.Money + '元'}
              </Item>
            )
          })}
          <Separator label={''} />

          <Item title={'申请人'}>
            {item.UserName || '' + '  ' + item.Phone || ''}
          </Item>
          <Item title={'申请时间'}>
            {dateFormat(item.ApplyTime, 'yyyy-MM-dd hh:mm:ss')}
          </Item>
          <Item title={'负责人'}>{item.FEmpName}</Item>

          <Separator label={'备注'} />
          <Remark>{item.Remark || '无'}</Remark>
          <Separator label={'图片凭证'} />
          <ImagePreview imgSrc={imgList} />
          <ReimbursementSteps
            RenovationTrack={this.reimbursementRecords}
          ></ReimbursementSteps>
        </ScrollView>
        <ButtonGroup
          options={this.state.btnOptions}
          handleEditClick={this.handleEditClick}
          handleDeleteClick={this.handleDeleteClick}
          handleRevertClick={this.handleRevertClick}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1
  },
  rowContainer: {
    ...DisplayStyle('row', 'center', 'space-between'),
    height: 43,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: _1PX,
    borderBottomColor: '#eee'
  },
  remarkContainer: {
    textAlign: 'left',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff'
  }
})

export default connect()(withNavigation(WriteOffDetail))

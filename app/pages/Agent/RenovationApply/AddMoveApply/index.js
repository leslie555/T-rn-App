import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {GiftedForm, GiftedFormManager} from '../../../../components/Form/GiftedForm'
import {ButtonGroup, Header, UploadFile} from '../../../../components'
import Toast from 'react-native-root-toast'
import FullModal from '../../../../components/FullModal'
import {connect} from 'react-redux'
import {addList, updateList} from '../../../../redux/actions/list'
import {updateMovingDetail} from '../../../../redux/actions/movingDetail'

import {showSelectAny} from '../../../../components/SelectAny/util'
import {AddCleaning, AddHouseMoving, EditHouseMoving, InsertMaintain} from '../../../../api/service'
import {DiffArrFn,deepCopy} from "../../../../utils/arrUtil";

class AddRenovationApply extends React.Component {
  constructor(props) {
    super(props)
    this.formName = 'AddMoveApply'
    this.query = this.props.navigation.state.params || {}
    this.state = {
      loading: false,
      HouseName: '',
      projects: [],
      disabled: false,
      oldImageList: [],
      EditFormData: {
        HouseKey: '',
        HouseID: '',
        HouseName: '',
        HouseArea: '',
        Location: '',
        TenantName: '',
        TenantTel: '',
        MaintainContent: '',
        Img: '',
        BZ: '',
        EmployeeID: '',
        DepID: ''
      }
    }
    this.btnOption = [{label: '提交', value: 'Add'}]
    this.houseInfo = {}
    this.title = ''
    this.viewDidAppear = null
    this.oldImageList = []
    this.editType = props.navigation.getParam('editType') // 0新增 1修改
    this.data = props.navigation.getParam('data') // 数据
    this.MaintainLabel = '搬家内容'
  }

  componentWillMount() {
    this.viewDidAppear = this.props.navigation.addListener('willFocus', obj => {
      if (!obj.state.params) {
        return
      } else {
        const houseInfo = obj.state.params.houseInfo
        if (houseInfo) {
          this.houseInfo = JSON.parse(houseInfo)
          this.state.EditFormData.HouseName = this.houseInfo.HouseName
          this.state.EditFormData.HouseID = this.houseInfo.KeyID
          this.state.EditFormData.HouseKey = this.houseInfo.HouseKey
          this.state.EditFormData.HouseArea = this.houseInfo.HouseArea
          this.state.EditFormData.Location = this.houseInfo.Location
          // 后来添加
          this.state.EditFormData.EmployeeID = this.houseInfo.EmployeeID
          this.state.EditFormData.DepID = this.houseInfo.DepID

          this.setState({
            HouseName: this.houseInfo.HouseName
          })
        }
      }
    })
    if (this.editType === 0) {
      this.state.EditFormData = {...this.state.EditFormData, Img: []}
      this.title = '新增搬家'
    } else {
      console.log(this.data)
      const Img = this.data.ImageList || []
      let data = {...this.data}
      data.HouseRecord[0].Img = Img
      this.state.EditFormData = data.HouseRecord[0]
      this.state.EditFormData.TenantName = this.state.EditFormData.TenantName
      this.state.EditFormData.TenantTel = this.state.EditFormData.TenantTel
      this.title = '修改搬家'
      this.state.HouseName = data.HouseRecord[0].HouseName
      this.oldImageList = deepCopy(Img||[])
    }
  }

  componentWillUnmount() {
    this.viewDidAppear.remove()
  }

  handleAddClick = (type = 2) => {
    // 暂存1 提交2
    const validationResults = GiftedFormManager.validate(this.formName)
    const values = GiftedFormManager.getValues(this.formName)
    if (validationResults.isValid) {
      this.state.EditFormData = {...this.state.EditFormData, ...values}
      if(!this.state.EditFormData.MovingContent){
        Toast.show(`${this.MaintainLabel}不能为空`, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        return
      }
      this.setState({
        loading: true
      })
      let fn = this.editType === 0 ? AddHouseMoving : EditHouseMoving
    
      const Img = DiffArrFn(this.oldImageList, this.state.EditFormData.Img, [
        'ImageLocation'
      ])
      let arr = ''
      if (this.state.EditFormData.Img.length !== 0) {
        this.state.EditFormData.Img.forEach(item => {
          arr = arr + item.KeyID + ','
        })
        arr = arr.substring(0, arr.length - 1)
      } else {
        arr = ''
      }
      var form = {...this.state.EditFormData}
      form.Status = type
      form.ImageID = arr
      fn(form).then(({Data}) => {
        if (this.editType === 0) {
          Toast.show('新增成功', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
          this.props.dispatch(
              addList({
                key: 'AgentMoveApplyList',
                data: Data[0]
              })
          )
          this.props.navigation.goBack()
        } else {
          Toast.show('修改成功', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
          const KeyID = Data.houseRecord[0].KeyID
          const Datadetail = Data.details
          const DataList = Data.houseRecord[0]

          // 详情和列表都返回
          this.props.dispatch(
              updateList({
                key: 'AgentMoveApplyList',
                KeyID: KeyID,
                data: DataList
              })
          )
          this.props.dispatch(
            updateMovingDetail({
              data: Datadetail
            })
          )
        this.props.navigation.goBack()
        }
      }).finally(() => {
        this.setState({
          loading: false
        })
      })
    } else {
      const errors = GiftedFormManager.getValidationErrors(validationResults)
      Toast.show(errors[0], {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
    }
  }

  showSelectHouseFn() {
    showSelectAny({
      apiType: 1,
      extraParam: {
        Type: 4
      },
      path: 'AgentAddMoveApply',
      returnKey: 'houseInfo'
    })
  }

  onUploadFileChange = data => {
    this.setState({
      EditFormData: {...this.state.EditFormData, Img: data}
    })
  }

  render() {
    const {EditFormData, HouseName} = this.state
    return (
        <View style={{flex: 1}}>
          <FullModal visible={this.state.loading}/>
          <Header
              title={this.title}
              headerRight={
                <TouchableOpacity
                    onPress={() => {
                      this.handleAddClick(1)
                    }}
                >
                  <Text style={styles.addButtonText}>暂存</Text>
                </TouchableOpacity>
              }
          />
          <GiftedForm
              formName={this.formName} // GiftedForm instances that use the same name will also share the same states
              clearOnClose={true} // delete the values of the form when unmounted
              // validators={this.rules}
          >
            <GiftedForm.SeparatorWidget/>
            <GiftedForm.LabelWidget
                name='HouseName'
                title='房源名称'
                placeholder='请选择'
                onLabelPress={() => {
                  this.showSelectHouseFn()
                }}
                value={HouseName}
            />
            <GiftedForm.TextInputWidget
                name='TenantName'
                title='租客姓名'
                required={false}
                maxLength={30}
                value={EditFormData.TenantName + ''}
            />
            <GiftedForm.TextInputWidget
                name='TenantTel'
                title='租客电话'
                required={false}
                maxLength={11}
                keyboardType={`phone-pad`}
                value={EditFormData.TenantTel + ''}
            />
            <GiftedForm.NoticeWidget required title={this.MaintainLabel}/>
            <GiftedForm.TextAreaWidget
                name='MovingContent'
                placeholder={`请输入${this.MaintainLabel}`}
                maxLength={1000}
                numberOfLines={5}
                value={EditFormData.MovingContent}
            />
            <GiftedForm.NoticeWidget title={`房源照片`}/>
            <UploadFile
                list={EditFormData.Img}
                type={`AgentAddMoveApply`}
                onChange={data => this.onUploadFileChange(data)}
            />
            <GiftedForm.NoticeWidget title='备注'/>
            <GiftedForm.TextAreaWidget
                name='BZ'
                maxLength={1000}
                numberOfLines={5}
                value={EditFormData.BZ}
            />
          </GiftedForm>
          <ButtonGroup
              options={this.btnOption}
              handleAddClick={this.handleAddClick}
              handleEditClick={this.handleAddClick}
          />
        </View>
    )
  }
}

const styles = StyleSheet.create({
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 20
  }
})
const mapStateToPorps = state => ({detail: state.renovationDetail})

export default connect(mapStateToPorps)(AddRenovationApply)

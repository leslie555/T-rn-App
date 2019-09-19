import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {GiftedForm, GiftedFormManager} from '../../../../components/Form/GiftedForm'
import {ButtonGroup, Header, UploadFile} from '../../../../components'
import Toast from 'react-native-root-toast'
import FullModal from '../../../../components/FullModal'
import {connect} from 'react-redux'
import {addList, updateList} from '../../../../redux/actions/list'
import {showSelectAny} from '../../../../components/SelectAny/util'
import {AddCleaning, EditCleaningApplication, EditMaintainApply, InsertMaintain} from '../../../../api/service'
import {DiffArrFn,deepCopy} from "../../../../utils/arrUtil";

class AddRenovationApply extends React.Component {
  constructor(props) {
    super(props)
    this.formName = 'AddCleanRepairApply'
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
        TenName: '',
        TenPhone: '',
        MaintainContent: '',
        Img: '',
        Remark: ''
      }
    }
    this.btnOption = [{label: '提交', value: 'Add'}]
    this.houseInfo = {}
    this.title = ''
    this.viewDidAppear = null
    this.oldImageList = []
    this.editType = props.navigation.getParam('editType') // 0新增 1修改
    this.busType = props.navigation.getParam('busType') // 0维修 1保洁
    this.data = props.navigation.getParam('data') // 数据
    this.MaintainLabel = this.busType === 0 ? '维修内容' : '保洁内容'
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
          this.setState({
            HouseName: this.houseInfo.HouseName
          })
        }
      }
    })
    if (this.editType === 0) {
      this.state.EditFormData = {...this.state.EditFormData, Img: []}
      this.title = this.busType === 0 ? '新增维修' : '新增保洁'
    } else {
      const Img = this.busType === 0 ? this.data.imageSumList : this.data.Img
      let data = {...this.data, Img: [...(Img || [])]}
      this.state.EditFormData = this.busType === 0 ? data : {...data, MaintainContent: data.CleaningContent}
      this.title = this.busType === 0 ? '修改维修' : '修改保洁'
      this.state.HouseName = data.HouseName
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
      if(!this.state.EditFormData.MaintainContent){
        Toast.show(`${this.MaintainLabel}不能为空`, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        return
      }
      this.setState({
        loading: true
      })
      let fn = AddCleaning
      if (this.editType === 0) {
        fn = this.busType === 0 ? InsertMaintain : AddCleaning
      } else {
        fn = this.busType === 0 ? EditMaintainApply : EditCleaningApplication
      }
      if (this.busType === 1) {
        this.state.EditFormData.CleaningContent = this.state.EditFormData.MaintainContent
      }
      const Img = DiffArrFn(this.oldImageList, this.state.EditFormData.Img, [
        'ImageLocation'
      ])
      fn({
        [this.busType === 0 ? 'maintain' : 'info']: {...this.state.EditFormData,Img},
        type
      }).then(({Data}) => {
        if (this.editType === 0) {
          Toast.show('新增成功', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
          this.props.dispatch(
              addList({
                key: 'AgentRepairCleanApplyList',
                data: Data
              })
          )
          this.props.navigation.goBack()
        } else {
          Toast.show('修改成功', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          })
          this.props.dispatch(
              updateList({
                key: 'AgentRepairCleanApplyList',
                KeyID: this.data.KeyID,
                data: Data
              })
          )
          this.props.navigation.navigate('AgentRepairCleanApplyDetail', {
            isRefresh: true
          })
        }
        this.props.navigation.goBack()
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
      path: 'AgentAddRepairCleanApply',
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
                name='TenName'
                title='租客姓名'
                required={false}
                maxLength={30}
                value={EditFormData.TenName + ''}
            />
            <GiftedForm.TextInputWidget
                name='TenPhone'
                title='租客电话'
                required={false}
                maxLength={11}
                keyboardType={`phone-pad`}
                value={EditFormData.TenPhone + ''}
            />
            <GiftedForm.NoticeWidget required title={this.MaintainLabel}/>
            <GiftedForm.TextAreaWidget
                name='MaintainContent'
                placeholder={`请输入${this.MaintainLabel}`}
                maxLength={1000}
                numberOfLines={5}
                value={EditFormData.MaintainContent}
            />
            <GiftedForm.NoticeWidget title={`房源照片`}/>
            <UploadFile
                list={EditFormData.Img}
                type={`AgentAddRepairCleanApply`}
                onChange={data => this.onUploadFileChange(data)}
            />
            <GiftedForm.NoticeWidget title='备注'/>
            <GiftedForm.TextAreaWidget
                name='Remark'
                maxLength={1000}
                numberOfLines={5}
                value={EditFormData.Remark}
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

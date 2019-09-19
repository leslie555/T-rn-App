import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import {
  GiftedForm,
  GiftedFormManager
} from '../../../../components/Form/GiftedForm'
import { ButtonGroup, Header, UploadFile } from '../../../../components'
import {
  AddRenovationApplyRecord,
  UpdateRenovationApplyRecord
} from '../../../../api/renovationApply'
import Toast from 'react-native-root-toast'
import FullModal from '../../../../components/FullModal'
import { connect } from 'react-redux'
import { addList, updateList } from '../../../../redux/actions/list'
import { showSelectAny } from '../../../../components/SelectAny/util'
import {
  DEVICE_WIDTH,
  CommonColor,
  _1PX,
  DisplayStyle
} from '../../../../styles/commonStyles'
import { deepCopy, DiffArrFn } from '../../../../utils/arrUtil'
class AddRenovationApply extends React.Component {
  constructor(props) {
    super(props)
    this.formName = 'AddRenovationApplyForm'
    this.isEdit = false
    this.query = this.props.navigation.state.params || {}
    this.state = {
      loading: false,
      HouseName: '',
      projects: [],
      disabled: false,
      EditFormData: {
        HouseID: '',
        HouseKey:'',
        HouseArea:'',
        Location:'',
        KeyLocation: '',
        ZXJSON: [],
        ImageID: [],
        BZ: '',
        Status: 1
      }
    }
    this.btnOption = [{ label: '提交', value: 'Add' }]
    this.houseInfo = {}
    this.headerTitle = '添加装修申请'
    this.viewDidAppear = null
    this.oldImageList = []
    this.type = props.navigation.getParam('type') // 1新增 2修改
    this.KeyID = props.navigation.getParam('id')
  }

  componentWillMount() {
    this.viewDidAppear = this.props.navigation.addListener('willFocus', obj => {
      // debugger
      if (!obj.state.params) {
        return
      } else {
        const houseInfo = obj.state.params.houseInfo
        if (houseInfo) {
          this.houseInfo = JSON.parse(houseInfo)
          this.setState({
            HouseName: this.houseInfo.HouseName
          })
        }
        const projects = obj.state.params.projects
        if (projects) {
          this.setState({
            projects: JSON.parse(projects)
          })
        }
      }
    })
    if (this.type === 2) {
      console.log(this.props.detail)
      this.headerTitle = '修改装修申请'
      const { detail } = this.props
      const item = detail.ApplyRecord[0]
      this.houseInfo = {
        HouseName: item.HouseName,
        KeyID: item.HouseID,
        HouseKey: item.HouseKey,
        HouseArea: item.HouseArea,
        Location: item.Location
      }
      this.state.EditFormData = item
      this.state.HouseName = item.HouseName
      this.state.projects = detail.DecorationDetails
      this.state.projects.forEach(v => {
        v.Number = v.Number + ''
        v.projectIDs = [
          v.RenovationApplyCategoryID,
          v.RenovationApplyConfigueID
        ]
      })
      this.oldImageList = deepCopy(detail.imageList||[])
      this.state.EditFormData.ImageID = detail.imageList || []
    }
  }
  componentWillUnmount() {
    this.viewDidAppear.remove()
  }
  handleAddClick = (status = 2) => {
    // 暂存1 提交2
    const validationResults = GiftedFormManager.validate(this.formName)
    const values = GiftedFormManager.getValues(this.formName)
    if (validationResults.isValid === true) {
      if (!this.state.projects.length) {
        Toast.show(`请先添加项目`, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        return
      }
      const form = values
      form.HouseID = this.houseInfo.KeyID
      form.HouseKey = this.houseInfo.HouseKey
      form.HouseArea = this.houseInfo.HouseArea
      form.Location = this.houseInfo.Location
      form.ImageID = this.state.EditFormData.ImageID.map(v => v.KeyID).join(',')
      form.ImageLocation = DiffArrFn(
        this.oldImageList,
        this.state.EditFormData.ImageID,
        ['ImageLocation']
      )
      form.Status = status
      form.ZXJSON = JSON.stringify(this.state.projects)
      this.setState({
        loading: true
      })
      if (this.type === 1) {
        AddRenovationApplyRecord(form)
          .then(res => {
            const data = res.Data.ApplyRecord[0]
            this.props.dispatch(
              addList({
                key: 'AgentRenovationApplyList',
                data: data
              })
            )
            this.props.navigation.navigate('AgentRenovationApplyList')
          })
          .finally(() => {
            this.setState({
              loading: false
            })
          })
      } else {
        form.RecordID = this.KeyID
        UpdateRenovationApplyRecord(form)
          .then(res => {
            const data = res.Data.ApplyRecord[0]
            this.props.dispatch(
              updateList({
                key: 'AgentRenovationApplyList',
                KeyID: this.KeyID,
                data: data
              })
            )
            // debugger
            this.props.navigation.navigate('AgentRenovationApplyList', {
              isRefresh: true
            })
          })
          .finally(() => {
            this.setState({
              loading: false
            })
          })
      }
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
        Type: 3
      },
      path: 'AgentAddRenovationApply',
      returnKey: 'houseInfo'
    })
  }

  editProject = () => {
    this.props.navigation.navigate('AgentRenovationProject', {
      data: JSON.stringify(this.state.projects)
    })
  }
  onUploadFileChange = data => {
    this.setState({
      EditFormData: { ...this.state.EditFormData, ImageID: data }
    })
  }
  render() {
    const { EditFormData, projects, HouseName } = this.state
    return (
      <View style={{ flex: 1 }}>
        <FullModal visible={this.state.loading} />
        <Header
          title={this.headerTitle}
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
          <GiftedForm.SeparatorWidget />
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
            name='KeyLocation'
            required={false}
            title='钥匙位置'
            value={EditFormData.KeyLocation}
          />

          <View style={style.separator}>
            <Text style={{ color: 'rgb(153,153,153)', fontSize: 13 }}>
              装修项目
            </Text>
            <TouchableOpacity
              style={style.editProjectBtn}
              onPress={this.editProject}
            >
              <Text style={style.editProjectText}>编辑项目</Text>
            </TouchableOpacity>
          </View>
          <View style={style.projectItemContainer}>
            {projects.map((v, index) => {
              return (
                <GiftedForm.LabelWidget
                  key={index}
                  title={v.ProjectName}
                  required={false}
                  placeholder='请选择'
                  disabled
                  renderRight={false}
                  value={`${v.ExternalPrice}元/${v.Unit}, 数量${v.Number}, 金额${v.ExternalPriceTotalAmount}元`}
                />
              )
            })}
          </View>

          <GiftedForm.NoticeWidget title={`房源照片`} />
          <UploadFile
            list={EditFormData.ImageID}
            type={`AgentAddRenovationApply`}
            onChange={data => this.onUploadFileChange(data)}
          />
          <GiftedForm.NoticeWidget title='备注' />

          <GiftedForm.TextAreaWidget
            name='BZ'
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

const style = StyleSheet.create({
  separator: {
    height: 30,
    width: DEVICE_WIDTH,
    paddingLeft: 10,
    paddingRight: 15,
    fontSize: 12,
    backgroundColor: CommonColor.color_text_bg,
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  editProjectBtn: {
    marginLeft: 5,
    borderColor: '#389ef2',
    borderWidth: _1PX,
    borderStyle: 'solid',
    borderRadius: 2,
    paddingHorizontal: 5,
    paddingVertical: 3
  },
  editProjectText: {
    fontSize: 12,
    color: CommonColor.color_primary,
    textAlign: 'center'
  },
  projectItemContainer: {
    paddingVertical: 10,
    backgroundColor: '#fff'
  }
})

const styles = StyleSheet.create({
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 20
  }
})
const mapStateToPorps = state => ({ detail: state.renovationDetail })

export default connect(mapStateToPorps)(AddRenovationApply)

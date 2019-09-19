import React, { Fragment } from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform
} from 'react-native'
import {
  GiftedForm,
  GiftedFormManager
} from '../../../../components/Form/GiftedForm'
import { FullModal, Header, ButtonGroup } from '../../../../components'
import { Container, DisplayStyle } from '../../../../styles/commonStyles'
import IconFont from '../../../../utils/IconFont'
import {
  ShowAllRenovationApply,
  ShowRenovationProject
} from '../../../../api/renovationApply'
import { validateNumber } from '../../../../utils/validate'
import Toast from 'react-native-root-toast'

const numberPad =
  Platform.OS === 'ios' ? `numbers-and-punctuation` : `number-pad`

export default class RenovationProject extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      projectData: [],
      ZXJSON: [
        {
          RenovationApplyCategoryID: '',
          projectIDs: [],
          ExternalPrice: '',
          Number: '',
          ExternalPriceTotalAmount: '',
          Unit: ''
        }
      ]
    }
    this.formName = 'RenovationProjectForm'
  }
  componentDidMount() {
    this.initData()
  }
  async initData() {
    this.setState({
      loading: true
    })
    try {
      const [type, project] = await Promise.all([
        ShowAllRenovationApply(),
        ShowRenovationProject()
      ])
      const filterProject = project.Data.map(v => ({
        label: v.ProjectName,
        value: v.KeyID,
        CategoryID: v.CategoryID,
        Unit: v.Unit || '',
        Model: v.Model || '',
        InsidePrice: v.InsidePrice,
        ExternalPrice: v.ExternalPrice
      }))
      const projectData = []
      type.Data.forEach(v => {
        const children = filterProject.filter(val => val.CategoryID === v.KeyID)
        if (children.length > 0) {
          projectData.push({
            label: v.CategoryName,
            value: v.KeyID,
            children
          })
        }
      })
      const projects = JSON.parse(this.props.navigation.getParam('data'))
      let ZXJSON = projects.length && projects
      debugger
      this.setState(
        {
          projectData,
          loading: false
        },
        () => {
          if (ZXJSON) this.setState({ ZXJSON })
        }
      )
    } catch (error) {
      this.setState({
        loading: false
      })
    }
  }
  addProject = () => {
    const ZXJSON = [...this.state.ZXJSON]
    ZXJSON.push({
      RenovationApplyCategoryID: '',
      projectIDs: [],
      ExternalPrice: '',
      Number: '',
      ExternalPriceTotalAmount: '',
      Unit: ''
    })
    this.setState({
      ZXJSON
    })
  }
  projectChange = (data, idx) => {
    const ZXJSON = [...this.state.ZXJSON]
    const item = ZXJSON[idx]
    item.projectIDs =
      GiftedFormManager.stores['RenovationProjectForm' + idx].values.projectIDs
    item.ProjectName = data.label
    item.RenovationApplyConfigueID = data.value
    item.RenovationApplyCategoryID = data.CategoryID
    item.Unit = data.Unit || ''
    item.ExternalPrice = data.ExternalPrice
    item.ExternalPriceTotalAmount = data.ExternalPrice * +item.Number
    item.InsidePrice = data.InsidePrice
    item.InsidePriceTotalAmount = data.InsidePrice * +item.Number
    this.setState({
      ZXJSON
    })
  }
  onChangeText = (value, idx) => {
    const ZXJSON = [...this.state.ZXJSON]
    const amount = ZXJSON[idx].ExternalPrice * +value
    ZXJSON[idx].Number = value
    ZXJSON[idx].ExternalPriceTotalAmount = isNaN(amount) ? '' : amount
    ZXJSON[idx].InsidePriceTotalAmount = ZXJSON[idx].InsidePrice * +value
    this.setState({
      ZXJSON
    })
  }
  validateNum(data, msg) {
    if (validateNumber(data)) {
      return true
    } else {
      Toast.show(msg, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
    }
  }
  handleSave = () => {
    let allValid = true
    for (let i = 0; i < this.state.ZXJSON.length; i++) {
      const validationResults = GiftedFormManager.validate(this.formName + i)
      const values = GiftedFormManager.getValues(this.formName + i)
      if (+values.Number <= 0) {
        Toast.show(`项目${i + 1}中数量有误`, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        return
      }
      if (!this.validateNum(values.Number, `项目${i + 1}中数量有误`)) return
      if (!validationResults.isValid) {
        allValid = false
        const errors = GiftedFormManager.getValidationErrors(validationResults)
        Toast.show(`项目${i + 1}中${errors[0]}`, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM
        })
        break
      }
    }

    if (allValid) {
      this.state.ZXJSON.forEach(v => {
        v.Number = +v.Number
      })
      this.props.navigation.navigate('AgentAddRenovationApply', {
        projects: JSON.stringify(this.state.ZXJSON)
      })
    }
  }
  handleProjectDelete = index => {
    const ZXJSON = [...this.state.ZXJSON]
    ZXJSON.splice(index, 1)
    this.setState({
      ZXJSON
    })
  }
  render() {
    const { ZXJSON } = this.state
    return (
      <View style={Container}>
        <ScrollView style={{ flex: 1 }}>
          <FullModal visible={this.state.loading} />
          <Header
            title={'编辑项目'}
            headerRight={
              <TouchableOpacity onPress={this.addProject}>
                <Text style={styles.addButtonText}>新增</Text>
              </TouchableOpacity>
            }
          />
          {ZXJSON.map((project, index) => (
            <GiftedForm key={index} formName={this.formName + index}>
              <GiftedForm.SeparatorWidget />
              <View
                style={{
                  ...DisplayStyle('row', 'center', 'space-between'),
                  height: 36,
                  paddingLeft: 10,
                  paddingRight: 20,
                  backgroundColor: '#fff'
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#333'
                  }}
                >{`项目${index + 1}：`}</Text>
                {ZXJSON.length > 1 && (
                  <TouchableOpacity
                    style={{
                      ...DisplayStyle('row', 'center', 'center'),
                      width: 20,
                      height: 20,
                      backgroundColor: '#888',
                      borderRadius: 10
                    }}
                    onPress={() => this.handleProjectDelete(index)}
                  >
                    <IconFont name='jiahao1' size={10} color='#fff' />
                  </TouchableOpacity>
                )}
              </View>
              <GiftedForm.CascaderWidget
                name='projectIDs'
                title='项目名称'
                data={this.state.projectData}
                value={project.projectIDs}
                onSelect={data => {
                  this.projectChange(data, index)
                }}
              />
              <GiftedForm.TextInputWidget
                name='ExternalPrice'
                title='单价'
                tail={project.Unit && `元/${project.Unit}`}
                disabled={true}
                maxLength={20}
                value={project.ExternalPrice + ''}
              />
              <GiftedForm.TextInputWidget
                name='Number'
                title='数量'
                keyboardType={numberPad}
                onChangeText={value => {
                  this.onChangeText(value, index)
                }}
                value={project.Number + ''}
              />
              <GiftedForm.TextInputWidget
                name='ExternalPriceTotalAmount'
                tail={`元`}
                disabled={true}
                title='总金额 '
                value={project.ExternalPriceTotalAmount + ''}
              />
            </GiftedForm>
          ))}
        </ScrollView>
        <View>
          <ButtonGroup
            options={[{ label: '保存', value: 'Save' }]}
            handleSaveClick={() => this.handleSave()}
          />
        </View>
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

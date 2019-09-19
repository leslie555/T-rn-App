import React, {Component} from 'react'
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {GiftedForm} from '../../../../components/Form/GiftedForm'
import {ButtonGroup, Header} from '../../../../components'
import {ReleaseHouse} from '../../../../api/house'
import Toast from 'react-native-root-toast';
import FullModal from "../../../../components/FullModal";
import {CommonColor, DisplayStyle} from '../../../../styles/commonStyles';

const {width} = Dimensions.get('window');

export default class HousePush extends React.Component {
  constructor(props) {
    super(props)
    this.formName = 'addOrderForm'
    this.state = {
      isEdit: false,
      isShowModal: true,
      ImageUpload: [],
      isEditLoading: false,
      IsDecorating: '',
      KeyID: 0,
      AuditStatus: '',
      HouseName: '',
      btnOption: [
        {label: '发布', value: 'Edit'}
      ],
      BadgeList: [
        {
          label: '乐租',
          value: '乐租',
          isSelect: false
        }
      ],
      form: {
        KeyID: '',
        ActDecorateStartTime: '', // 设置装修结束时间
        Remark: '',
        IsLoan: 0, // 是否设置装修
      }
    }
    this.EnumData = {
      IsLoan: [
        {
          label: '是',
          value: 1,
        },
        {
          label: '否',
          value: 0,
        }
      ]
    }
    this.headerTitle = '发布'
  }

  componentWillMount() {
    this.setState({
      isShowModal: false
    })
  }

  componentWillUnmount() {
  }

  handleAddClick = () => {
    this.setState({
      isShowModal: true
    })
    ReleaseHouse({
      houseID: this.props.navigation.state.params.houseID
    }).then(res => {
      Toast.show('发布成功', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      })
      this.setState({
        isShowModal: false
      })
      this.props.navigation.goBack()
    }).catch(() => {
      this.setState({
        isShowModal: false
      })
    })
  }

  changeIsLoan(val) {
    this.state.form.IsLoan = val
    this.setState({
      form: this.state.form
    })
  }

  onUploadFileChange(data) {
    this.setState({
      ImageUpload: data
    })
  }

  changeBadgeList(index, isSelect) {
    this.state.BadgeList[index].isSelect = !isSelect
    this.setState({
      BadgeList: this.state.BadgeList
    })
  }

  render() {
    const {form} = this.state
    const BadgeList = this.state.BadgeList.map((ele, index) => (
        <TouchableOpacity style={[styles.Badge_program_btn, ele.isSelect ? styles.Other_program_btn_select : '']}
                          key={index} onPress={this.changeBadgeList.bind(this, index, ele.isSelect)}>
          <Text
              style={[styles.Other_program_btn_text, ele.isSelect ? styles.Other_program_btn_text_select : '']}>{ele.label}</Text>
        </TouchableOpacity>
    ))
    return (
        <View style={{flex: 1}}>
          <FullModal visible={this.state.isShowModal}></FullModal>
          <Header title='发布'/>
          <GiftedForm
              formName='ruleForm0'// GiftedForm instances that use the same name will also share the same states
              clearOnClose={false} // delete the values of the form when unmounted
          >
            <GiftedForm.NoticeWidget title='入住时间'/>
            <GiftedForm.DatePickerWidget
                name='ActDecorateStartTime'
                title='入住时间'
                value={form.ActDecorateStartTime}
            />
            <GiftedForm.NoticeWidget title={`发布平台`}/>
            <View style={styles.Badge_program}>
              {BadgeList}
            </View>
          </GiftedForm>
          <ButtonGroup
              options={this.state.btnOption}
              handleEditClick={this.handleAddClick}
              isEditLoading={this.state.isEditLoading}
          />
        </View>
    )
  }
}


const styles = StyleSheet.create({
  Badge_program: {
    backgroundColor: '#fff',
    padding: 20,
    ...DisplayStyle('row', 'center', 'flex-start'),
    flexWrap: 'wrap'
  },
  Badge_program_btn: {
    width: parseInt((width - 70) / 4),
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 6,
    marginBottom: 10,
    marginRight: 8,
    borderStyle: 'solid',
    borderColor: '#dddddd',
    borderWidth: 1,
    ...DisplayStyle('row', 'center', 'center')
  },
  Other_program_btn_select: {
    borderColor: CommonColor.color_primary
  },
  Other_program_btn_text: {
    fontSize: 14
  },
  Other_program_btn_text_select: {
    color: CommonColor.color_primary
  }
})

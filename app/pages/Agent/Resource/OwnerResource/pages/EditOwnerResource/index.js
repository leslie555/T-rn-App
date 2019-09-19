import React, { Component } from "react";
import {Platform, View} from "react-native";
import styles from "./style";
import {
  GiftedForm,
  GiftedFormManager
} from "../../../../../../components/Form/GiftedForm";
import { FullModal, Header } from "../../../../../../components";
import ButtonGroup from "../../../../../../components/ButtonGroup";
import { connect } from "react-redux";
import Toast from "react-native-root-toast";
import { validateNumber } from "../../../../../../utils/validate";
import UploadFile from "../../../../../../components/UploadFile";
import { withNavigation } from "react-navigation";
import {
  AddOwnerHouseInfo,
  EditOwnerHouseInfo
} from "../../../../../../api/resource";
import { addList, updateList } from "../../../../../../redux/actions/list";
import { showSelectAny } from "../../../../../../components/SelectAny/util";

class EditOwnerResource extends React.Component {
  constructor(props) {
    super(props);
    this.numberPad = Platform.OS === 'ios' ? `numbers-and-punctuation`: `number-pad`
    this.editType = 0; // 0新增 1修改
    this.btnOptions = [];
    this.state = {
      form: {
        OwnerName: "",
        OwnerTel: "",
        ExpectedRent: "",
        CommunityName: "",
        Region: "",
        DetailedAddress: "",
        Tung: "",
        Unit: "",
        NumberPlate: "",
        Area: "",
        RoomCount: "",
        ToiletCount: "",
        HallCount: "",
        Remarks: "",
        HousePictureList: []
      },
      ImageUpload: [],
      communityDisabled: false,
      loading: false
    };
    // 路由监听
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      payload => {
        // 选择小区数据拦截
        if (payload.state.params && payload.state.params.communityInfo) {
          const obj = JSON.parse(payload.state.params.communityInfo);
          // 小区可能是添加
          if (obj.isAdd) {
            obj.communityDisabled = false;
          } else {
            obj.communityDisabled = true;
          }
          this.setState({
            communityDisabled: !obj.isAdd,
            form: {
              ...this.state.form,
              CommunityName: obj.CommunityName,
              Region: obj.CityCode || "",
              DetailedAddress: obj.Location || ""
            }
          });
        }
      }
    );
  }

  componentWillMount() {
    this.initData();
  }

  initData() {
    this.editType = this.props.navigation.getParam("editType", 0);
    const dataItem = this.props.navigation.getParam("data", "{}");

    if (this.editType === 1) {
      this.state.form = JSON.parse(dataItem);
      this.state.ImageUpload = this.state.form.HousePictureList || [];
      this.state.communityDisabled = true;
    }
    this.btnOptions.push({
      label: this.editType === 0 ? "保存" : "修改",
      value: "Save"
    });
  }

  onUploadFileChange(data) {
    this.setState({
      ImageUpload: data
    });
  }

  showSelectCommunityFn() {
    showSelectAny({
      apiType: 2,
      path: "AgentEditOwnerResource",
      returnKey: "communityInfo"
    });
  }

  validateForm(form) {
    const options1 = {
      min: 0,
      max: 100000
    };
    const msg1 = `只能为0-100000的数字`;
    if (!validateNumber(form.ExpectedRent, options1)) {
      Toast.show("期望租金" + msg1, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      });
      return false;
    }
    if (!validateNumber(form.Area, options1)) {
      Toast.show("建筑面积" + msg1, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      });
      return false;
    }
    return true;
  }

  changeStore(data) {
    const key = "AgentPrivateGuestList";
    if (this.editType === 0) {
      this.props.dispatch(
        addList({
          key,
          data
        })
      );
    } else {
      // TODO edit
      const KeyID = this.props.navigation.getParam("KeyID", "")
      this.props.dispatch(updateList({key, KeyID, data}));
    }
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  handleSave() {
    debugger
    const validationResults0 = GiftedFormManager.validate(
      "EditOwnerResourceRuleForm"
    );
    const values0 = GiftedFormManager.getValues("EditOwnerResourceRuleForm");
    if (validationResults0.isValid) {
      if (!this.validateForm(values0)) return;
      this.state.form = { ...this.state.form, ...values0 };
      this.state.form.HousePictureList = this.state.ImageUpload;
      const fn = this.editType === 0 ? AddOwnerHouseInfo : EditOwnerHouseInfo;
      this.setState({
        loading: true
      });
      fn(this.state.form)
        .then(({ Data }) => {
          const msg = this.editType === 0 ? "新增成功" : "修改成功";
          Toast.show(msg, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM
          });
          this.changeStore(Data);
          this.props.navigation.goBack();
        })
        .finally(() => {
          this.setState({
            loading: false
          });
        });
    } else {
      const errors = GiftedFormManager.getValidationErrors(validationResults0);
      Toast.show(errors[0], {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM
      });
    }
  }

  render() {
    const { form } = this.state;
    return (
      <View style={styles.resource_container}>
        <Header title={this.editType === 0 ? `新增备案` : `修改备案`} />
        <FullModal visible={this.state.loading} />
        <GiftedForm formName="EditOwnerResourceRuleForm">
        <GiftedForm.SeparatorWidget />
          <GiftedForm.TextInputWidget
            name="OwnerName"
            title="业主姓名"
            maxLength={16}
            value={form.OwnerName}
          />
          <GiftedForm.TextInputWidget
            name="OwnerTel"
            title="业主电话"
            keyboardType={`phone-pad`}
            maxLength={16}
            value={form.OwnerTel + ""}
          />
          <GiftedForm.TextInputWidget
            name="ExpectedRent"
            title="期望租金"
            maxLength={7}
            keyboardType={this.numberPad}
            value={form.ExpectedRent + ""}
          />
          <GiftedForm.SeparatorWidget />
          <GiftedForm.LabelWidget
            name="CommunityName"
            title="小区名称"
            placeholder="请选择"
            onLabelPress={() => {
              this.showSelectCommunityFn();
            }}
            value={form.CommunityName}
          />
          <GiftedForm.AreaPickerWidget
            name="Region"
            title="所属区域"
            disabled={this.state.communityDisabled}
            value={form.Region}
          />
          <GiftedForm.TextInputWidget
            inline={false}
            name="DetailedAddress"
            title="详细地址"
            disabled={this.state.communityDisabled}
            placeholder="请输入详细地址"
            maxLength={50}
            numberOfLines={2}
            value={form.DetailedAddress + ""}
          />
          <GiftedForm.TextInputWidget
            name="Tung"
            title="栋"
            keyboardType={this.numberPad}
            maxLength={10}
            value={form.Tung + ""}
          />
          <GiftedForm.TextInputWidget
            name="Unit"
            title="单元"
            required={false}
            keyboardType={this.numberPad}
            maxLength={10}
            value={form.Unit + ""}
          />
          <GiftedForm.TextInputWidget
            name="NumberPlate"
            title="门牌"
            keyboardType={this.numberPad}
            maxLength={10}
            value={form.NumberPlate + ""}
          />
          <GiftedForm.TextInputWidget
            name="Area"
            title="建筑面积"
            required={false}
            keyboardType={this.numberPad}
            maxLength={10}
            value={form.Area + ""}
            tail={`㎡`}
          />
          <GiftedForm.NoticeWidget title={`户型`} />
          <GiftedForm.TextInputWidget
            name="RoomCount"
            title="室"
            required={false}
            keyboardType={this.numberPad}
            maxLength={2}
            value={form.RoomCount + ""}
          />
          <GiftedForm.TextInputWidget
            name="HallCount"
            title="厅"
            required={false}
            keyboardType={this.numberPad}
            maxLength={2}
            value={form.HallCount + ""}
          />
          <GiftedForm.TextInputWidget
            name="ToiletCount"
            title="卫"
            required={false}
            keyboardType={this.numberPad}
            maxLength={2}
            value={form.ToiletCount + ""}
          />
          <GiftedForm.NoticeWidget title={`房源图片`} />
          <UploadFile
            list={this.state.ImageUpload}
            type={`EditOwnerResource`}
            onChange={data => this.onUploadFileChange(data)}
          />
          <GiftedForm.NoticeWidget title={`备注`} />
          <GiftedForm.TextAreaWidget
            name="Remarks"
            required={false}
            placeholder="请输入备注信息"
            maxLength={100}
            value={form.Remarks}
          />
        </GiftedForm>
        <ButtonGroup
          options={this.btnOptions}
          handleSaveClick={() => this.handleSave()}
        />
      </View>
    );
  }
}

const mapToProps = state => ({ enumList: state.enum.enumList });
export default withNavigation(connect(mapToProps)(EditOwnerResource));

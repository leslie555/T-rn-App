import React, { Component } from "react";
import PropTypes from "prop-types";
import { withNavigation } from "react-navigation";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { connect } from "react-redux";
import { ImagePreview, Header } from "../../../../../../components";
import { GiftedForm } from "../../../../../../components/Form/GiftedForm";
import LabelWidget from "../../../../../../components/Form/widgets/LabelWidget";
import styles from "./style";
import { CommonColor } from "../../../../../../styles/commonStyles";

class PrivateGuestDetail extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    item: PropTypes.shape({
      OwnerName: PropTypes.string ,/**业主姓名 */
      OwnerTel: PropTypes.string ,/**业主电话 */
      ExpectedRent: PropTypes.number ,/**期望租金 */
      DetailedAddress: PropTypes.string ,/**业主详细地址 */
      Region: PropTypes.string, /**所属区域 */ 
      RoomCount: PropTypes.number ,/**室 */
      HallCount: PropTypes.number ,/**厅 */
      ToiletCount: PropTypes.number, /**卫 */
      CommunityName: PropTypes.string /**小区名称 */,
      NumberPlate: PropTypes.number /**房间号 */,
      HousePictureList: PropTypes.array /**房源图片 */,
      Remarks: PropTypes.string, /**备注 */
      KeyID: PropTypes.number, 
      Tung: PropTypes.number, /**栋 */
      Unit: PropTypes.number, /**单元 */
    })
  };

  static defaultProps = {
    item: {
      OwnerName: "" ,
      OwnerTel: "" ,
      ExpectedRent: "" ,
      DetailedAddress: "" ,
      Region: "",  
      RoomCount: 0,
      HallCount: 0,
      ToiletCount: 0,
      CommunityName: "",
      NumberPlate: 0,
      HousePictureList: [],
      Remarks: "",
      KeyID: '',
      Tung: 0,
      Unit: 0,
    }
  };

  render() {
    const {
      OwnerName,
      ExpectedRent,
      DetailedAddress,
      RoomCount,
      HallCount,
      ToiletCount,
      CommunityName,
      NumberPlate,
      HousePictureList,
      Remarks,
      KeyID,
      OwnerTel,
      Region,
      Tung,
      Unit,
    } = this.props.item;
    return (
      <View style={styles.container}>
        <Header title={"详情"} />
        <ScrollView>
          <GiftedForm formName={"BaseInfo"} clearOnClose={false}>
            <LabelWidget
              type='LabelWidget'
              title="业主姓名"
              value={OwnerName}
              required={false}
              renderRight={false}
            />
            <LabelWidget
              type='LabelWidget'
              title="业主电话"
              value={OwnerTel}
              required={false}
              renderRight={false}
            />
            <LabelWidget
              type='LabelWidget'
              title="期望资金"
              value={ExpectedRent + "元/月"}
              required={false}
              renderRight={false}
            />
            <LabelWidget
              type='LabelWidget'
              title="所属区域"
              value={Region}
              required={false}
              renderRight={false}
            />
            <LabelWidget
              type='LabelWidget'
              title="小区名称"
              value={CommunityName}
              required={false}
              renderRight={false}
            />         
            <GiftedForm.TextInputWidget
              inline={false}
              name="OwnerAddress"
              title="详细地址"
              maxLength={50}
              numberOfLines={2}
              disabled={true}
              value={DetailedAddress}
              required={false}
            />
            {/* <LabelWidget
              type='LabelWidget'
              title="详细地址"
              value={DetailedAddress}
              required={false}
              renderRight={false}
            />               */}
            <LabelWidget
              type='LabelWidget'
              title="房间号"
              value={`${Tung}-${Unit}-${NumberPlate}`}
              required={false}
              renderRight={false}
            />              
            <LabelWidget
              title="户型"
              editable={false}
              value={`${RoomCount}室${HallCount}厅${ToiletCount}卫`}
              required={false}
              renderRight={false}
            />
            <GiftedForm.NoticeWidget title={"房源图片"} />
            <View style={{ backgroundColor: CommonColor.color_white }}>
              <ImagePreview imgSrc={HousePictureList ? HousePictureList : []} />
            </View>
            <GiftedForm.NoticeWidget title={"备注"} />
            <GiftedForm.TextAreaWidget
              name="remarks"
              required={false}
              editable={false}
              maxLength={100}
              value={Remarks}
            />
          </GiftedForm>
        </ScrollView>
          <View style={styles.page_bottom}>
            <TouchableOpacity
              style={styles.page_bottom_btn}
              onPress={() => {
                this.props.navigation.navigate('AgentEditOwnerContract', {
                  EntranceID: KeyID
                })
              }}
            >
              <Text style={styles.page_btn_text}>签约</Text>
            </TouchableOpacity>
          </View>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const KeyID = ownProps.navigation.state.params.KeyID;
  const listKey = ownProps.navigation.state.params.listKey;
  const item = state.list[listKey].find(val => {
    return val.KeyID === KeyID;
  });
  return {
    item
  };
};
export default connect(mapStateToProps)(withNavigation(PrivateGuestDetail));

import React, { Component } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteList, addList } from "../../../../../../../redux/actions/list";
import styles from "./style";
import { OwnerChangePubOrPrivate } from "../../../../../../../api/resource";

class ListItem extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    changeLoading: PropTypes.func.isRequired,
    changePage: PropTypes.func,
    item: PropTypes.shape({
      DetailedAddress: PropTypes.string,
      ProtectionDayTips: PropTypes.string,
      IsProtection: PropTypes.number,
      IsSigned: PropTypes.number,
      KeyID: PropTypes.number,
      Tung: PropTypes.number,
      Unit: PropTypes.number,
      NumberPlate: PropTypes.number,
      CommunityName: PropTypes.string,
    })
  };

  dispatchAction(action, key, KeyID, data) {
    switch (action) {
      case "ADD":
        this.props.dispatch(
          addList({
            key,
            data
          })
        );
      case "DELETE":
        this.props.dispatch(
          deleteList({
            KeyID,
            key
          })
        );
      default:
        return;
    }
  }

  // 调用接口后弹出提示框, 点击确认后转到私客页面
  setTimer = () => {
    setTimeout(() => {
      Alert.alert("温馨提示", "转为私客成功", [
        {
          text: "确认",
          onPress: () => {
            this.props.changePage && this.props.changePage(1);
          }
        }
      ]);
    }, 100);
  };

  isObject(data) {
    if (Object.prototype.toString.call(data) == "[object Object]") {
      return true;
    } else {
      return false;
    }
  }

  // 调用公客转为私客接口
  requestData(KeyID) {
    const fn = OwnerChangePubOrPrivate;
    fn({ KeyID })
      .then(({ Data }) => {
        if (Data && this.isObject(Data)) {
          const key = "AgentPrivateGuestList";
          const data = { ...Data };
          this.dispatchAction("ADD", key, undefined, data);
          this.dispatchAction("DELETE", this.props.listKey, KeyID);
          this.props.changeLoading && this.props.changeLoading(this.setTimer);
        }
      })
      .catch(() => {
        console.log("error");
      });
  }

  // 点击确认后回调改变loading状态并请求数据
  confirmed(KeyID) {
    this.props.changeLoading && this.props.changeLoading();
    this.requestData(KeyID);
  }

  //转为私客
  changePubToPri(KeyID) {
    Alert.alert("温馨提示", "确定要转为私客吗", [
      { text: "取消" },
      {
        text: "确认",
        onPress: () => {
          this.confirmed(KeyID);
        }
      }
    ]);
  }

  render() {
    const {
      DetailedAddress,
      ProtectionDayTips,
      IsProtection,
      IsSigned,
      KeyID,
      CommunityName,
      Tung,
      Unit,
      NumberPlate
    } = this.props.item;
    const protection = (
      <Text style={styles.top_protection}>{`${ProtectionDayTips}`}</Text>
    );
    const followUp = <Text style={styles.top_followUp}>可跟进</Text>;
    const signed = <Text style={styles.top_signed}>已签约</Text>;
    const IsCanfollowUp = !IsSigned && !IsProtection;
    return (
      <View style={styles.outside_box}>
        <View style={styles.top_conatiner}>
          <View style={styles.top_title}>
            <Text
              style={styles.top_title_text}
            >{`${CommunityName}${Tung}-${Unit}-${NumberPlate}`}</Text>
          </View>
          {IsSigned ? signed : IsProtection ? protection : followUp}
        </View>
        <View style={styles.container_line} />
        <View style={styles.body_content}>
          <View style={styles.body_content_address}>
            <Text style={styles.body_content_address_label}>{`地址: `}</Text>
            <Text
              style={styles.body_content_address_value}
            >{`${DetailedAddress}`}</Text>
          </View>
          {IsCanfollowUp ? (
            <View style={styles.btn}>
              <TouchableOpacity
                style={[styles.guestButton]}
                onPress={() => {
                  this.changePubToPri(KeyID);
                }}
              >
                <Text style={styles.guestButton_text}>转为私客</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}

const mapToProps = (state, ownProps) => {
  return {
    ...ownProps
  };
};

export default connect(mapToProps)(ListItem);

import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";
// import { dateFormat } from "../../../../../../../utils/dateFormat";
import styles from "./style";

class ListItem extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    item: {
      OwnerName: "", //房东姓名
      OwnerTel: "", //房东电话
      DetailedAddress: "", //详细地址
      ExpectedRent: 0, //期望租金
      PrivateGuestTime: "", //私客时间
      KeyID: 0
    }
  };

  static propTypes = {
    item: PropTypes.shape({
      OwnerName: PropTypes.string,
      OwnerTel: PropTypes.string,
      DetailedAddress: PropTypes.string,
      ExpectedRent: PropTypes.number,
      PrivateGuestTime: PropTypes.string,
      KeyID: PropTypes.number
    })
  };

  render() {
    const {
      OwnerName,
      OwnerTel,
      DetailedAddress,
      ExpectedRent,
      PrivateGuestTime,
      KeyID
    } = this.props.item;
    return (
      <TouchableOpacity
        style={styles.outside_box}
        onPress={() => {
          this.props.navigation.navigate("AgentPrivateGuestDetail", {
            KeyID: this.props.item.KeyID,
            listKey: "AgentPrivateGuestList"
          });
        }}
      >
        <View style={styles.top_conatiner}>
          <View style={styles.top_title}>
            <Text style={styles.top_title_text}>{OwnerName}</Text>
            <Text style={[styles.top_title_text, styles.top_title_number]}>
              {OwnerTel}
            </Text>
          </View>
          <Text style={styles.body_content_address_value}>
            {PrivateGuestTime && PrivateGuestTime.slice(0, 10)}
          </Text>
        </View>
        <View style={styles.container_line} />
        <View style={styles.body_content}>
          <View style={styles.body_content_address}>
            <Text style={styles.body_content_address_label}>{`地址: `}</Text>
            <Text
              style={styles.body_content_address_value}
            >{`${DetailedAddress}`}</Text>
          </View>
          <View style={styles.body_content_address}>
            <Text
              style={styles.body_content_address_label}
            >{`期望资金: `}</Text>
            <Text
              style={styles.body_content_address_value}
            >{`${ExpectedRent}元/月`}</Text>
          </View>
          <View style={styles.btn}>
            <TouchableOpacity
              style={[styles.goSign_btn]}
              onPress={() => {
                this.props.navigation.navigate("AgentEditOwnerContract", {
                  EntranceID: KeyID
                });
              }}
            >
              <Text style={styles.goSign_text}>签约</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(ListItem);

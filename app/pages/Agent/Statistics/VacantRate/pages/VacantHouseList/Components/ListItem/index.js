import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styles from "./style";
import { withNavigation } from "react-navigation";

class ListItem extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    item: {
      HouseName: "", //房源名称
      ContractNumber: "", //合同编号
      VacantDay: 0, //空置天数
      RentType: 0, //出租方式
      Money: 0, //出租金额
      tub: [
        { Tel: 0, UserName: "" } //管房人姓名 + 电话
      ]
    }
  };

  static propTypes = {
    item: PropTypes.shape({
      HouseName: PropTypes.string,
      ContractNumber: PropTypes.string,
      VacantDay: PropTypes.number,
      RentType: PropTypes.number,
      Money: PropTypes.number,
      tub: PropTypes.array,
      HouseID: PropTypes.number,
      HouseKey: PropTypes.string,
    })
  };

  render() {
    const {
      HouseName,
      VacantDay,
      ContractNumber,
      Money,
      RentType,
      tub,
      HouseKey,
      HouseID,
    } = this.props.item;
    const EnumRentType = this.props.enumList.EnumRentType;
    const rentType = EnumRentType.find(i => i.Value === RentType).Description;
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          this.props.navigation.navigate("AgentHouseDetail", {
            HouseID,
            HouseKey,
            isMine: true,
          });
        }}
      >
        <View style={styles.container_top}>
          <View style={styles.container_top_info}>
            <View style={styles.container_top_square} />
            <Text style={styles.container_top_title}>{HouseName}</Text>
            <Text style={styles.container_top_title}>{rentType}</Text>
          </View>
          <Text style={[styles.container_top_title, styles.container_top_days]}>
            {`空置${VacantDay}天`}
          </Text>
        </View>
        <View style={styles.container_line} />
        <View style={styles.container_content}>
          <View style={styles.container_content_contract}>
            <Text style={styles.container_content_label}>合同编号: </Text>
            <Text style={styles.container_content_value}>{ContractNumber}</Text>
          </View>
          <View style={styles.container_content_HouseNumber}>
            <View style={styles.container_content_contract}>
              <Text style={styles.container_content_label}>管房人: </Text>
              <Text style={styles.container_content_value}>
                {tub[0].UserName}
              </Text>
              <Text style={styles.container_content_value}>{`  ${
                tub[0].Tel
              }`}</Text>
            </View>
            <Text
              style={styles.container_content_price}
            >{`${Money}元/月`}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const mapToProps = state => ({ enumList: state.enum.enumList });
export default connect(mapToProps)(withNavigation(ListItem));

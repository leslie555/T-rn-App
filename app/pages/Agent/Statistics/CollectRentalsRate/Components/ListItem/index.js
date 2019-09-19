import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";
import styles from "./style";
import { dateFormat } from "../../../../../../utils/dateFormat";

class ListItem extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    item: PropTypes.shape({
      HouseName: PropTypes.string,
      ReceivablesDate: PropTypes.string,
      BillProjectName: PropTypes.string,
      Amount: PropTypes.number,
      TimeStr: PropTypes.string,
      KeyID: PropTypes.number      
    }),
    disabled: PropTypes.bool
  };

  static defaultProps = {
    item: {
      HouseName: "",
      ReceivablesDate: "",
      BillProjectName: "",
      Amount: 0,
      TimeStr: "",
      KeyID: 0
    },
    disabled: false
  };

  render() {
    const {
      HouseName,
      ReceivablesDate,
      BillProjectName,
      Amount
    } = this.props.item;
    return (
      <TouchableOpacity
        style={styles.container}
        disabled={this.props.disabled}
        onPress={() => {
          this.props.navigation.navigate("AgentAggregatePayDetail", {
            id: this.props.item.KeyID,
            type: 2,
          });
        }}
      >
        <View style={styles.container_top}>
          <View style={styles.container_top_left}>
            <View style={styles.container_top_square} />
            <Text style={styles.container_top_title}>应收款日:</Text>
            <Text style={[styles.container_top_title]}>
              {dateFormat(ReceivablesDate)}
            </Text>
          </View>
          {(this.props.item.TimeStr && this.props.item.TimeStr !== "今天")  ?  (
            <View style={styles.container_top_right}>
              <Text style={styles.container_top_right_title}>
                {this.props.item.TimeStr}
              </Text>
            </View>
          ) : null}
        </View>
        <View style={styles.container_line} />
        <View style={styles.container_content}>
          <View style={styles.container_content_house}>
            <Text style={styles.container_content_label}>房源名称: </Text>
            <Text style={styles.container_content_value}>{HouseName}</Text>
          </View>
          <View style={styles.container_content_project}>
            <View style={styles.container_content_house}>
              <Text style={styles.container_content_label}>项目: </Text>
              <Text style={styles.container_content_value}>
                {BillProjectName}
              </Text>
            </View>
            <Text style={styles.container_content_price}>{`${Amount}元`}</Text>
          </View>
        </View>
        <View style={styles.container_bottom} />
      </TouchableOpacity>
    );
  }
}

export default withNavigation(ListItem);

import React, { Component } from "react";
import PropTypes from 'prop-types'
import { View } from "react-native";
import { QueryOwnerHouseInfoList } from "../../../../../../api/resource";
import ListItem from "./ListItem";
import styles from "./style";
import { List } from "../../../../../../components";

export default class PrivateGuestList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        parm: {
          page: 1,
          size: 10
        },
        KeyWord: "",
        PubOrPrivate: 0
      }
    };
  }

  static defaultProps = {
    KeyWord: ""
  }
  
  static propTypes = {
    KeyWord: PropTypes.string.isRequired
  }

  componentDidUpdate(prevProps) {
    if (prevProps.KeyWord !== this.props.KeyWord) {
      const form = Object.assign({}, this.state.form);
      form.parm.page = 1;
      form.KeyWord = this.props.KeyWord;
      this.setState({
        form
      });
    }
  }  
  
  render() {
    const renderItem = ({ item }) => {
      return (
        <ListItem
          item={item}
          navigation={this.props.navigation}
          listKey={"AgentPrivateGuestList"}
        />
      );
    };
    return (
      <View style={styles.container}>
        <List
          request={QueryOwnerHouseInfoList}
          form={this.state.form}
          setForm={form => this.setState({ form })}
          listKey={"AgentPrivateGuestList"}
          renderItem={renderItem}
        />
      </View>
    );
  }
}

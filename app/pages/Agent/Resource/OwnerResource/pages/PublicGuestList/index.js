import React, { Component } from "react";
import { View } from "react-native";
import PropTypes from 'prop-types'
import { QueryOwnerHouseInfoList } from "../../../../../../api/resource";
import ListItem from "./ListItem";
import styles from "./style";
import { List, FullModal } from "../../../../../../components";

export default class PublicGuestList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        parm: {
          page: 1,
          size: 10
        },
        KeyWord: this.props.KeyWord,
        PubOrPrivate: 1
      },
      loading: false
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

  //转为私客确认后回调
  changeLoading = func => {
    this.setState(
      {
        loading: !this.state.loading
      },
      () => func && func()
    );
  };
  
  renderItem = ({ item }) => {
    return <ListItem item={item} />;
  };

  render() {
    const renderItem = ({ item }) => {
      return (
        <ListItem
          item={item}
          navigation={this.props.navigation}
          changeLoading={this.changeLoading}
          listKey={"AgentPublicGuestList"}
          changePage={(i) => {this.props.changePage(i)}}
        />
      );
    };
    return (
      <View style={styles.container}>
        <FullModal visible={this.state.loading}></FullModal>
        <List
          request={QueryOwnerHouseInfoList}
          form={this.state.form}
          setForm={form => {
            this.setState({ form });
          }}
          listKey={"AgentPublicGuestList"}
          renderItem={renderItem}
        />
      </View>
    );
  }
}

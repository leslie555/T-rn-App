import React, { Component } from "react";
import { withNavigation } from "react-navigation";
import { GetAppShowVacantHouse } from "../../../../../../api/report";
import { View } from "react-native";
import { List, Header, ListSelector } from "../../../../../../components";
import ListItem from "./Components/ListItem";
import styles from "./style";

class VacantHouseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        parm: {
          page: 1,
          size: 10
        },
        RentType: 0,
        VacantNumber: "",
        Isrealtime: this.props.navigation.getParam("Isrealtime", 1)
      },
      listConfig: [
        {
          type: "title",
          title: "出租方式",
          data: [
            {
              title: "全部",
              value: 0
            },
            {
              title: "整租",
              value: 1
            },
            {
              title: "合租",
              value: 2
            }
          ]
        },
        {
          type: "title",
          title: "空置天数",
          data: [
            {
              title: "全部",
              value: ""
            },
            {
              title: "0-7天",
              value: 1
            },
            {
              title: "8-15天",
              value: 2
            },
            {
              title: "16-20天",
              value: 3
            },
            {
              title: "21-30天",
              value: 4
            },
            {
              title: "31-50天",
              value: 5
            },
            {
              title: "50天以上",
              value: 6
            }
          ]
        }
      ]
    };
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      payload => {
        if (payload.state.params && payload.state.params.RentType) {
          this.state.form.RentType = payload.state.params.RentType;
          this.setState({
            form: this.state.form
          });
        }
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  onSelectMenu = (index, subindex, data) => {
    const form = { ...this.state.form };
    form.parm.page = 1;
    switch (index) {
      case 0:
        form.RentType = data.value;
        this.setState({ form });
        break;
      case 1:
        form.VacantNumber = data.title === "全部" ? "" : data.title;
        this.setState({ form });
        break;
      default:
        break;
    }
  };

  renderContent = () => {
    const renderItem = ({ item }) => {
      return <ListItem item={item} />
    }
    return (
      <List
        request={GetAppShowVacantHouse}
        form={this.state.form}
        setForm={form => this.setState({ form })}
        listKey={"AgentVacantHouseList"}
        renderItem={renderItem}
        primaryKey={"HouseID"}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Header title="空置房源" />
        <ListSelector
          config={this.state.listConfig}
          onSelectMenu={this.onSelectMenu}
          renderContent={this.renderContent}
        />
      </View>
    );
  }
}

export default withNavigation(VacantHouseList);

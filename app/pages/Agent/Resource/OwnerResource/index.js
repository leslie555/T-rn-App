import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import ScrollableTabView, {
  ScrollableTabBar
} from "react-native-scrollable-tab-view";
import { Header } from "../../../../components";
import IconFont from "../../../../utils/IconFont";
import PrivateGuestList from "./pages/PrivateGuestList";
import PublicGuestList from "./pages/PublicGuestList";
import { CommonColor } from "../../../../styles/commonStyles";
import SearchBar from "../../../../components/SearchBar";
import styles from "./style";

export default class OwnerResource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      pubText: "", //公客关键词
      priText: "", //私客关键词
      isShowPubSearch: false,
      isShowPriSearch: false,
    };
  }

  _onChangeText = text => {
    if (this.state.page === 0) {
      const pubText = text;
      this.setState({ pubText });
    } else if (this.state.page === 1) {
      const priText = text;
      this.setState({ priText });
    }
  };

  _onCancel = text => {
    if (this.state.page === 0) {
      if (!text) {
        this.setState({
          isShowPubSearch: false
        });
      } else {
        const pubText = "";
        this.setState({
          isShowPubSearch: false,
          pubText
        });
      }
    } else if (this.state.page === 1) {
      if (!text) {
        this.setState({
          isShowPriSearch: false
        });
      } else {
        const priText = "";
        this.setState({
          isShowPriSearch: false,
          priText
        });
      }
    }
  };

  _onClear = () => {
    if (this.state.page === 0) {
      const pubText = "";
      this.setState({
        pubText
      });
    } else if (this.state.page === 1) {
      const priText = "";
      this.setState({
        priText
      });
    }
  };

  _onChangeTab(obj) {
    this.setState({
      page: obj.i
    });
  }


  changePage(i) {
    this.setState({
      page: i
    });
  }

  render() {
    const search = (
      <SearchBar
        onChangeText={this._onChangeText}
        onCancel={this._onCancel}
        onClear={this._onClear}
        placeholder={"房源名称/房东姓名/房东电话"}
      />
    )
    const HeaderPublic = (
      <Header
        title="房东房源备案"
        headerRight={
          <TouchableOpacity
            onPress={() => this.setState({ isShowPubSearch: true })}
          >
            <IconFont name="search" size={20} color="white" />
          </TouchableOpacity>
        }
      >
        {this.state.isShowPubSearch ? search : null}
      </Header>
    );
    const HeaderPrivate = (
      <Header
        title="房东房源备案"
        headerRight={
          <View style={styles.searchAdd}>
            <TouchableOpacity
              onPress={() => this.setState({ isShowPriSearch: true })}
            >
              <IconFont name="search" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("AgentEditOwnerResource");
              }}
            >
              <Text style={styles.add}>新增</Text>
            </TouchableOpacity>
          </View>
        }
      >
        {this.state.isShowPriSearch ? search : null}
      </Header>
    );
    return (
      <View style={{ flex: 1 }}>
        {this.state.page === 0 ? HeaderPublic : HeaderPrivate}
          <ScrollableTabView
            tabBarTextStyle={{
              fontSize: 16
            }}
            initialPage={0}
            page={this.state.page}
            tabBarActiveTextColor={CommonColor.color_primary}
            tabBarUnderlineStyle={{
              width: 60,
              height: 3,
              backgroundColor: CommonColor.color_primary,
              marginLeft: 8
            }}
            renderTabBar={() => (
              <ScrollableTabBar style={{ borderBottomWidth: 0 }} />
            )}
            onChangeTab={obj => this._onChangeTab(obj)}
            ref={Scroll => {
              this.ScrollTab = Scroll;
            }}
          >
            <PublicGuestList
              KeyWord={this.state.pubText}
              tabLabel="公客"
              ref={PublicGuest => {
                this.PublicGuest = PublicGuest;
              }}
              navigation={this.props.navigation}
              changePage={i => {
                this.changePage(i);
              }}
            />
            <PrivateGuestList
              KeyWord={this.state.priText}
              tabLabel="私客"
              ref={PrivateGuest => {
                this.PrivateGuest = PrivateGuest;
              }}
              navigation={this.props.navigation}
            />
          </ScrollableTabView>
      </View>
    );
  }
}

import {DisplayStyle, _1PX, DEVICE_WIDTH, FANAL_HEIGHT, StatusBarHeight, CommonColor} from '../../../../styles/commonStyles'
import {StyleSheet,Platform} from "react-native";
export default StyleSheet.create({
  defaultHeader: {
    height: FANAL_HEIGHT,
    width: DEVICE_WIDTH,
    paddingTop: StatusBarHeight,
    backgroundColor: CommonColor.color_primary,
    ...DisplayStyle('row', 'center', 'space-around')
  },
  defaultHeaderTitle: {
    fontSize: Platform.OS === 'ios' ? 17 : 18,
    fontWeight: Platform.OS === 'ios' ? '600' : '400',
    color: `#fff`,
    marginHorizontal: 16
  },
  defaultHeaderLeft: {
    position: 'absolute',
    top: StatusBarHeight,
    bottom: 0,
    left: 15,
    width: 40,
    ...DisplayStyle('row', 'center', 'space-between')
  },
  defaultHeaderRight: {
    position: 'absolute',
    top: StatusBarHeight,
    bottom: 0,
    right: 15,
    ...DisplayStyle('row', 'center', 'space-between')
  },
  // 筛选栏
  select_box: {
    height: 50,
    backgroundColor: CommonColor.color_white,
    // paddingLeft: 15,
    paddingRight: 15,
    // ...DisplayStyle('row', 'center', 'space-around')
  },
  select_position:{
    ...DisplayStyle('row', 'center', 'space-around')
  },
  select_text: {
      fontSize: 16,
      paddingLeft: 15,
      paddingRight: 5,
      marginRight: 5,
      // paddingTop: 10,
      color: CommonColor.color_text_primary
  },
  select_label_box: {
      ...DisplayStyle('row', 'center', 'flex-start'),
  },
  select_btn: {
      height: 50,
      width: 100,
      alignItems: 'center',
      justifyContent: 'center'
  },
  selected_text: {
      fontSize: 16,
      color: CommonColor.color_primary
  },
  // FlatList 列表样式
  scroller: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
    paddingBottom: 6,
    zIndex: 999
  }
})

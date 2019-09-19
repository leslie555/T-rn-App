import {DisplayStyle, _1PX, DEVICE_WIDTH, FANAL_HEIGHT, StatusBarHeight, CommonColor} from '../../styles/commonStyles'
import {StyleSheet,Platform} from "react-native";
export default StyleSheet.create({
  defaultHeader: {
    height: FANAL_HEIGHT,
    width: DEVICE_WIDTH,
    zIndex: 100,
    paddingTop: StatusBarHeight,
    backgroundColor: CommonColor.color_primary,
    ...DisplayStyle('row', 'center', 'space-around')
  },
  defaultHeaderTitle: {
    position: 'relative',
    zIndex: 10,
    fontSize: Platform.OS === 'ios' ? 17 : 18,
    fontWeight: Platform.OS === 'ios' ? '600' : '400',
    color: `#fff`,
    marginHorizontal: 16
  },
  defaultHeaderLeft: {
    position: 'absolute',
    zIndex: 11,
    top: StatusBarHeight,
    bottom: 0,
    left: 15,
    width: 40,
    ...DisplayStyle('row', 'center', 'space-between')
  },
  defaultHeaderRight: {
    position: 'absolute',
    zIndex: 9,
    top: StatusBarHeight,
    bottom: 0,
    right: 15,
    ...DisplayStyle('row', 'center', 'space-between')
  }
})

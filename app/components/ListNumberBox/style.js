import {StyleSheet} from "react-native";
import {_1PX, DEVICE_WIDTH, DisplayStyle} from "../../styles/commonStyles";

export default StyleSheet.create({
  middleContent: {
    position: 'relative',
    zIndex: -1,
    backgroundColor: "#fff",
    ...DisplayStyle('row', 'flex-start', 'flex-start'),
    flexWrap: 'wrap',
  },
  middleContentItem: {
    ...DisplayStyle('row', 'center', 'flex-start'),
    width: DEVICE_WIDTH / 2,
    paddingHorizontal: 10,
    height: 40,
    borderBottomWidth: _1PX,
    borderBottomColor: '#eee'
  },
  middleContentItemInner: {
    paddingHorizontal: 10,
    height: 40,
    ...DisplayStyle('row', 'center', 'flex-start'),
  },
  middleContentItemLeft: {
    fontSize: 14,
    color: '#666'
  },
  middleContentItemRight: {
    fontSize: 14,
    color: '#ff9900',
    marginLeft: 8
  }
})

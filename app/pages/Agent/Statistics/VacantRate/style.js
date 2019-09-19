import { StyleSheet } from "react-native";
import {
  CommonColor,
  DisplayStyle,
  DEVICE_WIDTH
} from "../../../../styles/commonStyles";

export default StyleSheet.create({
  // 空置top样式
  top: {
    flexDirection: 'column'
  },
  top_vacant: {
    ...DisplayStyle("row", "center", "space-around"),
    padding: 15,
  },
  top_vacant_rate: {
    ...DisplayStyle("column", "center", "center")
  },
  top_data_text: {
    fontSize: 15,
    color: CommonColor.color_primary
  },
  top_title_text: {
    fontSize: 15,
    color: "#999999"
  },
  line: {
    height: 1,
    backgroundColor: '#eeeeee',
    marginHorizontal: 15
  },
  rect: {
    height: 10,
    width: DEVICE_WIDTH,
    backgroundColor: "#eeeeee"
  },
  count_con: {
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  count_con_text: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#666666'    
  },
  count_con_num: {
    color: CommonColor.color_primary
  }
});

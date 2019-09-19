import { StyleSheet } from "react-native"
import {
  DisplayStyle,
  // DEVICE_WIDTH,
  CommonColor,
  Container,
} from "../../../../styles/commonStyles"

export default StyleSheet.create({
  container: Container,
  searchAdd: {
    ...DisplayStyle("row", "center", "space-between"),
  },
  add: {
    fontSize: 16,
    color: CommonColor.color_white,
    marginLeft: 20,
  },
})

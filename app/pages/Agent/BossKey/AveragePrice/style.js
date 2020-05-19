import { StyleSheet } from "react-native";
import {
  DisplayStyle,
  DEVICE_WIDTH,
  Container,
  CommonColor
} from "../../../../styles/commonStyles";
const style = StyleSheet.create({
  main: {
    // paddingBottom: 70,
    flex: 1
  },
  container: {
    // marginBottom: 112,
  },
  header_title: {
    height: 40,
    paddingLeft: 15,
    ...DisplayStyle("row", "center", "flex-start"),
    backgroundColor: "#eeeeee"
  },
  title_color: {
    // color: "#666"
  },
  title_list: {
    ...DisplayStyle("row", "center", "space-around"),
    padding: 10,
    backgroundColor: "#ffffff"
  },
  title: {
    height: 60,
    ...DisplayStyle("column", "center", "center")
  },
  num_color: {
    color: "#389ef2",
    marginBottom: 5,
    fontSize: 18
  },
  rect: {
    height: 10,
    width: DEVICE_WIDTH,
    backgroundColor: "#eeeeee"
  },
  content: {
    paddingBottom: 100
  }
});

export default style;

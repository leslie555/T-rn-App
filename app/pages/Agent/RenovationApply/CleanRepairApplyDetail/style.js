import { StyleSheet } from "react-native"
import {
  DisplayStyle,
  CommonColor,
  _1PX,
  Container,
} from "../../../../styles/commonStyles"

const styles = StyleSheet.create({
  container: {
    ...Container,
  },
  body: {
    paddingHorizontal: 15,
  },
  inlineBox: {
    height: 10,
    backgroundColor: "#eeeeee",
  },
  owner_baseInfo: {
    ...DisplayStyle("row", "center", "flex-end"),
    marginRight: -10,
  },
  owner_baseInfo_name: {
    color: "#999",
    marginRight: 10,
  },
  owner_baseInfo_tel: {
    color: "#389ef2",
  },
  form: {
    backgroundColor: "#fff",
    color: "#999",
    fontSize: 15,
    height: 80,
    flex: 1,
    paddingTop: 0,
    paddingRight: 30,
    textAlignVertical: "top",
    textAlign: "right",
  },
  edit_project_btn: {
    position: "absolute",
    top: 10,
    left: 70,
    width: 70,
    borderWidth: 1,
    height: 22,
    borderColor: CommonColor.color_primary,
    textAlign: "center",
  },
  edit_project_text: {
    textAlign: "center",
    color: CommonColor.color_primary,
  },
  page_bottom: {
    height: 80,
    backgroundColor: "#fff",
  },
  page_bottom_btn: {
    flex: 1,
    ...DisplayStyle("row", "center", "center"),
    backgroundColor: "#389ef2",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#389ef2",
  },
  page_btn_text: {
    color: "#fff",
    fontSize: 20,
  },
})

export default styles

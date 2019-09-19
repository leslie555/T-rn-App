import { StyleSheet } from "react-native"
import {
  DisplayStyle,
  CommonColor,
  DEVICE_WIDTH,
  _1PX,
} from "../../../../../styles/commonStyles"

export default StyleSheet.create({
  renovation: {
    ...DisplayStyle("row", "center", "flex-start"),
    padding: 15,
    backgroundColor: CommonColor.color_white,
    marginTop: 10
  },
  renovation_square: {
    width: 3,
    height: 15,
    backgroundColor: CommonColor.color_primary,
  },
  renovation_text: {
    fontSize: 15,
    color: "#363636",
    marginLeft: 10,
  },
  detail_container: {
    ...DisplayStyle("column", "flex-start", "flex-start"),
    paddingLeft: 25,
    paddingRight: 10,
    marginBottom: 0,
    backgroundColor: CommonColor.color_white,
  },
  detail_container_body: {
    ...DisplayStyle("column", "flex-start", "flex-start"),
    paddingLeft: 25,
    paddingRight: 10,
    marginBottom: 0,
  },
  detail_container_top: {
    ...DisplayStyle("row", "center", "flex-start"),
  },
  detail_container_top_outCircle: {
    width: 20,
    height: 20,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: CommonColor.color_primary,
    borderStyle: "dashed",
    ...DisplayStyle("row", "center", "center"),
  },
  detail_container_top_inCircle: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: CommonColor.color_primary,
  },
  detail_container_top_status: {
    marginLeft: 15,
    fontSize: 16,
    color: "#999999",
  },
  detail_container_body_dashedLine: {
    position: "absolute",
    top: 1,
    left: 0,
    bottom: -1,
    width: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: CommonColor.color_primary,
    borderTopLeftRadius: _1PX,
    marginLeft: 10,
    zIndex: -1,
  },
  detail_container_body_dashedLine_cover: {
    position: "absolute",
    top: 1,
    left: 0,
    bottom: -1,
    width: 20,
    borderWidth: 1,
    borderStyle: "solid",
    backgroundColor: CommonColor.color_white,
    borderColor: CommonColor.color_white,
    borderTopLeftRadius: _1PX,
    marginLeft: 15,
    zIndex: 999,
  },
  detail_container_body_content: {
    paddingLeft: 20,
    width: DEVICE_WIDTH - 78,
    marginTop: 5,
    marginBottom: 15,
    ...DisplayStyle("column", "flex-start", "flex-start"),
  },
  detail_container_body_content_time: {
    fontSize: 16,
    color: "#363636",
  },
})

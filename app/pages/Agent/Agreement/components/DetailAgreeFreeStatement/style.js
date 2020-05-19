import {_1PX, CommonColor, DEVICE_WIDTH, DisplayStyle} from '../../../../../styles/commonStyles'
import {StyleSheet} from "react-native";

export default StyleSheet.create({
    container: {
        width: DEVICE_WIDTH,
        flex: 1
    },
    // header_right_text: {
    //   fontSize: 14,
    //   color: "blue",
    // },
    header_right_text: {
      fontSize: 14,
      color: "#fff",
      marginLeft: 10
    },
    footer_btn: {
      position: 'absolute',
      bottom: 0,
      left: 0
    }
})

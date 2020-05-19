import {_1PX, CommonColor, DEVICE_WIDTH, DisplayStyle} from '../../../../styles/commonStyles'
import {StyleSheet} from "react-native";

export default StyleSheet.create({
    resource_container: {
        width: DEVICE_WIDTH,
        flex: 1
    },
    top_title: {
      marginVertical: 15
    },
    top_content: {
        ...DisplayStyle('row','center','center')
    },
    top_content_receiveMoney: {
        fontSize: 18,
        color: '#666',
    },
    top_content_paidMoney: {
        fontSize: 14,
        color: '#999'
    },
    container111: {
        zIndex: 9999
    }
})

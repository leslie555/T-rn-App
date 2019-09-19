import {_1PX, DEVICE_WIDTH, DisplayStyle} from '../../../../styles/commonStyles'
import {StyleSheet} from "react-native";

export default StyleSheet.create({
    keep_container: {
        width: DEVICE_WIDTH,
        flex: 1,
        backgroundColor: '#f6f6f6'
    },
    header_right_text: {
        fontSize: 14,
        color: "#fff"
    },
    keep_content: {
        flex: 1,
        backgroundColor: '#f6f6f6'
    },
    bottom_box: {
        ...DisplayStyle('row', 'center', 'space-between'),
        height: 70,
        paddingHorizontal: 20,
        borderColor: '#eee',
        borderTopWidth: _1PX,
        backgroundColor: '#fff'
    },
    bottom_left: {
        ...DisplayStyle('row', 'center', 'flex-start'),
        flex: 1
    },
    bottom_left_text1: {
        fontSize: 16,
        color: '#333',
        marginRight: 10
    },
    bottom_left_text2: {
        fontSize: 14,
        color: '#389ef2'
    },
    bottom_btn1: {
        ...DisplayStyle('row', 'center', 'center'),
        height: 50,
        width: 120,
        borderColor: '#389ef2',
        borderWidth: _1PX,
        marginRight: 20,
        borderRadius: 8
    },
    bottom_btn_text1: {
        fontSize: 14,
        color: '#389ef2'
    },
    bottom_btn2: {
        ...DisplayStyle('row', 'center', 'center'),
        flex: 1,
        height: 50,
        backgroundColor: '#389ef2',
        borderRadius: 8
    },
    bottom_btn_text2: {
        fontSize: 14,
        color: '#fff'
    },
    data_item_box: {
        ...DisplayStyle('row', 'center', 'space-between'),
        height: 40,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderColor: '#eee',
        borderBottomWidth: _1PX * 2,
    },
    data_item_check: {
        marginRight: 15
    },
    data_item_text: {
        ...DisplayStyle('row', 'center', 'flex-start'),
        flex: 7,
        fontSize: 14,
        color: '#333'
    },
    data_item_type: {
        width: 30,
        fontSize: 14,
        color: '#999',
        textAlign: 'right',
    },
    data_item_input: {
        flex: 5,
        fontSize: 14,
        color: '#999',
        textAlign: 'right',
    },
    data_item_date: {
        width: 100,
        fontSize: 14,
        color: '#999',
        textAlign: 'right',
    }
})

import { StyleSheet } from 'react-native';
import { CommonColor, DisplayStyle } from '../../../../styles/commonStyles';


const style = StyleSheet.create({
    scroller: {
        paddingBottom: 20,
    },
    msg_item: {
        backgroundColor: CommonColor.color_white,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        borderBottomWidth: 1,
        borderColor: 'rgba(230, 230, 230, 0.5)',
        borderStyle: 'solid',
    },
    msg_item_top: {
        paddingBottom: 15,
        ...DisplayStyle('row', 'center', 'space-between')
    },
    msg_item_title: {

    },
    msg_item_title_text: {
        fontSize: 14,
        color: CommonColor.color_text_regular,
    },
    msg_item_title_text_read: {
        fontSize: 14,
        color: '#999999'
    },
    msg_item_time: {
        ...DisplayStyle('row', 'center', 'flex-start')
    },
    msg_item_time_text: {
        color: '#999999',
        marginRight: 10,
        fontSize: 12
    },
    msg_item_bottom: {
        ...DisplayStyle('row', 'center', 'flex-end')
    },
    msg_item_seeDetail: {
        color: CommonColor.color_primary,
        marginRight: 5,
        fontSize: 16
    },
})

export default style

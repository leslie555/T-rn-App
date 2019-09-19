import { StyleSheet } from 'react-native';
import { CommonColor, DisplayStyle } from '../../../../styles/commonStyles';


const style = StyleSheet.create({
    scroller: {
        paddingTop: 12,
        paddingBottom: 12
    },
    msg_item: {
        backgroundColor: CommonColor.color_white,
        padding: 15,
        marginBottom: 10
    },
    msg_item_top: {
        marginBottom: 6,
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
    msg_item_dot: {
        width: 8,
        height: 8,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 0, 0, 0.7)'
    },
    msg_item_time_text: {
        color: '#999999',
        marginLeft: 10
    },
    msg_item_bottom: {
        ...DisplayStyle('row', 'center', 'flex-end')
    },
    msg_item_seeDetail: {
        color: CommonColor.color_primary,
        marginRight: 5,
        fontSize: 12
    },
})

export default style

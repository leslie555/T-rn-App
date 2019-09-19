import { StyleSheet } from 'react-native';
import { CommonColor, DisplayStyle } from '../../../../styles/commonStyles';

const style = StyleSheet.create({
    bill_content: {
      flex: 1,
      marginBottom: 50
    },
    bill_main: {
        backgroundColor: '#fff',
    },
    bill_money: {
        marginVertical: 15,
        ...DisplayStyle('column', 'center', 'center')
    },
    bill_title_container: {
        marginBottom: 10,
        ...DisplayStyle('column','center','center')
    },
    bill_money_text: {
        fontSize: 20,
        color: '#666'
    },
    bill_paid_money_text: {
        fontSize: 12,
        color: '#999'
    },
    bill_title_passDate: {
        fontSize: 14,
        color: '#ff5a5a'
    },
    bill_title_receivePart: {
        fontSize: 14,
        color: '#ff8b58'
    },
    bill_title_received: {
        fontSize: 14,
        color: '#999999'
    },
    bill_title_unReceive: {
        fontSize: 14,
        color: '#ffb658'
    },
    bill_info_list: {

    },
    bill_info_item: {
        marginVertical: 15,
        marginHorizontal: 15,
        ...DisplayStyle('row', 'center', 'space-between')
    },
    line: {
        backgroundColor: '#eee',
        height: 1,
        marginHorizontal: 15
    },
    divide_part: {
        backgroundColor: '#eee',
        height: 30
    },
    item_title_text: {
        color:'#363636',
        fontSize: 15
    },
    item_info_text: {
        fontSize: 15,
        marginLeft: 60
    },
    bottom_button_container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 25,
        height: 80,
        backgroundColor: '#fff',
        ...DisplayStyle('row', 'center', 'space-between')
    },
    page_bottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        ...DisplayStyle('row','center','center'),
        backgroundColor: '#389ef2',
        height: 50,
    },
    pay_btn: {
        color: '#ffffff',
        fontSize: 16
    },
    img_item_container: {

    },
    title_container: {
        paddingHorizontal: 15,
        paddingVertical: 15
    },
    title_text: {
        color: '#999',
        fontSize: 14
    },
    info_bottom_container: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: '#fff',
        ...DisplayStyle('row','center','flex-start')
    },
    img_item: {
        marginRight: 20,
        height:120,
        width: 120,
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: '#eee',
        // overflow: 'hidden',
        // ...DisplayStyle('row','center','center')
    },
    img_item_info: {
        maxHeight: 120,
        maxWidth: 120,
    },
    no_img_text: {
        color: '#999',
        fontSize: 15
    },
    mul_text: {
        color: '#999',
        fontSize: 15
    },
})
export default style

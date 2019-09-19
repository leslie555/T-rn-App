import {StyleSheet} from 'react-native';
import {CommonColor, DisplayStyle} from '../../../../styles/commonStyles';

const style = StyleSheet.create({
    scroller: {
        paddingTop: 6,
        paddingBottom: 60,
        zIndex: 999
    },

    // 筛选栏
    select_box: {
        height: 50,
        backgroundColor: CommonColor.color_white,
        paddingLeft: 15,
        paddingRight: 15,
        ...DisplayStyle('row', 'center', 'space-between')
    },
    select_text: {
        fontSize: 16,
        paddingLeft: 5,
        paddingRight: 5,
        marginRight: 5,
        color: CommonColor.color_text_primary
    },
    select_label_box: {
        ...DisplayStyle('row', 'center', 'flex-start'),
    },
    select_btn: {
        height: 50,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    selected_text: {
        fontSize: 16,
        color: CommonColor.color_primary
    },
    content_box: {
        flex: 1,
        ...DisplayStyle('row', 'stretch', 'flex-start'),
        backgroundColor: '#ffffff',
        marginTop: 6,
        paddingLeft: 6,
        paddingRight: 15
    },
    check_box: {
        width: 50,
        ...DisplayStyle('row', 'center', 'center'),
    },
    bill_content: {
        flex: 1,
    },
    bill_title: {
        ...DisplayStyle('row', 'center', 'space-between'),
        marginVertical: 6
    },
    bill_title_left: {
        fontSize: 14,
        color: '#363636',
        fontWeight: '500'
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
    line: {
        backgroundColor: '#eee',
        height: 1,
    },
    bill_info_container: {
        marginVertical: 6
    },
    bill_house_title_container: {
        marginBottom: 6,
        ...DisplayStyle('row', 'center', 'flex-start')
    },
    bill_house_title: {
        fontSize: 12,
        color: '#363636'
    },
    bill_house_name: {
        fontSize: 12,
        color: '#999'
    },
    bill_number_container: {
        ...DisplayStyle('row', 'center', 'space-between'),
    },
    bill_info: {
        ...DisplayStyle('row', 'center', 'flex-start')
    },
    bill_number_title: {
        fontSize: 12,
        color: '#363636'
    },
    bill_number: {
        fontSize: 12,
        color: '#999'
    },
    bill_money: {
        fontSize: 14,
        color: '#363636',
        fontWeight: 'bold'
    },
    page_bottom: {
        ...DisplayStyle('row', 'stretch', 'space-between'),
        borderColor: '#eee',
        borderStyle: 'solid',
        borderTopWidth: 0.5,
        backgroundColor: '#ffffff',
        height: 50,
    },
    total_text: {
        ...DisplayStyle('row','center','flex-start')
    },
    total_title: {
        marginLeft: 20,
        fontSize: 14,
        color: '#999999'
    },
    total_amount: {
        marginLeft: 5,
        color:'#389ef2',
        fontSize: 14
    },
    pay_btn: {
        width: 135,
        backgroundColor: '#389ef2',
        ...DisplayStyle('row','center','center')
    },
    pay_btn_text: {
        color: '#ffffff',
        fontSize: 16
    }
})
export default style

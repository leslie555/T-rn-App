import {Platform, StyleSheet} from 'react-native';
import {CommonColor, DisplayStyle} from '../../../../styles/commonStyles';

const btn_height = 40;
const btn_weight = 120;

const style = StyleSheet.create({

    scroller: {
        marginBottom: 10,
        zIndex: 999,
        backgroundColor: '#eee'
    },
    top_right: {
        ...DisplayStyle('row','center','center')
    },
    add_btn: {
      marginLeft: 20
    },
    add_text: {
      color:'#ffffff',
      fontSize: 16
    },
    // 列表项
    outside_box: {
        flex: 1,
        paddingLeft: 12,
        marginTop: 10,
        marginHorizontal: 15,
        backgroundColor: CommonColor.color_primary,
        borderRadius: 10,
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowColor: '#cccccc',
        // 安卓阴影
        // elevation: 4
    },
    inside_box: {
        flex: 1,
        backgroundColor: CommonColor.color_white,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5,
    },
    item_title: {
        ...DisplayStyle('row','center','space-between'),
        paddingVertical: 6,
        fontWeight: 'bold'
    },
    item_title_date: {
        fontSize: 14,
        color:'#363636'
    },
    item_title_status: {
        fontSize: 14,
        color:'#feaf38'
    },
    item_title_status2: {
        fontSize: 14,
        color:'#ddd'
    },
    line: {
        backgroundColor: '#eee',
        height: 1,
    },
    bill_detail: {
        paddingVertical: 6,
        ...DisplayStyle('row','center','flex-start')
    },
    bill_detail_title: {
        color:'#363636',
        fontSize: 12
    },
    bill_detail_info: {
        color:'#999',
        fontSize: 12
    },
    item_info: {
        ...DisplayStyle('row','center','space-between'),
        paddingBottom: 6
    },
    contract_number: {
        ...DisplayStyle('row','center','flex-start')
    },
    contract_number_title: {
        color:'#363636',
        fontSize: 12
    },
    contract_number_info: {
        color:'#999',
        fontSize: 12
    },
    price_info: {
        fontSize: 12,
        color:'#feaf38'
    },
    search_icon: {
        marginRight: 20
    },
})

export default style

import { StyleSheet } from 'react-native';
import { CommonColor, DisplayStyle } from '../../../../styles/commonStyles';

const style = StyleSheet.create({
    scroller: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 6,
        paddingBottom: 6,
        zIndex: 999,
        backgroundColor: '#eee'
    },
    tabbar_underline: {
        backgroundColor: CommonColor.color_primary,
        width: 60,
        height: 3,
        marginLeft: 31
    },
    tabbar_inactivestyle: {
        color:'#389ef2',
    },
    tabbar_textstyle: {
        fontSize: 15
    },
    tabbar_style: {
        backgroundColor: '#fff',
        // height: 40
    },
    tabbar_content: {
        flex: 1,
        backgroundColor: '#eee'
    },
    // 列表项
    outside_box: {
        flex: 1,
        marginTop: 10,
        marginHorizontal: 15,
        borderRadius: 10,
        // 安卓阴影
        // elevation: 4
    },
    inside_box: {
        flex: 1,
        backgroundColor: CommonColor.color_white,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5,
    },

    item_title: {
        marginVertical: 6,
        ...DisplayStyle('row','center','flex-start')
    },
    vertical_line: {
        backgroundColor: '#389ef2',
        width: 4,
        height: 14,
        marginRight: 10
    },
    item_title_text: {
        fontSize:14,
        color: CommonColor.color_text_primary,
        fontWeight: '500'
    },
    line: {
        backgroundColor: '#eee',
        height: 1,
    },
    item_info: {
        marginVertical: 6,
    },
    type_title_container: {
        ...DisplayStyle('row','center','flex-start'),
        marginBottom: 6
    },
    type_title: {
        marginRight: 10,
        fontSize: 12,
        color: '#363636'
    },
    type_content: {
        fontSize: 12,
        color: '#999'
    },
    content_container: {
        ...DisplayStyle('row','center','flex-start')
    },
    content_container_person: {
        marginRight: 25,
        ...DisplayStyle('row','center','flex-start')
    },
    content_container_time: {
        ...DisplayStyle('row','center','flex-start')
    },
    content_title: {
        marginRight: 10,
        color:'#363636',
        fontSize: 12
    },
    content_text: {
        color:'#999',
        fontSize: 12
    },
    opera_btn_container: {
        marginVertical: 6,
        ...DisplayStyle('row','center','flex-end')
    },
    bussiness_type_btn: {
        borderColor: CommonColor.color_primary,
        padding: 5,
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 4,
        width: 70,
        height: 30,
        ...DisplayStyle('row','center','center'),
        marginRight: 10
    },
    audit_btn: {
        borderColor: CommonColor.color_primary,
        padding: 5,
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 4,
        ...DisplayStyle('row','center','center'),
        width: 70,
        height: 30,
        paddingVertical: 3,
        paddingHorizontal: 3
    },
    btn_text: {
        color:'#389ef2',
        fontSize: 12
    },
    headerVersion: {
        ...DisplayStyle('row','center','center')
    },
    headerVersionBtn: {
        color: CommonColor.color_white,
        marginRight: 10
    }
})
export default style

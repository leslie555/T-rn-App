import { StyleSheet } from 'react-native';
import {_1PX, CommonColor, DisplayStyle} from '../../../../styles/commonStyles';
const $gary = 'rgb(153,209,254)'

const style = StyleSheet.create({
    approval_content: {
        backgroundColor: '#ffffff',
        marginHorizontal: 15,
        marginTop: 15,
        // marginVertical: 15,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 5
    },
    content_title: {
        marginBottom: 10,
        color: '#666666',
        fontSize: 15,
        fontWeight: 'bold'
    },
    line: {
        backgroundColor: '#eee',
        height: 1,
    },
    content_applay_name: {
        marginTop: 15,
        ...DisplayStyle('row','center','flex-start')
    },
    content_apply_name_text: {
        marginRight: 10,
        color:'#666666',
        fontSize: 12
    },
    content_apply_date_text: {
        color:'#999999',
        fontSize: 12
    },
    content_apply_info: {
        marginTop: 15,
        color:'#666666',
        fontSize: 12
    },
    scroller: {
        marginHorizontal: 15,
        marginVertical: 15,
        borderRadius: 5,
        backgroundColor: '#ffffff'
    },
    approval_process: {
        paddingLeft: 30,
        paddingTop: 25
    },
    process_item: {
        // borderLeftColor: '#eeeeee',
        // borderLeftWidth: _1PX,
        // borderStyle: 'dashed',
        flex:1,
        ...DisplayStyle('row','flex-start','flex-start'),
        paddingRight: 25
    },
    audit_content_line: {
        flex:1,
        borderLeftWidth: 0.5,
        borderStyle: 'dashed',
        borderColor: '#dddddd',
    },
    audit_content: {
        flex:1,
    },
    process_title: {
        ...DisplayStyle('row','center','space-between'),
        marginBottom: 10
    },
    process_title_left: {
        marginLeft: -8,
        ...DisplayStyle('row','center','flex-start')
    },
    process_title_text_waitaudit: {
        marginLeft: 15,
        fontSize: 14,
        color:'#ffb658'
    },
    process_title_text_passed: {
        marginLeft: 15,
        fontSize: 14,
        color:'#389ef2'
    },
    process_title_text_nopass: {
        marginLeft: 15,
        fontSize: 14,
        color:'#ff5a5a'
    },
    process_auditor: {
        color: '#999999',
        fontSize: 14
    },
    process_audit_date: {
        color: '#999999',
        fontSize: 12,
        marginLeft: 23,
        marginBottom: 25
    },
    process_remark: {
        color: '#666666',
        fontSize: 12,
        marginLeft: 23,
        marginBottom: 35
    },
    out_circle_waitaudit: {
        ...DisplayStyle('row', 'center', 'center'),
        backgroundColor: '#ffffff',
        width: 16,
        height: 16,
        borderRadius: 16,
        borderWidth: _1PX,
        borderStyle: 'dashed',
        borderColor: '#ffb658'
    },
    out_circle_passed: {
        ...DisplayStyle('row', 'center', 'center'),
        backgroundColor: '#ffffff',
        width: 16,
        height: 16,
        borderRadius: 16,
        borderWidth: _1PX,
        borderStyle: 'dashed',
        borderColor: '#389ef2'
    },
    out_circle_nopass: {
        ...DisplayStyle('row', 'center', 'center'),
        backgroundColor: '#ffffff',
        width: 16,
        height: 16,
        borderRadius: 16,
        borderWidth: _1PX,
        borderStyle: 'dashed',
        borderColor: '#ff5a5a',
    },
    inner_circle_waitaudit: {
        width: 8,
        height: 8,
        backgroundColor: '#ffb658',
        borderRadius: 8
    },
    inner_circle_passed: {
        width: 8,
        height: 8,
        backgroundColor: '#389ef2',
        borderRadius: 8
    },
    inner_circle_nopass: {
        width: 8,
        height: 8,
        backgroundColor: '#ff5a5a',
        borderRadius: 8
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
    audit_btn: {
        color: '#ffffff',
        fontSize: 14
    }
})

export default style

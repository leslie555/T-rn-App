import {StyleSheet} from 'react-native';
import {CommonColor, DisplayStyle} from '../../../../styles/commonStyles';

const style = StyleSheet.create({
    excute_audit: {
        flex:1,
        backgroundColor:'#F6F6F6'
    },
    audit_form_container: {
        flex:1,
        // ...DisplayStyle('column','stretch','space-between')
    },
    audit_form: {

    },
    page_bottom: {
        height: 80,
        padding: 15,
        backgroundColor:'#fff'
    },
    page_bottom_btn: {
        flex:1,
        ...DisplayStyle('row','center','center'),
        backgroundColor: '#389ef2',
        borderRadius: 5
    },
    page_btn_text: {
        color:'#fff',
        fontSize: 20
    },
    select_next: {
        flex: 1,
        marginTop: 15,
        ...DisplayStyle('row','center','space-between'),
        backgroundColor: '#ffffff',
        paddingVertical:13,
        paddingHorizontal: 15
    },
    select_next_title: {
      color: '#000',
        fontSize: 15
    },
    select_next_btn: {
        ...DisplayStyle('row','center','flex-start')
    },
    select_next_text: {
        color:'#999999',
        marginRight: 10
    }
})
export default style

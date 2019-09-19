import {_1PX, DEVICE_WIDTH, DisplayStyle} from '../../../../../../styles/commonStyles'
import {StyleSheet} from "react-native";

export default StyleSheet.create({
  bill_container: {
    width: DEVICE_WIDTH,
    flex: 1
  },
  bill_list_content: {
    width: DEVICE_WIDTH,
    marginVertical: 8
  },
  bill_total: {
    ...DisplayStyle('row', 'center', 'space-between'),
    width: DEVICE_WIDTH,
    height: 40,
    paddingHorizontal: 15,
    backgroundColor: '#fff'
  },
  head_text: {
    color: `rgb(102, 102, 102)`,
    fontSize: 14
  },
  bill_notice: {
    fontSize: 10,
    color: `rgb(153, 153, 153)`,
    height: 30,
    lineHeight: 30,
    paddingHorizontal: 15
  },
  add_bill_btn_box: {
    ...DisplayStyle('row', 'center', 'center'),
    borderRadius: 6,
    borderColor: '#389ef2',
    borderWidth: _1PX,
    width: 70,
    height: 28
  },
  add_bill_btn_text: {
    color: '#389ef2',
    fontSize: 12
  },
  bill_item: {
    // ...DisplayStyle('row', 'center', 'center'),
    minHeight: 150,
    width: DEVICE_WIDTH - 30,
    marginBottom: 10,
    marginLeft: 15,
    paddingLeft: 25+10,
    backgroundColor: '#fff',
    borderRadius: 6,
    shadowColor: '#ddd',
    shadowOffset: {
      width: 2,
      height: 2
    },
    shadowRadius: 5,
    position: 'relative'
  },

  bill_num_box: {
    ...DisplayStyle('column', 'center', 'center'),
    width: 25,
    backgroundColor: '#389ef2',
    padding: 5,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    position: 'absolute',
    top:0,
    left:0,
    bottom:0
  },
  bill_num: {
    color: '#fff',
    fontSize: 15
  },

  bill_box: {
    // ...DisplayStyle('column', 'flex-start', 'flex-start'),
    // flex: 1
    // backgroundColor: 'red'
    paddingBottom: 10
  },

  bill_content: {
    ...DisplayStyle('row', 'center', 'space-between'),
    paddingRight: 60,
    height: 32,
    position: 'relative'
  },
  bill_text: {
    flex: 1,
    marginRight: 30,
    fontSize: 15,
    color: 'rgb(102,102,102)'
  },
  bill_text_bold: {
    flex: 1,
    marginRight: 30,
    fontSize: 15,
    fontWeight: '600',
    color: '#666'
  },
  bill_text1: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    color: 'rgb(102,102,102)'
  },
  right_delete_box: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 99
  },
  bill_add_box: {
    ...DisplayStyle('row', 'center', 'flex-start'),
    height: 30,
    marginTop: 5
  },
  bill_add_text: {
    fontSize: 14,
    color: '#999'
  },
  bill_add_btn: {
    ...DisplayStyle('row', 'center', 'center'),
    width: 20,
    height: 20,
    marginLeft: 10
  },
  bill_cascade: {
    ...DisplayStyle('row', 'center', 'space-between'),
    flex: 1,
    marginRight: 20,
    borderRadius: 4,
    borderColor: '#eee',
    borderWidth: 1,
    paddingHorizontal: 5,
    height: 28
  },
  bill_cascade_text: {
    fontSize: 15,
    color: '#999'
  },
  bill_input: {
    flex: 1,
    borderRadius: 4,
    borderColor: '#eee',
    borderWidth: 1,
    height: 28,
    padding: 0,
    textAlign: 'center'
  },
  bill_time: {
    ...DisplayStyle('row', 'center', 'center'),
    flex: 1,
    borderRadius: 4,
    borderColor: '#eee',
    borderWidth: 1,
    height: 28
  },
  bill_time_text: {
    fontSize: 15,
    color: '#999'
  },
  bill_line: {
    height:1,
    backgroundColor: '#eee',
    marginVertical: 5
  },
  bill_del_item_btn:{
    ...DisplayStyle('row', 'center', 'center'),
    position: 'absolute',
    top: 4,
    right: 15,
    width: 32,
    height: 22
  }
})

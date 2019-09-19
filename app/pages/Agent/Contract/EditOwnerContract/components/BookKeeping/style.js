import {_1PX, CommonColor, DEVICE_WIDTH, DisplayStyle} from '../../../../../../styles/commonStyles'
import {StyleSheet} from "react-native";

export default StyleSheet.create({
  book_box: {
    width: DEVICE_WIDTH,
    flex: 1
  },
  book_list: {
    paddingHorizontal: 10
  },
  book_list_item: {
    ...DisplayStyle('row', 'center', 'space-between'),
    height: 40,
    borderRadius: 6,
    marginBottom: 10,
    paddingLeft: 25,
    paddingRight: 10,
    backgroundColor: '#fff',
    position: 'relative'
  },
  book_list_text: {
    color: 'rgb(102, 102, 102)',
    fontSize: 14
  },
  book_list_text1: {
    color: 'rgb(102, 102, 102)',
    fontSize: 14,
    marginRight: 10
  },
  book_list_box: {
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  add_bill_btn_box: {
    ...DisplayStyle('row', 'center', 'center'),
    borderRadius: 6,
    borderColor: '#389ef2',
    borderWidth: _1PX,
    width: 40,
    height: 26,
    marginLeft: 10
  },
  add_bill_btn_box_red: {
    borderColor: '#ff5a5a'
  },
  add_bill_btn_text: {
    color: '#389ef2',
    fontSize: 12
  },
  add_bill_btn_text_red: {
    color: '#ff5a5a'
  },
  book_list_icon: {
    position: 'absolute',
    left: 0,
    top: 0
  }
})

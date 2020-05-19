import {_1PX, CommonColor, DEVICE_WIDTH, DisplayStyle} from '../../../../styles/commonStyles'
import {StyleSheet} from "react-native";

export default StyleSheet.create({
  check_container: {
    width: DEVICE_WIDTH,
    flex: 1
  },
  add_owner_btn_box: {
    ...DisplayStyle('row', 'center', 'center'),
    borderRadius: 6,
    borderColor: '#389ef2',
    borderWidth: _1PX,
    width: 70,
    height: 28
  },
  add_owner_btn_text: {
    color: '#389ef2',
    fontSize: 12
  },
  add_owner_box: {
    marginBottom: 10
  },
  add_owner_title_box: {
    ...DisplayStyle('row', 'center', 'space-between'),
    height: 36,
    paddingLeft: 10,
    paddingRight: 20,
    backgroundColor: '#fff'
  },
  add_owner_title_text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  owner_del_btn: {
    ...DisplayStyle('row', 'center', 'center'),
    width: 20,
    height: 20,
    backgroundColor: '#888',
    borderRadius: 10
  }
})

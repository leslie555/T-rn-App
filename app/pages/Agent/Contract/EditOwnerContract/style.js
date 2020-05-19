import { StyleSheet } from 'react-native'
import {
  _1PX,
  DEVICE_WIDTH,
  DisplayStyle
} from '../../../../styles/commonStyles'

export default StyleSheet.create({
  owner_content: {
    flex: 1
  },
  owner_header_right: {
    ...DisplayStyle('row', 'center', 'center')
  },
  owner_header_right_text: {
    fontSize: 14,
    color: '#fff'
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
  },
  viewPlaceholder: {
    height: 20,
    width: DEVICE_WIDTH
  },
  fast_change_time_box: {
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  fast_change_time_box_item: {
    ...DisplayStyle('row', 'center', 'center'),
    width: 60,
    height: 24,
    backgroundColor: '#389ef2',
    marginLeft: 8,
    borderRadius: 6
  },
  tipCircleContainer: {
    width: 14,
    height: 14,
    position: 'absolute',
    top: 8,
    left: 175,
    borderColor: '#ccc',
    borderWidth: _1PX,
    borderRadius: 7,
    ...DisplayStyle('row', 'center', 'center')
  },
  tipQuestion: {
    fontSize: 10,
    color: '#999',
    fontWeight: 'bold'
  },
  step_notice: {
    ...DisplayStyle('row','center','flex-start'),
    backgroundColor: '#fdfceb',
    height: 40,
    paddingLeft: 15
  },
  step_notice_text: {
    fontSize: 12,
    marginLeft: 10,
    color: '#f76f22'
  }
})

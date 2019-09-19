import {Dimensions, StyleSheet} from 'react-native';
import {_1PX, Container, DisplayStyle} from '../../../styles/commonStyles'

const {width} = Dimensions.get('window')

const style = StyleSheet.create({
  app_container: Container,
  // 头部
  home_header_box: {
    height: 154,
    backgroundColor: '#389ef2',
    ...DisplayStyle('row', 'stretch', 'flex-start')
  },
  home_header_left: {
    position: 'relative',
    width: width / 750 * 330,
    backgroundColor: '#389ef2',
    borderColor: '#9dd3ff',
    borderStyle: 'solid',
    borderRightWidth: _1PX * 2,
    borderTopWidth: _1PX * 2,
    ...DisplayStyle('row', 'center', 'center')
  },
  home_header_userinfo: {
    ...DisplayStyle('column', 'center', 'flex-start')
  },
  home_header_img: {
    width: 65,
    height: 65,
    backgroundColor: '#eeeeee',
    marginBottom: 15,
    borderRadius: 33,
  },
  home_header_name: {
    fontSize: 14,
    color: '#fffefe'
  },
  home_header_more: {
    position: 'absolute',
    width: 30,
    height: 30,
    ...DisplayStyle('row', 'center', 'center'),
    left: 18,
    top: 10
  },
  home_header_right: {
    flex: 1,
    backgroundColor: '#389ef2',
    ...DisplayStyle('column', 'stretch', 'flex-start')
  },
  home_header_right_item: {
    flex: 1,
    borderColor: '#9dd3ff',
    borderStyle: 'solid',
    borderTopWidth: _1PX * 2,
    ...DisplayStyle('column', 'center', 'center')
  },
  home_header_right_item_content: {
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  home_header_right_item_icon: {
    width: 30,
    height: 30,
    ...DisplayStyle('row', 'center', 'center')
  },
  home_header_right_item_label_box: {
    position: 'relative',
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  home_header_right_item_label: {
    fontSize: 14,
    color: '#fffefe',
    marginLeft: 10
  },
  home_header_right_item_msg: {
    ...DisplayStyle('row', 'center', 'center'),
    paddingHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#ff5a5a',
    position: 'absolute',
    top: -4,
    left: 66
  },
  home_header_right_item_msg_text: {
    fontSize: 10,
    color: '#fff',
  },
  home_middle: {
    height: 100,
    backgroundColor: '#fff',
    marginBottom: 10,
    ...DisplayStyle('row', 'center', 'center')
  },
  home_middle_item: {
    flex: 1,
    ...DisplayStyle('column', 'center', 'center')
  },
  home_middle_item_img: {
    width: 28,
    height: 28,
  },
  home_middle_item_text: {
    fontSize: 14,
    color: '#444',
    marginTop: 10
  },
  home_content: {
    flex: 1,
    backgroundColor: '#fff'
  }
})

export default style

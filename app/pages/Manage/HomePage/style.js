import { StyleSheet, Dimensions } from 'react-native';
import { DisplayStyle } from '../../../styles/commonStyles'

const { width } = Dimensions.get('window')

const style = StyleSheet.create({
  app_container: {
    flex: 1
  },
  // 头部
  home_header_box: {
    height: 154,
    backgroundColor: '#389ef2',
    ...DisplayStyle('row', 'stretch', 'flex-start')
  },
  home_header_left: {
    width: width / 750 * 330,
    backgroundColor: '#389ef2',
    borderColor: '#9dd3ff',
    borderStyle: 'solid',
    borderRightWidth: 1,
    borderTopWidth: 1,
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
  home_header_right: {
    flex: 1,
    backgroundColor: '#389ef2',
    ...DisplayStyle('column', 'stretch', 'flex-start')
  },
  home_header_right_item: {
    flex: 1,
    borderColor: '#9dd3ff',
    borderStyle: 'solid',
    borderTopWidth: 1,
    ...DisplayStyle('column', 'center', 'center')
  },
  home_header_right_item_content: {
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  home_header_right_item_icon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginRight: 15
  },
  home_header_right_item_label: {
    fontSize: 14,
    color: '#fffefe'
  },
  home_content: {
    flex: 1,
  },
  ScrollableTabView: {
    flex: 1
  },
  test_box: {
    flex: 1
  },
  test_insideBox: {
    ...DisplayStyle('column', 'stretch', 'flex-start'),
    flexWrap: 'wrap',
    flex: 1,
  },
  home_item_column: {
    flex: 1,
    ...DisplayStyle('row', 'stretch', 'flex-start'),
  },
  home_btn: {
    flex: 1,
    ...DisplayStyle('row', 'center', 'center'),
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderLeftColor: '#9dd3ff',
    borderBottomColor: '#9dd3ff',
    borderStyle: 'solid'

  },
  noLeftBorder: {
    borderLeftWidth: 0,
  },
  noBottomBorder: {
    borderBottomWidth: 0,
  },
  item_content: {
    ...DisplayStyle('column', 'center', 'flex-start'),
  },
  item_iconfont: {
    marginBottom: 10,
    width: 28,
    height: 28,
    backgroundColor: '#389ef2'
  },
  item_label: {
    fontSize: 14,
    color: '#666666'
  }
})

export default style

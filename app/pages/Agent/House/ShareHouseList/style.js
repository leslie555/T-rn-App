import {StyleSheet} from 'react-native';
import {_1PX, CommonColor, DEVICE_WIDTH, DisplayStyle} from '../../../../styles/commonStyles'

const style = StyleSheet.create({
  container: {
    ...DisplayStyle('row', 'center', 'center'),
    height: 130,
    width: DEVICE_WIDTH - 30,
    backgroundColor: CommonColor.color_white,
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    shadowOffset: {width: 3, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowColor: '#cccccc',
  },
  left_img: {
    width: 110,
    height: 110,
    marginRight: 10,
    borderRadius: 4
  },
  right_content: {
    flex: 1,
    ...DisplayStyle('column', 'flex-start', 'flex-start'),
  },
  content_top: {
    width: DEVICE_WIDTH - 180,
    flex: 1,
    ...DisplayStyle('column', 'flex-start', 'flex-start'),
  },
  content_title: {
    fontSize: 14,
    color: '#363636'
  },
  content_agent: {
    ...DisplayStyle('row', 'center', 'flex-start'),
    marginTop: 4
  },
  agent_title: {
    fontSize: 12,
    color: '#363636',
  },
  agent_text: {
    fontSize: 12,
    color: '#777',
  },
  content_status: {
    fontSize: 12,
    marginTop: 4
  },
  content_bottom: {
    width: DEVICE_WIDTH - 180,
    ...DisplayStyle('row', 'flex-end', 'space-between'),
  },
  content_price_box: {
    ...DisplayStyle('row', 'center', 'center')
  },
  content_price: {
    color: '#FF9900',
    fontSize: 17
  },
  content_unit: {
    color: '#FF9900',
    fontSize: 12,
    marginBottom: -3
  },
  content_btn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#389ef2',
    borderRadius: 3,
  },
  content_btn_text: {
    fontSize: 13,
    color: '#389ef2'
  },
  selectBox: {
    height: 430,
    ...DisplayStyle('row', 'flex-start', 'space-between')
  },
  selectBoxLeft: {
    ...DisplayStyle('row', 'flex-start', 'flex-start'),
    width: 160,
    height: 430,
    borderRightWidth: 1,
    borderRightColor: '#eee'
  },
  selectBoxRight: {
    height: 430,
    ...DisplayStyle('row', 'flex-start', 'flex-start'),
    flex: 1
  },
  selectBoxScroll: {
    flex: 1
  },
  selectBoxItem: {
    ...DisplayStyle('row', 'center', 'flex-start'),
    height: 43,
    paddingLeft: 20,
    borderBottomWidth: _1PX,
    borderBottomColor: '#efefef'
  },
  selectBoxItemText: {
    fontSize: 13,
    color: '#6c6c6c'
  },
  selectBoxItemTextActive: {
    color: '#389ef2'
  },
  selectBoxItemTextBold: {
    fontWeight: 'bold'
  },
  selectBoxItemTextDisabled: {
    color: '#ccc'
  }
})

export default style

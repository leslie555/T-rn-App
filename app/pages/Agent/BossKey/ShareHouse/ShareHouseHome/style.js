import {StyleSheet} from 'react-native';
import {_1PX, DEVICE_WIDTH, DisplayStyle,DEVICE_HEIGHT,Container} from '../../../../../styles/commonStyles'

const style = StyleSheet.create({
  content:{
    position: 'relative',
    zIndex: -1
  },
  content_header: {
    ...DisplayStyle('row', 'center', 'center'),
    height: 40,
    backgroundColor: '#fff'
  },
  header_text: {
    fontSize: 14,
    color: '#363636'
  },
  header_num: {
    fontSize: 12,
    color: '#389ef2',
    fontWeight: 'bold'
  },
  btn_box: {
    ...DisplayStyle('row', 'flex-start', 'flex-start'),
    paddingHorizontal: 15,
    flexWrap: 'wrap'
  },
  content_box: {
    ...DisplayStyle('row', 'flex-start', 'flex-start'),
    flexWrap: 'wrap',
    paddingLeft: 10,
  },
  content_box_item: {
    ...DisplayStyle('column', 'center', 'center'),
    width: (DEVICE_WIDTH-30)/2,
    marginTop: 15,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 3,
    height: 90
  },
  content_box_item_img: {
    position: 'absolute',
    height: 59
  },
  content_box_item_text: {
    fontSize: 12,
    color: '#666',
    marginBottom: 7
  },
  content_box_item_num: {
    fontSize: 16,
    color: '#389ef2',
    fontWeight: 'bold'
  }
})

export default style

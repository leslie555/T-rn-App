import { StyleSheet } from 'react-native'
import {
  CommonColor,
  DisplayStyle,
  DEVICE_WIDTH,
} from '../../../../../../styles/commonStyles'

export default StyleSheet.create({
  container: {
    width: DEVICE_WIDTH,
    paddingHorizontal: 15,
    backgroundColor: CommonColor.color_white,
    marginTop: 10
  },
  container_top: {
    height: 40,
    ...DisplayStyle('row', 'center', 'space-between'),
    paddingVertical: 10
  },
  container_top_left: {
    ...DisplayStyle('row', 'center', 'flex-start'),
  },
  container_top_right: {
    ...DisplayStyle('row', 'center', 'flex-end')
  },
  container_top_right_title: {
    fontSize: 14,
    color: 'red'
  },
  container_top_square: {
    width: 3,
    height: 15,
    backgroundColor: '#389ef2'
  },
  container_top_title: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666666',
    fontWeight: 'bold'
  },
  container_line: {
    height: 1,
    backgroundColor: '#eeeeee'
  },
  container_content: {
    ...DisplayStyle('column', 'flex-start', 'center'),
    marginHorizontal: 10,
    paddingVertical: 6,
  },
  container_content_house: {
    ...DisplayStyle('row', 'flex-start', 'center'),
  },
  container_content_label: {
    ...DisplayStyle('row', 'flex-start', 'center'),
    fontSize: 12,
    color: '#363636'
  },
  container_content_value: {
    fontSize: 12,
    color:'#999'
  },
  container_content_project: {
    marginTop:6,
    width: DEVICE_WIDTH - 45,
    ...DisplayStyle('row', 'center', 'space-between'),
  },
  container_content_price: {
    position: 'absolute',
    fontSize: 12,
    color: '#666666',
    right: 0,
    top: 0,
    fontWeight: 'bold'
  },
})

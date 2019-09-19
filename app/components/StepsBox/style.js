import {_1PX, CommonColor, DEVICE_WIDTH, DisplayStyle} from '../../styles/commonStyles'
import {StyleSheet} from "react-native";

const $gary = 'rgb(153,209,254)'
export default StyleSheet.create({
  tab_page_wrap: {
    width: DEVICE_WIDTH,
    // backgroundColor: 'yellow'
  },
  tab_container: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    bottom: 0
  },
  steps_box: {
    ...DisplayStyle('column', 'center', 'flex-start'),
    width: DEVICE_WIDTH,
    flex: 1
  },
  steps_panel: {
    width: DEVICE_WIDTH,
    ...DisplayStyle('column', 'center', 'center'),
    height: 50,
    backgroundColor: CommonColor.color_primary
  },
  steps_herder: {
    ...DisplayStyle('row', 'center', 'center')
  },
  step_item_title: {
    ...DisplayStyle('row', 'center', 'center'),
    flex: 1,
    color: $gary,
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'center'
  },
  titleActive: {
    color: '#fff'
  },
  step_item_title_active: {
    color: '#fff'
  },
  steps_content: {
    width: DEVICE_WIDTH,
    ...DisplayStyle('row', 'center', 'center'),
  },
  step_item: {
    ...DisplayStyle('row', 'center', 'center'),
  },
  step_item_icon: {
    ...DisplayStyle('row', 'center', 'center'),
    width: 16,
    height: 16,
    borderRadius: 16,
    borderWidth: _1PX,
    borderStyle: 'dashed',
    borderColor: $gary
  },
  step_item_icon_inner: {
    width: 8,
    height: 8,
    backgroundColor: $gary,
    borderRadius: 8
  },
  step_item_progress: {
    height: 0,
    borderWidth: _1PX,
    borderStyle: 'dashed',
    borderColor: $gary,
    borderRadius: 0.1
  },
  step_item_progress_inner: {
    width: 0,
    borderTopColor: '#389ef2'
  },
  step_item_icon_active: {
    borderColor: '#eee'
  },
  step_item_icon_inner_active: {
    backgroundColor: '#fff'
  },
  step_item_progress_active: {
    borderColor: '#fff'
  },
  step_item_progress_inner_active: {
    width: '100%'
  },
  step_item_icon_inner_current: {
    backgroundColor: '#ffcc00'
  }
})

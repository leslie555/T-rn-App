import {StyleSheet} from 'react-native';
import {_1PX, DEVICE_WIDTH, DisplayStyle,DEVICE_HEIGHT} from '../../../../../styles/commonStyles'

const style = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    ...DisplayStyle('column', 'center', 'flex-end'),
  },
  icon_box: {
    ...DisplayStyle('row', 'flex-start', 'flex-start'),
    paddingHorizontal: 10,
    position: 'relative',
    zIndex: 10,
    flexWrap: 'wrap'
  },
  icon_box_item: {
    ...DisplayStyle('column', 'center', 'center'),
    marginBottom: 30,
    width: (DEVICE_WIDTH - 40 * 2 - 20) / 3
  },
  icon_box_item_ml: {
    marginLeft: 40
  },
  icon_box_item_icon: {
    ...DisplayStyle('row', 'center', 'center'),
    backgroundColor: 'red',
    borderRadius: 6,
    width: 45,
    height: 45,
    marginBottom: 13
  },
  icon_box_item_text: {
    fontSize: 13,
    color: '#666'
  },
  icon_cancel: {
    width: DEVICE_WIDTH,
    height: 60,
    backgroundColor: '#fff',
    borderTopColor: '#eee',
    borderTopWidth: _1PX * 2,
    ...DisplayStyle('row', 'center', 'center'),
    position: 'relative',
    zIndex: 10,
  },
  add_bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 5,
    height: DEVICE_HEIGHT,
    width: DEVICE_WIDTH
  },
  icon_holder:{
    position: 'relative',
    zIndex: 10,
    flex: 1,
    width: DEVICE_WIDTH
  }
})

export default style

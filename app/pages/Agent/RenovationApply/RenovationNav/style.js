import {StyleSheet} from 'react-native';
import {_1PX, DEVICE_WIDTH, DisplayStyle,DEVICE_HEIGHT,Container} from '../../../../styles/commonStyles'

const style = StyleSheet.create({
  container: {
      ...Container
  },
  btn_box: {
    ...DisplayStyle('row', 'flex-start', 'flex-start'),
    paddingHorizontal: 15,
    flexWrap: 'wrap'
  },
  btn_box_item: {
    ...DisplayStyle('column', 'center', 'center'),
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingVertical: 8,
    width: (DEVICE_WIDTH - 15 - 30) / 2
  },
  btn_box_item_ml: {
    marginLeft: 15
  },
  btn_box_item_icon: {
    ...DisplayStyle('row', 'center', 'center'),
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 10,
    marginTop: -16,
    backgroundColor: '#81c6fe'
  },
  btn_box_item_image:{
    width: 18,
    height: 18
  },
  btn_box_item_text: {
    fontSize: 14,
    color: '#666'
  }
})

export default style

import {StyleSheet} from 'react-native';
import {DEVICE_WIDTH, DisplayStyle} from '../../../../../../styles/commonStyles'

const style = StyleSheet.create({
  near_container: {
    minHeight: 150
  },
  near_content: {
    ...DisplayStyle('row', 'flex-start', 'flex-start'),
    flexWrap: 'wrap',
  },
  near_item: {
    width: (DEVICE_WIDTH / 2) - 15,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  near_img: {
    borderRadius: 5,
    width: (DEVICE_WIDTH / 2) - 35,
    height: (DEVICE_WIDTH / 2) - 35
  },
  near_more: {
    ...DisplayStyle('row', 'center', 'center'),
    borderRadius: 4,
    borderWidth: 1,
    paddingVertical: 8,
    borderColor: '#389ef2'
  },
  near_more_text: {
    color: '#389ef2',
    fontSize: 16
  },
  near_title: {
    fontSize: 14,
    color: '#363636',
    marginTop: 4
  },
  content_price_box: {
    ...DisplayStyle('row', 'center', 'flex-start'),
    marginTop: 4
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
})

export default style

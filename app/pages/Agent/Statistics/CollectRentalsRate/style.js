import { StyleSheet } from 'react-native'
import {
  CommonColor,
  DisplayStyle,
  DEVICE_WIDTH
} from '../../../../styles/commonStyles'

const styles = StyleSheet.create({
  /**top部分 */
  top: {
    ...DisplayStyle('row', 'center', 'space-between'),
    paddingHorizontal: 40,
    paddingVertical: 20
  },
  top_left: {
    ...DisplayStyle('column', 'center', 'center')
  },
  top_left_rate: {
    fontSize: 15,
    color: CommonColor.color_primary
  },
  top_left_description: {
    fontSize: 15,
    color: '#999999',
    marginTop: 10
  },
  rect: {
    height: 10,
    width: DEVICE_WIDTH,
    backgroundColor: '#eeeeee'
  },
  line: {
    height: 1,
    backgroundColor: '#eeeeee',
    marginHorizontal: 15    
  },
})

export default styles
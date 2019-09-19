import { StyleSheet } from 'react-native'
import {
  CommonColor,
  DisplayStyle,
  DEVICE_WIDTH
} from '../../../../../styles/commonStyles'

const styles = StyleSheet.create({
  /**容器 */
  Bar: {
    flex: 1
  },
  /**容器顶部样式 */
  Bar_top: {
    ...DisplayStyle('row', 'center', 'space-between'),
    marginHorizontal: 15,
  },
  Bar_top_left: {
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  Bar_top_square: {
    width: 3,
    height: 15,
    backgroundColor: CommonColor.color_primary,
    marginVertical: 15
  },
  Bar_top_title: {
    marginVertical: 15,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#666666'
  },
  /**容器body部分 */
  Bar_body: {
    height: 215,
    ...DisplayStyle('column', 'flex-start', 'flex-start')
  },
  /**容器body上面部分 */
  Bar_body_top: {
    ...DisplayStyle('row', 'center', 'flex-end'),
    marginTop: 15,
    marginRight: 15,
  },
  Bar_body_top_unit: {
    fontSize: 15,
  },
  // Bar_body_top_text: {
  //   fontSize: 15
  // },
  // rentCon_body_top_square: {
  //   width: 15,
  //   height: 15,
  //   marginRight: 10
  // },
  /**分割线 */
  line: {
    height: 1,
    width: DEVICE_WIDTH - 30,
    backgroundColor: CommonColor.color_text_bg,
    marginLeft: 15
  },
  checkMore: {
    fontSize: 15,
    color: CommonColor.color_primary
  }
})

export default styles
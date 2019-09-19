import { StyleSheet } from 'react-native'
import { CommonColor, DisplayStyle } from '../../../../styles/commonStyles'

export default StyleSheet.create({
  searchAdd: {
    ...DisplayStyle('row', 'center', 'space-between'),
  },
  add: {
    fontSize: 16,
    color: CommonColor.color_white,
    marginLeft: 20,
  }
});
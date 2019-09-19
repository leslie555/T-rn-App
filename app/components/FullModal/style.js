import {_1PX, CommonColor, DEVICE_WIDTH, DisplayStyle} from '../../styles/commonStyles'
import {StyleSheet} from "react-native";

export default StyleSheet.create({
  full_container: {
    ...DisplayStyle('column','center','center'),
    flex:1
  },
  full_container_reverse: {
    ...DisplayStyle('column','center','center'),
    flex:1,
    backgroundColor: 'rgba(255,255,255,.9)'
  },
  loading_text: {
    fontSize: 14,
    color: '#389ef2',
    marginTop: 10
  },
  loading_text_reverse: {
    fontSize: 14,
    color: '#fff',
    marginTop: 10
  }
})

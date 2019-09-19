import {_1PX, DEVICE_WIDTH, DisplayStyle} from '../../styles/commonStyles'
import {StyleSheet} from "react-native";

export default StyleSheet.create({
  number_box:{
    ...DisplayStyle('row', 'center', 'flex-start'),
    width: 120,
    height: 30,
    borderColor: '#eee',
    borderWidth: _1PX*2,
    borderRadius: 6,
    overflow: 'hidden'
  },
  number_handle: {
    ...DisplayStyle('row', 'center', 'center'),
    width: 30,
    height: 30
  },
  number_handle_text: {
    color: '#666',
    fontSize: 14
  },
  number_input: {
    flex: 1,
    height: 30,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#eee',
    paddingVertical: 0,
    textAlign: 'center'
  }
})

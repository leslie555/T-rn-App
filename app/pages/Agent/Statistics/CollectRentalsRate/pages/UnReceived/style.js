import { DisplayStyle, DEVICE_WIDTH, CommonColor, Container} from '../../../../../../styles/commonStyles'
import { StyleSheet } from "react-native";
export default StyleSheet.create({
  container: {
    ...Container
  },
  rect: {
    height: 10,
    backgroundColor: CommonColor.color_text_bg
  }, 
  head_filter: {
    ...DisplayStyle('row', 'center', 'space-around'),
    width: DEVICE_WIDTH,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    backgroundColor: CommonColor.color_white
  },
  select_btn: {
    ...DisplayStyle('row', 'center', 'center')
  },
  select_text: {
    fontSize: 15,
    marginRight: 3,
    color: CommonColor.color_text_primary
  }
})
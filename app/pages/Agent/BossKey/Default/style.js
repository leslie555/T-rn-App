import {
  DisplayStyle,
  DEVICE_WIDTH,
  Container,
  CommonColor
} from '../../../../styles/commonStyles'
import { StyleSheet } from 'react-native'
const style = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#eeeeee'
  },
  main_list: {
    zIndex: -2,
    flex: 1
  },
  all_count: {
    height: 80,
    backgroundColor: '#ffffff',
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 1,
    // borderTopStartRadius: 10,
    // borderTopEndRadius: 10,
    ...DisplayStyle('column', 'center', 'center')
  },
  title_list: {
    ...DisplayStyle('column', 'center', 'center')
  },
  all_list: {
    borderRightColor: '#eeeeee',
    borderRightWidth: 1,
    width: DEVICE_WIDTH / 2,
    ...DisplayStyle('column', 'center', 'center')
  },
  income_count: {
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 1,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    height: 80,
    borderRadius:10,
    flexDirection: 'row',
    backgroundColor: '#ffffff'
  },
  text_border: {
    ...DisplayStyle('row', 'center', 'center')
  },
  mr: {
    marginHorizontal: 10,
    borderRadius: 10
  },
  rect: {
    height: 10,
    width: DEVICE_WIDTH,
    backgroundColor: '#eeeeee'
  },
  text_color: {
    fontSize: 18,
    color: CommonColor.color_primary,
    marginBottom: 5
  },
  fl: {
    flex: 1
  }
})
export default style

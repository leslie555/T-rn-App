import {
  DisplayStyle,
  DEVICE_WIDTH,
  Container,
  CommonColor
} from '../../../../../../styles/commonStyles'
import { StyleSheet } from 'react-native'
const style = StyleSheet.create({
  container: {
    // marginTop:20,
    backgroundColor: 'rgb(238,238,238)',
    flex: 1
  },
  headContainer: {
    height: 80,
    backgroundColor: '#ffffff',
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginHorizontal: 10
  },
  list_item: {
    ...DisplayStyle('row', 'center', 'space-between'),
    marginVertical: 8
  },
  header_title: {
    ...DisplayStyle('row', 'center', 'space-between'),
    paddingTop: 5,
    paddingBottom: 10,
    borderBottomWidth: 1,
    marginBottom: 5,
    borderBottomColor: '#E5E5E5'
  },
  header_color: {
    color: '#363636',
    fontSize: 14
  },
  content_top: {
    flex: 1
  },
  title_color: {
    color: '#363636',
    fontSize: 12
  },
  content_color: {
    color: '#777'
  },
  money_color: {
    color: '#ff9900'
  },
  icon_color: {
    color: '#fff',
    paddingRight: 3
  },
  header_right: {
    ...DisplayStyle('row', 'center', 'center')
  },
  tabContainer: {
    flex: 1
  }
})
export default style

import {DisplayStyle, DEVICE_WIDTH, Container, CommonColor} from '../../../../../../styles/commonStyles'
import { StyleSheet } from "react-native"
const style = StyleSheet.create({
  container: {
    // marginTop:20,
    backgroundColor: 'rgb(238,238,238)',
    paddingHorizontal: 10,
    flex: 1
  },
  headContainer: {
    height: 100,
    backgroundColor:'#ffffff',
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10
    
  },
  list_item: {
    ...DisplayStyle('row', 'center', 'space-between'),
    marginVertical: 5
  },
  header_title: {
    paddingTop: 5,
    paddingBottom: 10,
    borderBottomWidth: 1,
    marginBottom: 5,
    borderBottomColor: '#E5E5E5'
  },
  header_color: {
    color: '#363636',
    fontSize: 14,
  },
  title_color: {
    color: '#363636',
    fontSize: 12,
  },
  content_color: {
    color: '#777'
  },
  money_color: {
    color: '#ff9900'
  }
})
export default style
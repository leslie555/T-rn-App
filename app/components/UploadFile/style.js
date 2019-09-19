import {DisplayStyle,_1PX,DEVICE_WIDTH} from '../../styles/commonStyles'
import {StyleSheet} from "react-native";

const $gary = 'rgb(153,209,254)'
const imgWidth = (DEVICE_WIDTH-20*5)/4
export default StyleSheet.create({
  upload_box: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 20,
    backgroundColor: '#ffffff'
  },
  upload_content: {
    ...DisplayStyle('row', 'flex-start', 'flex-start'),
    flexWrap: 'wrap'
  },
  upload_image_box: {
    ...DisplayStyle('row', 'center', 'center'),
    width: imgWidth,
    height: imgWidth,
    borderColor: '#c0ccda',
    borderWidth: 1,
    borderStyle: 'dashed',
    marginRight: 20,
    marginBottom: 15,
    borderRadius:0.1,
    position: 'relative'
  },
  upload_image: {
    width: imgWidth-2,
    height: imgWidth-2
  },
  upload_del_btn:{
    ...DisplayStyle('row', 'center', 'center'),
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    backgroundColor: '#333',
    borderRadius: 20,
    opacity: .5
  },
  upload_btn: {
    ...DisplayStyle('row', 'center', 'center'),
    width: imgWidth,
    height: imgWidth,
    borderColor: '#c0ccda',
    borderWidth: 1,
    borderStyle: 'dashed',
    backgroundColor: '#fefefe',
    borderRadius:0.1
  }
})

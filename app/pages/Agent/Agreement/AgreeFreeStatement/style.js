import {_1PX, DEVICE_WIDTH, CommonColor, DisplayStyle} from '../../../../styles/commonStyles'
import {StyleSheet} from "react-native";

export default StyleSheet.create({
  keep_container: {
    width: DEVICE_WIDTH,
    flex: 1,
    backgroundColor: '#f6f6f6'
  },
  header_right_content: {
    ...DisplayStyle('row', 'center', 'center'),
  },
  header_right_text: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 10
  },
  // 列表项
  outside_box: {
    flex: 1,
    zIndex:-2,
    // paddingLeft: 12,
    marginBottom: 6,
    paddingBottom:2,
    // height: contentBoxHeight,
    backgroundColor: 'white',
    // borderRadius: 10,
    shadowOffset: {width: 5, height: 5},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowColor: '#cccccc',
    // 安卓阴影
    // elevation: 4
  },
  inside_box: {
    flex: 1,
    backgroundColor: CommonColor.color_white,
    // height: contentBoxHeight,
    // borderTopRightRadius: 10,
    // borderBottomRightRadius: 10,
    // borderTopLeftRadius: 10,
    // borderBottomLeftRadius: 10,
    paddingLeft: 15,
    paddingRight: 15
  },
  item_title: {
    marginVertical: 6,
    height:25,
    ...DisplayStyle('row','center','space-between'),
  },
  item_title_bothCon:{
    ...DisplayStyle('row','center','flex-start'),
  },
  item_title_blank:{
    width:3,
    height:12,
    lineHeight:12,
    backgroundColor:CommonColor.color_primary,
    marginHorizontal: 5
  },
  item_title_text: {
    // marginLeft:10,
    fontSize:14,
    // color: CommonColor.color_text_primary,
    // borderLeftWidth:2,
    // borderLeftColor:CommonColor.color_primary,
    // textIndent:2,
    fontWeight: '500'
  },
  item_title_textRight:{
    fontSize:14,
    paddingRight:5,
  },
  line: {
    backgroundColor: '#eee',
    height: 1,
  },
  item_info: {
    // paddingVertical: 6,
    // marginVertical:5,
    // marginBottom:-1,
    // lineHeight:30,
    // height:30,
    marginTop:10,
  },
  type_title_container: {
    ...DisplayStyle('row','center','space-between'),
    // marginBottom: 1
  },
  type_title: {
    marginRight: 10,
    fontSize: 12,
    // color: '#363636'
  },
  type_content: {
    fontSize: 12,
    color: '#999'
  },
  con_body:{
    height:58,
  },
  content_container: {
    // marginVertical:5,
    marginTop:5,
    ...DisplayStyle('row','center','space-between')
  },
  content_container_person: {
    // marginRight: 25,
    // ...DisplayStyle('row','center','flex-start')
  },
  content_container_time: {
    ...DisplayStyle('row','center','flex-start')
  },
  content_title: {
    // marginRight: 0,
    // color:'#363636',
    fontSize: 12
  },
  content_text: {
    color:'#999',
    fontSize: 12
  },
})

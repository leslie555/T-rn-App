import {DisplayStyle, _1PX, DEVICE_WIDTH, FANAL_HEIGHT, StatusBarHeight, CommonColor} from '../../../../styles/commonStyles'
import {StyleSheet,Platform} from "react-native";
export default StyleSheet.create({
//   defaultHeader: {
//     height: FANAL_HEIGHT,
//     width: DEVICE_WIDTH,
//     paddingTop: StatusBarHeight,
//     backgroundColor: CommonColor.color_primary,
//     ...DisplayStyle('row', 'center', 'space-around')
//   },
//   defaultHeaderTitle: {
//     fontSize: Platform.OS === 'ios' ? 17 : 18,
//     fontWeight: Platform.OS === 'ios' ? '600' : '400',
//     color: `#fff`,
//     marginHorizontal: 16
//   },
//   defaultHeaderLeft: {
//     position: 'absolute',
//     top: StatusBarHeight,
//     bottom: 0,
//     left: 15,
//     width: 40,
//     ...DisplayStyle('row', 'center', 'space-between')
//   },
//   defaultHeaderRight: {
//     position: 'absolute',
//     top: StatusBarHeight,
//     bottom: 0,
//     right: 15,
//     ...DisplayStyle('row', 'center', 'space-between')
//   },
//   defalultHeader_con:{
//     fontSize: Platform.OS === 'ios' ? 17 : 18,
//     fontWeight: Platform.OS === 'ios' ? '600' : '400',
//     color: 'rgb(255, 255, 255)',
//     marginHorizontal: 16
//   },

//   defalutHeader_SizeRight:{
//     position: 'absolute',
//     top: StatusBarHeight,
//     bottom: 0,
//     right: 15,
//     ...DisplayStyle('row', 'center', 'space-between')
//   },



  container:{
    //   width:DEVICE_WIDTH,
    // ...DisplayStyle('column', 'center', 'center')
    flex:1
  },
  
  scroller: {
    // paddingLeft: 15,
    // paddingRight: 15,
    paddingTop: 6,
    paddingBottom: 70,
    zIndex: 999,
    // flex:1,
    backgroundColor: '#eee'
},
tabbar_underline: {
    backgroundColor: CommonColor.color_primary,
    width: 60,
    height: 3,
    marginLeft: 38
},
tabbar_inactivestyle: {
    color:'#389ef2',
},
tabbar_textstyle: {
    fontSize: 16
},
tabbar_style: {
    backgroundColor: '#fff',
    // height: 40
},
tabbar_content: {
  flex: 1,
  backgroundColor: '#eee'
},
// 列表项
outside_box: {
    flex: 1,
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
},  
item_title_text: {
    marginLeft:10,
    fontSize:14,
    // color: CommonColor.color_text_primary,
    // borderLeftWidth:2,
    // borderLeftColor:CommonColor.color_primary,
    // textIndent:2,
    fontWeight: '500'
},
item_title_textRight:{
    fontSize:14,
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
    ...DisplayStyle('row','center','flex-start')
},
content_container_person: {
    // marginRight: 25,
    // ...DisplayStyle('row','center','flex-start')
},
content_container_time: {
    ...DisplayStyle('row','center','flex-start')
},
content_title: {
    marginRight: 10,
    // color:'#363636',
    fontSize: 12
},
content_text: {
    color:'#999',
    fontSize: 12
},
opera_btn_container: {
    marginVertical: 6,
    ...DisplayStyle('row','center','flex-end')
},
bussiness_type_btn: {
    borderColor: CommonColor.color_primary,
    padding: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 4,
    width: 70,
    height: 30,
    ...DisplayStyle('row','center','center'),
    marginRight: 10
},
audit_btn: {
    borderColor: CommonColor.color_primary,
    padding: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 4,
    ...DisplayStyle('row','center','center'),
    width: 70,
    height: 30,
    paddingVertical: 3,
    paddingHorizontal: 3
},
btn_text: {
    color:'#389ef2',
    fontSize: 12
},
})

import {DisplayStyle, _1PX, DEVICE_WIDTH, FANAL_HEIGHT, StatusBarHeight, CommonColor} from '../../../../styles/commonStyles'
import {StyleSheet,Platform} from "react-native";
export default StyleSheet.create({
  container:{
    //   width:DEVICE_WIDTH,
    // ...DisplayStyle('column', 'center', 'center')
    flex:1
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


accountHeader:{
    ...DisplayStyle('row','center','center'),
},
account_add:{
    color:CommonColor.color_white,
    fontSize: 16,
    marginLeft:15,
},
account_colorR:{
    color:CommonColor.color_danger,
},




BoxshopAll:{
    // flex: 1,
    // display:flex,
    flexDirection: 'column',
    height: 460,
},
shopStoreBtn:{
    height: 60,
    ...DisplayStyle('row', 'center', 'space-between'),
    borderTopWidth: 1,
    borderTopColor: '#eee'
},
shopStoreBtn_nextC:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60
},
shopStoreBtn_nextS:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CommonColor.color_primary,
    height: 60
},
shopStoreBtn_nextS_Text:{
    color: 'white',
},
  selectBox:{
    height: 400,
    ...DisplayStyle('row', 'flex-start', 'space-between')
  },
  selectBoxLeft:{
    ...DisplayStyle('row', 'flex-start', 'flex-start'),
    width: 110,
    height: 400,
    borderRightWidth: 1,
    borderRightColor: '#eee'
  },
  selectBoxAll:{
    ...DisplayStyle('row', 'flex-start', 'flex-start'),
    width: DEVICE_WIDTH,
    height: 400,
    borderRightWidth: 1,
    borderRightColor: '#eee',
    paddingLeft: 20
  },
  selectBoxRight:{
    height: 400,
    ...DisplayStyle('row', 'flex-start', 'flex-start'),
    flex: 1
  },
  selectBoxScroll: {
    flex: 1
  },
  selectBoxItem:{
    ...DisplayStyle('row', 'center', 'flex-start'),
    height: 43,
    paddingLeft: 20,
    borderBottomWidth: _1PX,
    borderBottomColor: '#efefef'
  },
  selectBoxItemText:{
    fontSize: 13,
    color: '#6c6c6c'
  },
  selectBoxItemTextActive:{
    fontSize: 13,
    color: '#389ef2'
  }
})

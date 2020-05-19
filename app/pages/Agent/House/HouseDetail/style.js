import { StyleSheet, Dimensions } from 'react-native';
import { CommonColor, DisplayStyle } from '../../../../styles/commonStyles';

const marginBottom = 15;

const middleSize = 16;

const { width } = Dimensions.get('window');

const style = StyleSheet.create({
  scroller: {
  },
  wrapper: {
  },
  Other_program_btn: {
    width: parseInt((width - 100) / 4),
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 6,
    marginBottom: 10,
    marginRight: 8,
    borderStyle: 'solid',
    borderColor: '#dddddd',
    borderWidth: 1,
    ...DisplayStyle('row', 'center', 'center')
  },
  Other_program_btn_disabled: {
    backgroundColor: '#eee'
  },
  Other_program: {
    backgroundColor: '#fff',
    padding: 10,
    width: width - 30,
    ...DisplayStyle('row', 'center', 'flex-start'),
    flexWrap: 'wrap'
  },
  Other_program_btn_select: {
    borderColor: CommonColor.color_primary
  },
  Other_program_btn_text: {
    fontSize: 14
  },
  Other_program_btn_text_select: {
    color: CommonColor.color_primary
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  // 房间详情
  detail_content: {
    padding: 15,
    marginBottom: 20,
    backgroundColor: CommonColor.color_white
  },
  detail_content_title: {
    marginBottom,
    paddingRight: 10,
    ...DisplayStyle('row', 'center', 'space-between')
  },
  detail_content_title_box: {
    padding: 2
  },
  detail_content_title_text: {
    fontSize: 20,
    fontWeight: '700'
  },
  detail_content_collect: {

  },
  detail_content_collect_text: {
    color: CommonColor.color_primary
  },
  detail_content_price: {
    marginBottom: 10,
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  detail_content_pricebox: {
    marginRight: 20,
    ...DisplayStyle('row', 'flex-end', 'flex-start')
  },
  detail_content_price_num: {
    marginRight: 5,
    fontSize: 19,
    fontWeight: '600',
    color: '#FCB144'
  },
  detail_content_price_unit: {
    color: '#FCB144'
  },
  detail_content_enterType: {
    marginRight: 15,
    backgroundColor: CommonColor.color_primary,
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 3,
    paddingBottom: 3,
    borderRadius: 4
  },
  detail_content_enterType_text: {
    color: CommonColor.color_white,
    fontSize: 12
  },
  detail_content_houseType: {
    marginRight: 15,
    backgroundColor: CommonColor.color_primary,
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 3,
    paddingBottom: 3,
    borderRadius: 4
  },
  detail_content_houseType_text: {
    color: CommonColor.color_white,
    fontSize: 12
  },
  // 房间信息
  detail_content_houseInfo: {
    marginBottom: 10,
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  detail_content_info_iconbox: {
    marginRight: 10
  },
  detail_content_info_icon: {
    color: '#999999'
  },
  detail_content_info_textarea: {
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  detail_content_info_text: {

  },
  detail_content_info_rightMar: {
    marginRight: 10
  },
  // 地址
  detail_content_address: {
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  detail_content_time: {
    ...DisplayStyle('row', 'center', 'flex-start'),
    marginBottom: 7
  },
  // 付款方式
  detail_content_payType: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderColor: '#eeeeee',
    borderStyle: 'solid',
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  detail_content_payType_title: {
    fontSize: 16,
    color: '#999999',
    marginRight: 10
  },
  detail_content_payType_value: {
    fontSize: 16,
    color: '#999999'
  },
  // 房间切换
  detail_room_num: {
    padding: 15,
    paddingBottom: 0,
    marginBottom: 20,
    backgroundColor: CommonColor.color_white,
    ...DisplayStyle('column', 'flex-start', 'flex-start')
  },
  detail_room_num_left: {
    width: width - 30,
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  detail_room_num_left_text: {
    fontSize: middleSize,
    fontWeight: '700'
  },
  detail_room_num_right: {

  },
  detail_room_num_btn: {
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  detail_room_num_label: {
    marginRight: 15,
    color: CommonColor.color_primary,
    fontSize: middleSize
  },
  detail_room_num_icon: {
    fontSize: middleSize,
    color: CommonColor.color_primary,
  },
  // 管房人
  detail_manager: {
    padding: 15,
    marginBottom: 20,
    backgroundColor: CommonColor.color_white
  },
  detail_manager_title: {
    marginBottom
  },
  detail_manager_title_text: {
    fontSize: 16,
    fontWeight: '700'
  },
  detail_manager_list_item: {
    marginBottom: 15,
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  detail_manager_name: {
    marginRight: 20
  },
  detail_manager_name_text: {

  },
  // 房间配置
  detail_config: {
    padding: 15,
    marginBottom: 20,
    backgroundColor: CommonColor.color_white
  },
  detail_config_iconlist: {
    ...DisplayStyle('row', 'center', 'space-between'),
    flexWrap: 'wrap'
  },
  detail_config_list_item: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 5,
    paddingRight: 5,
    width: width / 6,
    ...DisplayStyle('column', 'center', 'flex-start'),
  },
  detail_config_icontext: {
  },
  detail_config_text: {
    color: '#FE9C11'
  },
  detail_config_no_text: {
    color: '#cccccc'
  },
  detail_config_icon: {
    marginBottom: 15
  },
  // 房间描述
  detail_description: {
    padding: 15,
    marginBottom: 20,
    backgroundColor: CommonColor.color_white
  },
  detail_description_box: {
    padding: 10
  },
  detail_description_text: {

  },
  // 房间按钮
  detail_bottom: {
    height: 80,
    backgroundColor: CommonColor.color_white,
    paddingLeft: 15,
    paddingRight: 15,
    ...DisplayStyle('row', 'center', 'space-between'),
  },
  bottom_btn_blue: {
    backgroundColor: CommonColor.color_primary
  },
  bottom_btn_text: {
    fontSize: 16,
    color: CommonColor.color_white
  },
  bottom_btn: {
    width: width / 3.5,
    height: 48,
    borderRadius: 8,
    ...DisplayStyle('row', 'center', 'center'),
  },
  bottom_btn_two: {
    width: width / 2.5,
    height: 48,
    borderRadius: 8,
    ...DisplayStyle('row', 'center', 'center'),
  },
  bottom_btn_orange: {
    backgroundColor: '#FE9C11'
  },
  detail_order_box: {

  },
  detail_order_line: {
    height: 30,
    ...DisplayStyle('row', 'center', 'flex-start'),
  },
  detail_order_inner_box: {
    flex: 1,
    ...DisplayStyle('row', 'center', 'flex-start'),
  },
  detail_order_text_left: {
    width:70
  },
  detail_order_text_right: {
    flex:1
  },
  detail_order_text: {
    color: '#666',
    fontSize: 14
  },
  detail_order_placeholder:{
    color: '#fff'
  },
  detail_renew: {
    ...DisplayStyle('row', 'flex-start', 'flex-start'),
    height: 40,
  },
  detail_renew_text1: {
    marginRight: 15,
    marginLeft: 8
  },
  detail_renew_text2: {
    marginRight: 5
  },
  detail_renew_img: {
    width: 15,
    height: 15,
    marginTop: 2
  }
})

export default style

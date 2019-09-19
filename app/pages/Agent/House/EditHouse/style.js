import { StyleSheet, Dimensions } from "react-native";
import { CommonColor, DisplayStyle } from '../../../../styles/commonStyles';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  owner_content: {
    flex: 1
  },
  form_style: {
    paddingBottom: 20
  },
  bottom_btn_box: {
    backgroundColor: '#eeeeee',
    width: width,
    height: 70,
    paddingLeft: 20,
    paddingRight: 20,
    ...DisplayStyle('row', 'center', 'space-between')
  },
  bottom_btn_box_top: {
    backgroundColor: '#eeeeee',
    width: width,
    height: 60,
    paddingTop: 5,
    ...DisplayStyle('row', 'center', 'center')
  },
  bottom_btn_item: {
    width: width / 5 * 2,
    height: 48,
    borderRadius: 6,
    // paddingTop: 5,
    ...DisplayStyle('row', 'center', 'center'),
    backgroundColor: CommonColor.color_primary
  },
  bottom_btn_item_top: {
    width: width - 40,
    height: 48,
    borderRadius: 6,
    ...DisplayStyle('row', 'center', 'center'),
    backgroundColor: CommonColor.color_primary
  },
  bottom_btn_item_text: {
    color: CommonColor.color_white,
    fontSize: 18
  },
  Other_program: {
    backgroundColor: '#fff',
    padding: 20,
    ...DisplayStyle('row', 'center', 'space-between'),
    flexWrap: 'wrap'
  },
  Badge_program: {
    backgroundColor: '#fff',
    padding: 20,
    ...DisplayStyle('row', 'center', 'flex-start'),
    flexWrap: 'wrap'
  },
  Other_program_btn: {
    width: parseInt((width - 70) / 3),
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 6,
    marginBottom: 10,
    borderStyle: 'solid',
    borderColor: '#dddddd',
    borderWidth: 1,
    ...DisplayStyle('row', 'center', 'center')
  },
  Badge_program_btn: {
    width: parseInt((width - 90) / 4),
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
  Other_program_btn_select: {
    borderColor: CommonColor.color_primary
  },
  Other_program_btn_text: {
    fontSize: 14
  },
  Other_program_btn_text_select: {
    color: CommonColor.color_primary
  }
})

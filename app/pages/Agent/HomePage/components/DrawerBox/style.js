import {StyleSheet} from 'react-native';
import {_1PX, CommonColor, Container, DisplayStyle, FANAL_HEIGHT} from '../../../../../styles/commonStyles'

const style = StyleSheet.create({
  container: {
    ...Container,
    paddingBottom: 15
  },
  draw_header: {
    backgroundColor: CommonColor.color_primary,
    height: FANAL_HEIGHT + 154,
    paddingLeft: 40,
    paddingBottom: 20,
    ...DisplayStyle('column', 'flex-start', 'flex-end')
  },
  draw_photo_box: {
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  draw_photo_img: {
    width: 60,
    height: 60
  },
  draw_photo_text: {
    fontSize: 20,
    color: '#fff',
    marginLeft: 20
  },
  draw_text_box: {
    ...DisplayStyle('row', 'center', 'flex-start'),
    marginTop: 8
  },
  draw_text_left: {
    width: 76,
    fontSize: 13,
    color: '#eee'
  },
  draw_text_right: {
    fontSize: 13,
    color: '#eeeeee'
  },
  text_indent: {
    color: CommonColor.color_primary
  },
  draw_content: {
    flex: 1
  },
  draw_content_item: {
    backgroundColor: '#fff',
    height: 50,
    paddingLeft: 20,
    borderBottomWidth: _1PX * 2,
    borderBottomColor: '#eee',
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  draw_content_item_icon: {
    width: 24,
    height: 24,
    backgroundColor: '#d7e8fe',
    borderRadius: 12,
    ...DisplayStyle('row', 'center', 'center')
  },
  draw_content_item_text: {
    fontSize: 14,
    color: '#444',
    marginLeft: 12
  },
  draw_footer: {
    height: 44,
    paddingHorizontal: 15
  },
  draw_btn: {
    ...DisplayStyle('row', 'center', 'center'),
    height: 44,
    backgroundColor: CommonColor.color_primary,
    borderRadius: 6
  },
  draw_btn_text: {
    fontSize: 16,
    color: '#fff'
  }
})

export default style

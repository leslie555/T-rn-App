import { StyleSheet } from 'react-native'
import { CommonColor, DisplayStyle, DEVICE_WIDTH } from '../../../../../../../styles/commonStyles'

export default StyleSheet.create({
  outside_box: {
    width: DEVICE_WIDTH - 30,
    marginTop: 10,
    backgroundColor: CommonColor.color_white,
    borderRadius: 10,
    paddingHorizontal: 15     
  },
  top_conatiner: {
    ...DisplayStyle('row', 'center', 'space-between'),
    paddingVertical: 10
  },
  top_title: {
    ...DisplayStyle('row', 'center', 'flex-start'),
    borderStyle: 'solid',   
  },
  top_title_text: {
    fontSize: 12,
    color: CommonColor.color_text_primary,
    color: '#363636'
  },
  top_title_number: {
    marginLeft: 10
  },
  top_protection: {
    fontSize: 12,
    color: '#ffaa3b'
  },
  top_followUp: {
    fontSize: 12,
    color: CommonColor.color_primary
  },
  top_signed: {
    fontSize: 12,
    color: "#999999",
  },
  body_content: {
    flexDirection: 'column',
    borderStyle: 'solid',
    paddingVertical: 6
  },
  body_content_address: {
    ...DisplayStyle('row', 'center', 'flex-start'),
    marginRight: 90
  },
  body_content_address_label: {
    fontSize: 12,
  },
  body_content_address_value: {
    fontSize: 12,
    color: '#999',
  },
  container_line: {
    height: 1,
    backgroundColor: '#eeeeee'
  },
  btn: {
    ...DisplayStyle('row', 'center', 'flex-end'),
    marginTop: -10
  },  
  guestButton: {
    borderColor: CommonColor.color_primary,
    padding: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 4,
  },
  guestButton_text: {
    textAlign: 'center',
    fontSize: 12,
    color: CommonColor.color_primary
  }
})

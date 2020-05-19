import {DisplayStyle, _1PX, DEVICE_WIDTH, FANAL_HEIGHT, StatusBarHeight, CommonColor} from '../../styles/commonStyles'
import {StyleSheet,Platform} from "react-native";
export default StyleSheet.create({

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

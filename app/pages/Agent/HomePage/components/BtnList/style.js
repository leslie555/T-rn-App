import {Dimensions, StyleSheet} from 'react-native';
import {_1PX, DisplayStyle} from '../../../../../styles/commonStyles'

const {width} = Dimensions.get('window')

const style = StyleSheet.create({
  test_insideBox: {
    ...DisplayStyle('column', 'stretch', 'flex-start'),
    flexWrap: 'wrap',
    flex: 1,
  },
  home_item_column: {
    flex: 1,
    ...DisplayStyle('row', 'stretch', 'flex-start'),
  },
  home_btn: {
    flex: 1,
    ...DisplayStyle('row', 'center', 'center'),
    borderLeftWidth: _1PX * 2,
    borderBottomWidth: _1PX * 2,
    borderLeftColor: '#eee',
    borderBottomColor: '#eee',
    borderStyle: 'solid'
  },
  noLeftBorder: {
    borderLeftWidth: 0,
  },
  noBottomBorder: {
    borderBottomWidth: 0,
  },
  item_content: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    ...DisplayStyle('column', 'center', 'flex-start'),
  },
  item_iconfont: {
    marginBottom: 10,
    width: 28,
    height: 28,
    backgroundColor: '#389ef2'
  },
  item_label: {
    fontSize: 14,
    color: '#444',
    marginTop: 10
  }
})

export default style

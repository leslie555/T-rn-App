import {StyleSheet} from 'react-native';
import {CommonColor, DEVICE_WIDTH, DisplayStyle} from '../../../../../styles/commonStyles'

const style = StyleSheet.create({
  container: {
    ...DisplayStyle('column', 'center', 'center'),
    height: 80,
    width: DEVICE_WIDTH - 30,
    backgroundColor: CommonColor.color_white,
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    shadowOffset: {width: 3, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowColor: '#cccccc'
  },
  headContainer: {
    ...DisplayStyle('row', 'center', 'space-between'),
    width: DEVICE_WIDTH - 60,
    borderBottomWidth: 0.5,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomColor: 'rgb(238,238,238)'
  },
  headTitle: {
    ...DisplayStyle('row', 'center', 'flex-start'),
  },
  headTitleLeft: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headTitleRight: {
    color: '#666',
    fontSize: 14,
    marginLeft: 10
  },
  headStatus: {
    fontSize: 14
  },
  contentContainer: {
    flex: 1,
    width: DEVICE_WIDTH - 60,
    ...DisplayStyle('column', 'flex-start', 'center')
  },
  rowContainer: {
    width: DEVICE_WIDTH - 60,
    height: 22,
    ...DisplayStyle('row', 'center', 'space-between')
  },
  rowLeft: {
    ...DisplayStyle('row', 'center', 'flex-start'),
    textAlign: 'left'
  },
  rowRight: {
    ...DisplayStyle('row', 'center', 'flex-end'),
    textAlign: 'right'
  },
  itemTitle: {
    fontSize: 12,
    color: '#363636'
  },
  itemText: {
    fontSize: 12,
    color: '#999',
    paddingLeft: 10
  },
  auditStatusImg: {
    width: 40,
    height: 31,
    position: 'absolute',
    right: 15,
    bottom: 10
  }
})

export default style

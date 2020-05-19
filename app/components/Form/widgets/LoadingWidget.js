import React from 'react';
import createReactClass from 'create-react-class';
import {
  View,
  Text,
  TouchableHighlight,
  Image,
  PixelRatio
} from 'react-native';

var WidgetMixin = require('../mixins/WidgetMixin.js');
var GiftedSpinner = require('react-native-gifted-spinner');

module.exports = createReactClass({
  mixins: [WidgetMixin],

  getDefaultProps() {
    return {
      type: 'LoadingWidget',
      onPress: () => {},
    };
  },

  render() {
    return (
      <View style={this.getStyle('rowContainer')}>
        <TouchableHighlight
          onPress={this.props.onPress}
          underlayColor={this.getStyle('underlayColor').pop()}
          {...this.props} // mainly for underlayColor
        >
          <View style={this.getStyle('row')}>
            <GiftedSpinner />
          </View>
        </TouchableHighlight>
      </View>
    );
  },

  defaultStyles: {
    rowImage: {
      height: 20,
      width: 20,
      marginLeft: 10,
    },
    rowContainer: {
      backgroundColor: '#FFF',
      borderBottomWidth: 1,
      borderColor: '#eee',
    },
    row: {
      flexDirection: 'row',
      height: 44,
      alignItems: 'center',
    },
    underlayColor: '#eee',
  },
});

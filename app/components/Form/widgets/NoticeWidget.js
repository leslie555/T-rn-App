import React from 'react';
import createReactClass from 'create-react-class';
import {
  View,
  Text
} from 'react-native';

var WidgetMixin = require('../mixins/WidgetMixin.js');
import {DisplayStyle} from '../../../styles/commonStyles'



module.exports = createReactClass({
  mixins: [WidgetMixin],

  getDefaultProps() {
    return {
      type: 'NoticeWidget',
      required: false
    };
  },

  render() {
    return (
      <View>
        <View style={this.getStyle('noticeRow')}>
          <Text
            style={this.getStyle('noticeTitle')}
            {...this.props}
          >
            {this.props.required&&this._renderStar()}
            {this.props.title}
          </Text>
          {this.props.rightView}
        </View>
      </View>
    );
  },

  defaultStyles: {
    noticeRow: {
      ...DisplayStyle('row','center','space-between'),
      paddingBottom: 10,
      paddingTop: 10,
      paddingLeft: 10,
      paddingRight: 10,
    },
    noticeTitle: {
      fontSize: 13,
      color: '#9b9b9b',
    },
  },
});


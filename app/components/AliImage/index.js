import React, {Component} from 'react';
import {Image} from 'react-native';

export default class FullModal extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
        <Image 
          {...this.props}
          source={
            {
              ...this.props.source,
              headers: {
                Referer: 'https://www.51tanwo.com',
              }
            }
          }
        ></Image> 
    )
  }
}

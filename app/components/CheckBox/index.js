import React, {Component} from 'react'
import IconFont from '../../utils/IconFont'
import RNCheckBox from 'react-native-check-box'
import PropTypes from "prop-types";
import styles from "./style";

class CheckBox extends Component {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    color: '#389ef2',
    unCheckColor: '#ddd',
    size: 20,
    type: 0
  }

  static propTypes = {
    color: PropTypes.string, // icon颜色
    unCheckColor: PropTypes.string, // icon颜色
    size: PropTypes.number, // icon大小
    type: PropTypes.number, // icon样式  0正方形 1圆形
  }

  render() {
    return (
        <RNCheckBox
            checkedImage={<IconFont name={this.props.type === 0 ? "fuxuankuangxuanzhong" : 'selected'}
                                    color={this.props.color} size={this.props.size}/>}
            unCheckedImage={<IconFont name={this.props.type === 0 ? "fuxuankuangmoren" : 'unselected'}
                                      color={this.props.unCheckColor} size={this.props.size}/>}
            {...this.props}
            style={[styles.check_box, this.props.style]}
        />
    )
  }
}

export default CheckBox

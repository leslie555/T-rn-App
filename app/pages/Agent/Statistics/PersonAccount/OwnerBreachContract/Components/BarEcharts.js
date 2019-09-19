import React, { Component } from 'react'
import { Echarts } from 'react-native-secharts'
import { DEVICE_WIDTH } from '../../../../../../styles/commonStyles';

export default class BarEcharts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      option: {
        tooltip: {},
        yAxis: { show: false },
        xAxis: {
          data: this.props.xAxisData,
          axisTick: { show: false },
          axisLine: {
            lineStyle: {
              color: '#999999',
              width: 1,
              opacity: 0.8
            }
          },
          axisLabel: {
            interval: 0
          }
        },
        series: [
          {
            name: this.props.title,
            type: 'bar',
            barWidth: 30,
            data: this.props.data,
            itemStyle: {
              normal: {
                color: this.props.color,
                label: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    color: '#999999',
                    fontSize: 15
                  }
                }
              }
            }
          }
        ],
        grid: {
          left: 15,
          right: 15,
          bottom: 30,
          height: 120
        }
      }
    }
  }

  static getDerivedStateFromProps(props, state) {
    if(props.data !== state.option.series[0].data) {
      let option = Object.assign({}, state.option)
      option.series[0].data = props.data
      option.xAxis.data = props.xAxisData
      return {
        option
      }
    } else {
      return null
    }
  }
  
  
  render() {
    return <Echarts option={this.state.option} height={185} width={DEVICE_WIDTH} />
  }
}

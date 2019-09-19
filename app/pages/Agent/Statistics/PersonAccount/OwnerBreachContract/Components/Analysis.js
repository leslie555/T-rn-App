import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import {withNavigation} from 'react-navigation'
import {
  CommonColor,
  DisplayStyle,
  DEVICE_WIDTH
} from '../../../../../../styles/commonStyles'
import BarEcharts from './BarEcharts'

 class Analysis extends Component {

    constructor(props){
      super(props)
    }
  goPage(routeName) {
    console.log("this.props",this.props)
    this.props.onEnter.navigation.navigate(routeName)
    // this.props.navigation.navigate(routeName)
  }
  render() {
    const { title, unit, Scolor, text, data, xAxisData, BarColor, moreInfo} = { ...this.props }
    return (
      <View style={styles.rankCon}>
        <View style={styles.rankCon_top}>
          <View style={styles.rankCon_top_left}>
            <View style={styles.rankCon_top_square} />
            
              <Text style={styles.rankCon_top_title}>{title}</Text>
              { moreInfo == '' ?  null :
                <TouchableOpacity style={[styles.more_info]} onPress= {()=>{
                    this.props.navigation.navigate('AgentBreachList')
                } } >
                  <Text style={styles.info_color}>{moreInfo}</Text>
                  </TouchableOpacity>
              }
           
          </View>
        </View>
        <View style={styles.line} />
        <View style={styles.body}>
          <View style={styles.rankCon_body_top}>
            <Text
              style={styles.rankCon_body_top_unit}
            >{`单位: ${unit}`}</Text>
            {Scolor !== '' ? (<View
              style={[
                styles.rentCon_body_top_square,
                { backgroundColor: Scolor }
              ]}
            />):null}
            {text !== '' ? (<Text style={styles.rankCon_body_top_text}>{text}</Text>) : null}
          </View>
          <BarEcharts color={BarColor} data={data} xAxisData={xAxisData} title={this.props.title} moreInfo={this.props.moreInfo}/>
        </View>
        <View style={styles.rankCon_lineBox} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  /**容器 */
  rankCon: {
    flex: 1
  },
  /**容器顶部样式 */
  rankCon_top: {
    ...DisplayStyle('row', 'center', 'space-between'),
    marginHorizontal: 15
  },
  rankCon_top_left: {
    ...DisplayStyle('row', 'center', 'flex-start')
  },
  rankCon_top_square: {
    width: 3,
    height: 15,
    backgroundColor: CommonColor.color_primary,
    marginVertical: 15
  },
  rankCon_top_title: {
    marginVertical: 15,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: 'bold'
  },
  /**容器body部分 */
  rankCon_body: {
    height: 215,
    ...DisplayStyle('column', 'flex-start', 'flex-start')
  },
  /**容器body上面部分 */
  rankCon_body_top: {
    ...DisplayStyle('row', 'center', 'flex-end'),
    marginTop: 15,
    marginRight: 15
  },
  rankCon_body_top_unit: {
    fontSize: 15,
    marginRight: 30
  },
  rankCon_body_top_text: {
    fontSize: 15
  },
  rentCon_body_top_square: {
    width: 15,
    height: 15,
    marginRight: 10
  },
  /**分割线 */
  line: {
    height: 1,
    width: DEVICE_WIDTH - 30,
    backgroundColor: CommonColor.color_text_bg,
    marginLeft: 15
  },
  rankCon_lineBox: {
    height: 10,
    width: DEVICE_WIDTH,
    backgroundColor: '#eeeeee'
  },
  more_info: {
    marginLeft: 125,
  },
  info_color: {
    color: '#389ef2'
  }
})

export default withNavigation(Analysis)
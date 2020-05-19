import React, { Component, PureComponent, Fragment } from 'react'
import {Button, Image, Text, TouchableOpacity, View, StyleSheet, ART} from 'react-native';
import { _1PX, DEVICE_WIDTH, DisplayStyle, CommonColor} from '../../styles/commonStyles'
const { Surface, Shape, Path, Group } = ART
import {Picker} from "../../components";

export default class pickerAreaStatement extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      statementArr: ['日报表', '月报表', '年报表'],
      statementArrAll: [{
        name:'日报表',
        val: 'date'
      },{
        name: '月报表',
        val: 'month'
      },{
        name: '年报表',
        val: 'year'
      }],
      pickerArr: [
      {
        value: '成都',
        key: 2,
        name: 'secondArea'
      },{
        value: '区域',
        key: 3,
        name: 'thirdRegion'
      }],
      cityArr: ['成都','重庆'],
      CityArrAll: [
        {
          value: '5101XX', label: '成都'
        },
        {
          value: '5001XX', label: '重庆'
        }
      ],
      //1 代表成都 2代表重庆
      cityId: 1,
      areaArrCdName:['全部', '锦江区', '成华区', '青羊区', '金牛区', '武侯区', '其他区'],
      areaArrCd: [{
        value: '5101XX', label: '全部', company: '成都满东房地产经纪有限公司'
      },{
        value: '510104', label: '锦江区', company: '成都满东房地产经纪有限公司'
      },
      {
        value: '510108', label: '成华区', company: '成都蜗牛壳房地产经纪有限公司'
      },
      {
        value: '510105', label: '青羊区', company: '成都拉菲房地产经纪有限责任公司'
      },
      {
        value: '510106', label: '金牛区', company: '成都至臻新意科技有限公司'
      },
      {
        value: '510107', label: '武侯区', company: '成都南立凌远房地产经纪有限责任公司\t'
      },
      {
        value: '510100', label: '其他区', company: '成都至臻新意科技有限公司'
      }],
      areaArrCqName: ['全部', '江北区', '沙坪坝区', '渝北区', '南岸区', '其他区'],
      areaArrCq: [{
        value: '5001XX', label: '全部', company: '重庆青逸青公寓管理有限责任公司'
      },{
        value: '500105', label: '江北区', company: '重庆青逸青公寓管理有限责任公司'
      },
      {
        value: '500106', label: '沙坪坝区', company: '重庆大琦公寓管理有限责任公司'
      },
      {
        value: '500112', label: '渝北区', company: '重庆逢阳房地产经纪有限责任公司'
      },
      {
        value: '500108', label: '南岸区', company: '重庆松子公寓管理有限公司'
      },
      {
        value: '500100', label: '其他区', company: '重庆青逸青公寓管理有限责任公司'
      }],
      replaceArr: [],
      // 展示picker是否出现
      firstStatement: false,
      secondArea: false,
      thirdRegion: false,
      // 选中的数据
      firstSelectedValue: [],
      secondSelectedValue: [],
      thirdSelectedValue: [],
      num: 1
    }
  }
  returnShow(){

  }
  alterEvent(){
    if(this.props.type === '1') {
      var arr = [{
          value: '日报表',
          key: 1,
          name: 'firstStatement'
        },
        {
          value: '成都',
          key: 2,
          name: 'secondArea'
        },{
          value: '区域',
          key: 3,
          name: 'thirdRegion'
        }]
        if(this.props.config !== undefined){
          arr.push(this.props.config)
        }
      this.setState({
          pickerArr: arr
      },()=>{
        console.log(this.state.pickerArr, this.props.returnData)
      })
    }else{
        if(this.props.config !== undefined){
            this.state.pickerArr.push(this.props.config)
            this.setState({
                pickerArr: this.state.pickerArr
            })
          }
    }
    this.setState({
      replaceArr:  this.state.areaArrCdName
    })
  }
  nowEvent() {

  }
  componentDidMount() {
    if(this.props.selectCity === 1) {
      this.nowEvent()
    } else {
      this.alterEvent()
    }

  }
  componentWillReceiveProps(nextProps){
    // 自定义组件添加  修改文字
      if(nextProps.config !== undefined){
        if(this.props.config.value !== nextProps.config.value){
            var getpickerArr = JSON.parse(JSON.stringify(this.state.pickerArr))
            getpickerArr = getpickerArr.filter(item => item.key !== this.props.config.key)
            getpickerArr.push(nextProps.config)
            this.setState({
              pickerArr: getpickerArr
            },()=>{
              console.log(this.state.pickerArr)
            })
        }
      }
      // // 返回来的数据  显示在页面
      if(JSON.stringify(this.props.returnData)!==JSON.stringify(nextProps.returnData) && nextProps.returnData.length !== 0){
        this.props.returnData = nextProps.returnData
        const returnData = nextProps.returnData
        // 如果选中重庆 后面区域变 和picker选中重庆
        if(returnData[1].label === '重庆'){
          this.setState({
            replaceArr:  this.state.areaArrCqName,
            cityId:2,
            secondSelectedValue: ['重庆']
          },()=>{
              // 要写在回调里面 应为要先确定先选择城市过后，才能确定区域
              // 其他页面跳入组件，回显平且在picker上展示
              for(let i = 0; i < returnData.length; i++){
                if(i === 0 && returnData[0].label !== '日报表'){
                  const firstSelectedValue = []
                  firstSelectedValue.push(returnData[0].label)
                  this.setState({
                    firstSelectedValue
                  })
                }
                if(i === 2 && returnData[0].value !== ''){
                  const thirdSelectedValue = []
                  thirdSelectedValue.push(returnData[2].label)
                  this.setState({
                    thirdSelectedValue
                  })
                }
              }
          })
        }


        // 循环一下重新赋值给pickerArr
        returnData.forEach(item => {
          item.key = item.id
          item.value = item.label
        });
        this.setState({
          pickerArr: returnData,
        })
      }

  }

  piker(val){
    if(val === 1) {
      this.setState({
        firstStatement: true
      })
    } else if(val === 2) {
      this.setState({
        secondArea: true
      })
    } else if(val === 3) {
      this.setState({
        thirdRegion: true
      })
    }else{
        var obj ={
            id: val
        }
        this.props.getPickerData(obj)
    }
  }
  firstProjectConfirm(data){
    const getData = this.state.statementArrAll.find((item)=>{
        return item.name === data[0]
      })
      var obj = {
          id: 1,
          data: getData
      }

    this.state.pickerArr[0].value = data[0]
    this.setState({
        pickerArr: this.state.pickerArr,
        firstSelectedValue: data
    },()=>{
        console.log(this.state.firstSelectedValue)
    })
    this.props.getPickerData(obj)
  }
  // 城市picker
  secondProjectConfirm(data){
    // 判断第一个是城市还是日报表   为列表头更换名字
    if(this.state.pickerArr[0].value !== data[0]){
      // 1为重庆
      if(this.props.type === '1'){
        this.state.pickerArr[1].value = data[0]
        this.state.pickerArr[2].value = '区域'
        const thirdSelectedValue = ['全部']
        this.setState({
          thirdSelectedValue
        })
      }else{
        this.state.pickerArr[0].value = data[0]
        this.state.pickerArr[1].value = '区域'
        const thirdSelectedValue = ['全部']
        this.setState({
          thirdSelectedValue
        })
      }
    }
    // 更换picker数据
    if (data[0] === '成都'){
        this.setState({
            replaceArr:  this.state.areaArrCdName,
            cityId: 1,
            pickerArr: this.state.pickerArr,
            secondSelectedValue: data
        })
    } else if (data[0] === '重庆') {
        this.setState({
            replaceArr:  this.state.areaArrCqName,
            cityId: 2,
            pickerArr: this.state.pickerArr,
            secondSelectedValue: data
        })
    }
    const cityCode = this.state.CityArrAll.find((item)=>{
        return item.label === data[0]
    })
    var obj = {
      id: 2,
      data: cityCode
  }
    this.props.getPickerData(obj)
  }
  thirdProjectConfirm(data){
    // 1判断是否有日报表   然后把文字赋值给选中的
    if(this.props.type === '1'){
      this.state.pickerArr[2].value = data[0]
    }else{
      this.state.pickerArr[1].value = data[0]
    }
    this.setState({
        pickerArr: this.state.pickerArr,
        // picker选中
        thirdSelectedValue: data
    })
    if(this.state.cityId === 1){
        var getData = this.state.areaArrCd.find((item)=>{
            return item.label === data[0]
        })
        var obj = {
          id: 3,
          data: getData
        }
        this.props.getPickerData(obj)
    }else{
        var getData = this.state.areaArrCq.find((item)=>{
            return item.label === data[0]
        })
        var obj = {
          id: 3,
          data: getData
        }
        this.props.getPickerData(obj)
    }

  }
  render() {
    return (
        <View>
            <View style={styles.picker_container}>
              {
                this.state.pickerArr.map((item,index) => {
                  return (
                    <TouchableOpacity key={item.key} style={styles.picker_select} onPress={()=>{this.piker(item.key)}}>
                        <View style={styles.picker_anmimal}>
                            {item.key <= 3 ?
                                <Text style={this.state[item.name] ? styles.picker_blue : styles.picker_marR}>{item.value}</Text>
                                :
                                <Text style={this.props[item.name] ? styles.picker_blue : styles.picker_marR}>{item.value}</Text>
                            }
                            {
                                item.key <= 3 ?<Triangle selected={this.state[item.name]} />:<Triangle selected={this.props[item.name]} />
                            }

                        </View>
                    </TouchableOpacity>
                  )
                })
              }
            </View>
          <Picker
                visible={this.state.firstStatement}
                type={'regionCC'}
                pickerData={this.state.statementArr}
                selectedValue={this.state.firstSelectedValue}
                onPickerConfirm={(data) => this.firstProjectConfirm(data)}
                closeModal={() => {
                this.setState({firstStatement: false})
                }}
            />
          <Picker
                visible={this.state.secondArea}
                type={'regionCC'}
                pickerData={this.state.cityArr}
                selectedValue={this.state.secondSelectedValue}
                onPickerConfirm={(data) => this.secondProjectConfirm(data)}
                closeModal={() => {
                this.setState({secondArea: false})
                }}
            />
          <Picker
                visible={this.state.thirdRegion}
                type={'regionCC'}
                pickerData={this.state.replaceArr}
                selectedValue={this.state.thirdSelectedValue}
                onPickerConfirm={(data) => this.thirdProjectConfirm(data)}
                closeModal={() => {
                this.setState({thirdRegion: false})
                }}
            />
        </View>
    );
  }
}

const T_WIDTH = 7
const T_HEIGHT = 4

const COLOR_HIGH = '#389ef2'
const COLOR_NORMAL = '#6c6c6c'

class Triangle extends PureComponent {
  render() {
    var path
    var fill
    if (this.props.selected) {
      fill = COLOR_HIGH
      path = new Path()
        .moveTo(T_WIDTH / 2, 0)
        .lineTo(0, T_HEIGHT)
        .lineTo(T_WIDTH, T_HEIGHT)
        .close()
    } else {
      // fill = COLOR_NORMAL
      fill = '#999'
      path = new Path()
        .moveTo(0, 0)
        .lineTo(T_WIDTH, 0)
        .lineTo(T_WIDTH / 2, T_HEIGHT)
        .close()
    }

    return (
      <Surface width={T_WIDTH} height={T_HEIGHT}>
        <Shape d={path} stroke='#00000000' fill={fill} strokeWidth={0} />
      </Surface>
    )
  }
}
const styles = StyleSheet.create({
    picker_container: {
        // ...DisplayStyle('row', 'flex-start', 'flex-start'),
        // display: flex,
        width: DEVICE_WIDTH,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-around',
        height: 45,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
      },
      picker_select: {
       ...DisplayStyle('row', 'center', 'center'),
      },
      picker_blue:{
        // color: CommonColor.color_text_primary,
        color: '#389ef2',
        marginRight: 3
      },
      picker_anmimal:{
        ...DisplayStyle('row', 'center', 'center'),
      },
      picker_marR:{
          marginRight: 3
      }
});

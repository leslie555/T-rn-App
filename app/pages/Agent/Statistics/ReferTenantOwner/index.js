import React from 'react'
import {
    Text, 
    TouchableOpacity, 
    View,
    FlatList,
    Alert,
    Linking,
    RefreshControl,
    Dimensions,
    TouchableWithoutFeedback} from 'react-native'
    import ScrollableTabView from 'react-native-scrollable-tab-view'
import styles from './style'
import IconFont from '../../../../utils/IconFont/index' 
import EmptyList from "../../../../components/EmptyList";
import { List , SearchBar , ListLoading ,ListFooterComponent ,Header} from '../../../../components'
import {QueryIntroductionList} from '../../../../api/personalAccount'
import {dateFormat} from '../../../../utils/dateFormat'
export default class Teant extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            //判断搜索框是否出现
            isShow: false,
            SelectForm: {
                parm: {
                    page: 1,
                    size: 10
                },
                Keyword: '',
                //0是房东 1是租客
                type: 1,
            },
     
        }
    }   
    goBack(){
        this.props.navigation.goBack();
    }
    onChangeText(text) {
        const SelectForm = {...this.state.SelectForm}
        SelectForm.Keyword = text
        this.setState({
            SelectForm
        })
    }
    onCancel(text) {
        if (!text) {
            this.setState({
                isShow: false
            })
            const SelectForm = {...this.state.SelectForm}
            SelectForm.Keyword = ''
            this.setState({
                SelectForm
            })
        } 
    }
    onClear() {
        const SelectForm = {...this.state.SelectForm}
        SelectForm.Keyword = ''
        this.setState({
            SelectForm
        })
    }
    showSearch(){
        this.setState({
            isShow: true
        })
    }   
    renderApprovalItem({item}) {
        return (
            <View style={styles.outside_box}>
                <View style={styles.inside_box}>
                    <TouchableOpacity>
                        <View style={styles.item_title}>
                            <View style={styles.item_title_bothCon}>
                                <Text style={styles.item_title_blank}>

                                </Text>
                                <Text
                                    style={styles.item_title_text}>{item.ClientName} &nbsp;&nbsp;&nbsp;{item.ClientPhone}</Text>
                            </View>
                            <View>
                                <Text
                                    style={styles.item_title_textRight}>{dateFormat(item.SignTime)}</Text>
                            </View>
                        </View>
                        <View style={styles.line}/>
                        <View style={styles.con_body}>
                            <View style={styles.item_info}>
                                <View style={styles.type_title_container}>
                                    <Text style={styles.type_title}>合同编号：{item.ContractNumber}</Text>
                                    <Text style={styles.content_title}>介绍人：{item.IntroducerName}&nbsp;&nbsp;{item.IntroducerPhone}</Text>
                                </View>
                            </View>
                            <View style={styles.content_container}>
                                <View style={styles.content_container_time}>
                                    <Text style={styles.content_title}>房源名称：</Text>
                                    <Text
                                        style={styles.content_text}>{item.HouseName}</Text>
                                </View>
                            </View>
                        </View>
                      
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    componentDidMount(){
        // this.fetchData();
    }
    render() {
        const renderItem = ({ item }) => {
            return  this.renderApprovalItem({item})
        }
        return (
            <View style={styles.container}>
                {/* <View style={{...styles.defaultHeader}}>
                    <TouchableOpacity
                        style={styles.defaultHeaderLeft}
                        onPress={this.goBack.bind(this)}
                    >
                        <IconFont name='back' size={20} color='white'/>
                    </TouchableOpacity>
                    {this.state.isShow ?(
                        <SearchBar
                        onChangeText={this.onChangeText.bind(this)}
                        onCancel={this.onCancel.bind(this)}
                        onClear={this.onClear.bind(this)}
                        placeholder={'转介绍（租客）'}
                    />):(<Text style={styles.defalultHeader_con}>转介绍（租客）</Text>
                    )}
                    
                    {this.state.isShow ?null:(
                    <TouchableOpacity style={styles.defalutHeader_SizeRight} onPress={this.showSearch.bind(this)}>
                        <IconFont name='search' size={24} color='white'/>
                    </TouchableOpacity>)}
                </View> */}
                <Header
                    hideLeft={false}
                    title={'转介绍（租客）'}
                    headerRight = {<TouchableOpacity style={styles.defalutHeader_SizeRight} onPress={this.showSearch.bind(this)}>
                            <IconFont name='search' size={24} color='white'/>
                        </TouchableOpacity>}
                >
                    {!this.state.isShow?'':
                        <SearchBar
                        cancelText={'取消'}
                        placeholder={'请输入转介绍（租客）'}
                        hideCancelText={!this.state.isShow}
                        onChangeText={this.onChangeText.bind(this)}
                        onCancel={this.onCancel.bind(this)}
                        onClear={this.onClear.bind(this)}
                    />}
                </Header>
                <List
                        request={QueryIntroductionList}
                        form={this.state.SelectForm}
                        listKey={'AgentReferTenant'}
                        setForm={SelectForm => this.setState({  SelectForm })}
                        renderItem={renderItem}
                    />
            </View>
        )
    }
}

import React, { Component, Fragment } from 'react'
import {
    View, Text, StyleSheet, TouchableOpacity, BackHandler, Platform, ScrollView
} from 'react-native'
import {
    DisplayStyle,
    CommonColor,
} from "../../../styles/commonStyles"
import { Modal } from '../../../components'
import storage from "../../../utils/storage"

class ServicePolicy extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false
        }
        this.didFocusSubscription = props.navigation.addListener(
            'didFocus',
            payload => {
                storage.get('saveLogin').then(val => {
                    this.setState({
                        visible: val ? false : true
                    })
                })
            }
        )
        this.willBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            payload => {
                this.setState({
                    visible: false
                })
            }
        )
    }
    _onPressRouter = (name) => {
        this.props.navigation.navigate(name)
    }
    _onPress = (val) => {
        if (val === 1) {
            BackHandler.exitApp()
        } else {
            storage.set('saveLogin', true)
            this.setState({
                visible: false
            })
        }
    }

    render() {
        const { visible } = this.state
        console.log(visible)
        debugger
        return (
            <Fragment>
                {/* <Modal visible={visible} transparent={true} animationType='slide'> */}
                <View style={[visible ? styles.backgroundColorAll : styles.closeVisible]}>
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%'
                    }}>
                        <View style={styles.Contain}>
                            <ScrollView>
                                <View style={styles.ModelTextTop}>
                                    <View style={styles.ContainHeader}>
                                        <Text>服务协议和隐私政策</Text>
                                    </View>
                                    <View style={styles.ContainBody}>
                                        <Text>&emsp;请你务必审慎阅读、充分理解“服务协议”和“隐私政策”各条款，包括但不限于：为了向
                                        您提供内容分享、附近功能等服务，我们需要收集您的设备信息、操作日志等个人信息。
                    您可以在“设置”中查看、变更、删除个人信息并管理你的授权。</Text>
                                    </View>
                                    <View style={styles.ModelTextCenter}>
                                        <Text>&emsp;您可阅读</Text>
                                        <TouchableOpacity
                                            onPress={() => { this._onPressRouter('ServiceContractLogin') }}>
                                            <Text style={styles.ModelTextColor}>《服务协议》</Text>
                                        </TouchableOpacity>
                                        <Text>和</Text>
                                        <TouchableOpacity
                                            onPress={() => { this._onPressRouter('PrivacyPolicyLogin') }}>
                                            <Text style={styles.ModelTextColor}>《隐私政策》</Text>
                                        </TouchableOpacity>
                                        <Text>了解详细信息。如您同意，请点击“同意”开始接受我们的服务。</Text>
                                    </View>
                                </View>
                            </ScrollView>
                            <View style={styles.ModelTextBtn}>
                                <TouchableOpacity
                                    onPress={() => this._onPress(1)}
                                    style={[Platform.OS === 'android' ? styles.ModelTextBtnCss : styles.ModelTextCancel]}
                                >
                                    <Text>暂不使用</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this._onPress(2)}
                                    style={[Platform.OS === 'android' ? styles.ModelTextBtnCss : styles.ModelTextIOS]}
                                >
                                    <Text style={[styles.ModelTextBtnColor]}>同意</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                {/* </Modal> */}
            </Fragment>
        )
    }
}
export default ServicePolicy

const styles = StyleSheet.create({
    backgroundColorAll: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        zIndex: 100,
    },
    closeVisible: {
        display: 'none',
        zIndex: -100,
    },
    Contain: {
        width: 300,
        height: 300,
        borderRadius: 10,
        backgroundColor: '#FFF',
        flexDirection: 'column'
    },
    ContainHeader: {
        height: 60,
        ...DisplayStyle("row", "center", "center"),
    },
    ModelTextTop: {
        paddingLeft: 18,
        paddingRight: 18
    },
    ModelTextCenter: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    ModelTextColor: {
        color: CommonColor.color_primary
    },
    ModelTextBtn: {
        borderTopWidth: 1,
        borderTopColor: '#eeeeee',
        marginTop: 20,
        height: 50,
        flexDirection: 'row',
    },
    ModelTextBtnCss: {
        width: '50%',
        ...DisplayStyle("row", "center", "center"),
    },
    ModelTextBtnColor: {
        color: CommonColor.color_primary
    },
    ModelTextCancel: {
        display: 'none'
    },
    ModelTextIOS: {
        width: '100%',
        ...DisplayStyle("row", "center", "center"),
    }
})

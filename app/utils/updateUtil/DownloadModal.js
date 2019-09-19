import {FullModal} from '../../components'
import {connect} from 'react-redux'
import React, { Component } from 'react'

class DownloadModal extends Component{
  constructor(props){
    super(props)
  }
  render(){
    return (
        <FullModal reverse={true} visible={this.props.updateStatus>0} loadingText={this.props.updateStatus===1?'更新包下载中...':'下载完成，正在重启app...'} />
    )
  }
}
const mapToProps = state => ({updateStatus: state.appUpdate.status})
export default connect(mapToProps)(DownloadModal)

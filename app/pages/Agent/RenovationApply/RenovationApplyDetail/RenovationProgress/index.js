import React, { Component } from "react"
import { Text, View, FlatList } from "react-native"
import styles from './style'
import { dateFormat } from "../../../../../utils/dateFormat"

export default class RenovationProgress extends Component {
  constructor(props) {
    super(props)
  }
  static defaultProps = {
    item: {
      Category: "",
      CreaterTime:"0001-01-01T00:00:00",
      Content: ""
    }
  }

  renderItem = ({ item, index }) => (
    <View style={styles.detail_container}>
      <View style={styles.detail_container_top}>
        <View style={styles.detail_container_top_outCircle}>
          <View style={styles.detail_container_top_inCircle} />
        </View>
        <Text
          style={[styles.detail_container_top_status, { color: "#389ef2" }]}
        >
          {item.Category}
        </Text>
      </View>
      <View style={styles.detail_container_body}>
          {index !== (this.props.RenovationTrack.length - 1) && <View style={styles.detail_container_body_dashedLine} />}
          {index !== (this.props.RenovationTrack.length - 1) && <View style={styles.detail_container_body_dashedLine_cover} />}
        <View style={styles.detail_container_body_content}>
          {item.Content ? (
            <Text style={[styles.detail_container_body_content_time]}>
              {item.Content}
            </Text>
          ) : null}
          <Text style={styles.detail_container_body_content_time}>
            {dateFormat(item.CreaterTime, "yyyy-MM-dd hh:mm:ss") || " "}
          </Text>
        </View>
      </View>
    </View>
  )
  
  render() {
    return (
      <View>
        <View style={styles.renovation}>
          <View style={styles.renovation_square} />
          <Text style={styles.renovation_text}>装修进度跟踪</Text>
        </View>
        <FlatList
          keyboardShouldPersistTaps="always"
          data={this.props.RenovationTrack}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index + ""}
        />
      </View>
    )
  }
}

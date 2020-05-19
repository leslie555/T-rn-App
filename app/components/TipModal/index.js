import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { View, Modal, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { DisplayStyle, _1PX } from '../../styles/commonStyles'
export default class TipModal extends Component {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
    title: PropTypes.string,
    btnTitle: PropTypes.string,
    tipText: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    onConfirm: PropTypes.func
  }

  static defaultProps = {
    title: '提示',
    btnTitle: '我知道了'
  }

  render() {
    const {
      visible,
      setVisible,
      title,
      btnTitle,
      tipText,
      onConfirm
    } = this.props
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType={'fade'}
        onRequestClose={() => setVisible(false)}
      >
        <Text
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(2,2,2,0.3)'
          }}
          onPress={() => {
            setVisible(false)
          }}
        ></Text>
        <View style={styles.tipModalContainer}>
          <View style={styles.tipContentContainer}>
            <View style={styles.tipContentTitleContainer}>
              <Text style={styles.tipContentTitle}>{title}</Text>
            </View>
            <View style={styles.tipTextContainer}>
              {Array.isArray(tipText) ? (
                tipText.map((v, i) => {
                  return (
                    <Text key={i} style={styles.tipText}>
                      {v}
                    </Text>
                  )
                })
              ) : (
                <Text style={styles.tipText}>{tipText}</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.tipBtnContainer}
              onPress={() => {
                setVisible(false)
                onConfirm && onConfirm()
              }}
            >
              <Text style={styles.tipBtnText}>{btnTitle}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  tipModalContainer: {
    flex: 1,
    ...DisplayStyle('row', 'center', 'center')
  },
  tipContentContainer: {
    width: 310,
    borderRadius: 10,
    backgroundColor: '#fff'
  },
  tipContentTitleContainer: {
    height: 42,
    ...DisplayStyle('row', 'center', 'center')
  },
  tipContentTitle: {
    color: '#333',
    fontSize: 14
  },
  tipTextContainer: {
    paddingHorizontal: 18
  },
  tipText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#666',
    marginBottom: 14
  },
  tipBtnContainer: {
    height: 42,
    ...DisplayStyle('row', 'center', 'center'),
    borderTopWidth: _1PX,
    borderTopColor: '#eee'
  },
  tipBtnText: {
    fontSize: 15,
    color: '#389ef2'
  }
})

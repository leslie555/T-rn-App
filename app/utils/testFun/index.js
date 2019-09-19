import React, { Component } from 'react';
import { Alert} from 'react-native';

const TestFun = str => {
  Alert.alert('提示', str)
}

const TestFun2 = str => {
  Alert.alert('提示2?', str)
}

export {
  TestFun,
  TestFun2
}

import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';

function LoadingScreen({styles}: {styles?: StyleSheet}) {
  return (
    <View style={[styles, styles.container]}>
      <ActivityIndicator size={50} color='black' />
    </View>
  );
}

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

function LoadingScreen() {
  return (
    <View style={styles.LoadingScreen}>
      <ActivityIndicator 
        size={50}
        color="black"
      />
    </View>
  );
}

export default LoadingScreen

const styles = StyleSheet.create({
  constiner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
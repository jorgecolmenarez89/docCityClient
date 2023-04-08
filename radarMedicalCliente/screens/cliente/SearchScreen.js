import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

function SearchScreen() {
  return (
    <View style={styles.LoadingScreen}>
      <Text>SearchScreen</Text>
    </View>
  );
}

export default SearchScreen

const styles = StyleSheet.create({
  constiner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
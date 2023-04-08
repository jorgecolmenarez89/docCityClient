import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function ProfileScreen() {
  return (
    <View style={styles.LoadingScreen}>
      <Text>ProfileScreen</Text>
    </View>
  );
}

export default ProfileScreen

const styles = StyleSheet.create({
  constiner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
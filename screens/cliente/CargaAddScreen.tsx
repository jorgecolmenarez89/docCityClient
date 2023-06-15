import React, {useEffect, useState, useCallback, useContext} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {View, Text, FlatList, TouchableHighlight, RefreshControl, StyleSheet} from 'react-native';
import {RootStackParamList} from '../../config/Types';

type CargaListScreenProps = NativeStackScreenProps<RootStackParamList>;

function CargaAddScreen({navigation}: CargaListScreenProps) {
  return (
    <View style={styles.container}>
      <Text>Vista Add Familiar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CargaAddScreen;

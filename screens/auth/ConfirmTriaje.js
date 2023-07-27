import Triaje from '../../components/Triaje';
import React, {useState, useContext, useEffect} from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar, Alert} from 'react-native';
import {AuthContext} from '../../context/AuthContext';

function ConfirmTriaje({navigation}) {
  const {hasTriaje, setHasTriaje} = useContext(AuthContext);

  const askTriaje = () => {
    setHasTriaje(true);
    navigation.goBack();
  };

  return (
    <View style={{flex: 1, backgroundColor: '#f6f7fc', paddingTop: 50}}>
      <View style={{flex: 1, paddingHorizontal: 20, width: '100%'}}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            flexDirection: 'row',
            width: '100%',
            marginBottom: 0,
          }}>
          <Text style={styles.title}>Mi Triaje</Text>
        </View>
        <View style={{width: '100%', flex: 1}}>
          <Triaje idUser={null} parent={true} handleFinish={askTriaje} />
        </View>
      </View>
    </View>
  );
}

export default ConfirmTriaje;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fc',
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    color: '#06060a',
    fontFamily: 'Poppins-SemiBold',
  },
});

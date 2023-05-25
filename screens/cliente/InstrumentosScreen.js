import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CustomHeader from '../../components/CustomHeader';

function InstrumentosScreen({navigation}) {
  return (
    <View style={styles.container}>
      <View style={{marginTop: 10, marginLeft: 20}}>
        <CustomHeader
          iconColor='#0b445e'
          iconName='arrow-back'
          onPressIcon={() => navigation.goBack()}
        />
      </View>
      <Text>InstrumentosScreen</Text>
    </View>
  );
}

export default InstrumentosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

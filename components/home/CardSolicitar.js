import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button, Icon} from '@rneui/themed';

function CardSolicitar({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.textTitle}>SOLICITAR CONSULTA MÉDICA</Text>
        <Icon type='ionicon' name='close-outline' size={20} color={'#fff'} />
      </View>
      <View style={styles.dataContainer}>
        <View style={styles.ubicationContainer}>
          <View style={styles.iconMap}>
            <Icon type='ionicon' name='location' size={40} color='#0b445e' />
          </View>
        </View>
        <View style={styles.busquedaContainer}>
          <View style={styles.ubicationContainer}>
            <Text style={styles.textContent}>Encuantra a tu especialista más cercano</Text>
          </View>
          <View style={styles.botonContainer}>
            <Button
              title={'IR AL MAPA'}
              buttonStyle={{
                backgroundColor: '#0caec6',
                borderRadius: 6,
                height: 25,
                padding: 0,
              }}
              titleStyle={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 15,
              }}
              onPress={() => {
                navigation.navigate('Search');
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#005d81',
    padding: 10,
    borderRadius: 10,
  },
  headerContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dataContainer: {
    marginTop: 8,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  ubicationContainer: {
    paddingRight: 10,
  },
  busquedaContainer: {
    flex: 1,
    display: 'flex',
  },
  textTitle: {
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
  },
  textContent: {
    fontFamily: 'Poppins-Medium',
    color: '#fff',
    lineHeight: 20,
  },
  iconMap: {
    backgroundColor: '#dadada',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 55,
  },
  botonContainer: {
    marginTop: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default CardSolicitar;

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button, Icon, Image} from '@rneui/themed';

function CardBuscar({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.dataContainer}>
        <View style={styles.textoContainer}>
          <View style={styles.ubicationContainer}>
            <Text style={styles.textContent}>Consigue al especialista que necesites</Text>
          </View>
          <View style={styles.botonContainer}>
            <Button
              buttonStyle={{
                backgroundColor: '#0caec6',
                borderRadius: 6,
                height: 40,
                padding: 0,
              }}
              titleStyle={{
                fontFamily: 'Poppins-Medium',
                fontSize: 16,
              }}>
              <Icon type='ionicon' name='search-outline' color='white' style={{marginRight: 5}} />
              ACCERDER
            </Button>
          </View>
        </View>
        <View style={styles.fotoContainer}>
          <Image style={styles.stretch} source={require('../../assets/doctor.png')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#0b445e',
    padding: 10,
    borderRadius: 10,
  },
  dataContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    position: 'relative',
  },
  fotoContainer: {
    flex: 1,
  },
  textoContainer: {
    width: '60%',
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
  },
  ubicationContainer: {},
  textContent: {
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    color: '#fff',
    lineHeight: 27,
  },
  botonContainer: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  stretch: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
});

export default CardBuscar;

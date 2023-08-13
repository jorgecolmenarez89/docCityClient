import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Image} from '@rneui/themed';

const Items = ({navigation}: any) => {
  const [items, setItems] = useState([
    {
      icon: '',
      name: 'Mis Consultas',
      url: require('../../assets/icono-consultas.png'),
      route: 'Home',
      screen: 'HomeConsultas',
    },
    {
      icon: '',
      name: 'Mis familiares',
      url: require('../../assets/icono-familia.png'),
      route: 'Home',
      screen: 'HomeCargaList',
    },
    {
      icon: '',
      name: 'Mis Vacunas',
      url: require('../../assets/icono-vacunas.png'),
      route: 'Home',
      screen: 'HomeVacunas',
    },
    {
      icon: '',
      name: 'Mi GiftCare',
      url: require('../../assets/icono-giftCare.png'),
      route: 'Home',
      screen: 'HomeInstrumentos',
    },
  ]);

  return (
    <View style={styles.container}>
      {items.map((item, i) => (
        <View key={'item-w' + i} style={styles.item}>
          {/*<View style={styles.round}></View> */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(item.screen);
            }}>
            <Image style={{width: 70, height: 70}} source={item.url} />
          </TouchableOpacity>
          <View style={styles.contenText}>
            <Text style={styles.textItem}>{item.name}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default Items;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
  },
  item: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  round: {
    height: 70,
    width: 70,
    borderRadius: 50,
    backgroundColor: '#efeeff',
  },
  contenText: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
  textItem: {
    color: '#040303',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
  },
});

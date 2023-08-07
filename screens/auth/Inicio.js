import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button, Image} from '@rneui/themed';

function Inicio({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.contentImg}>
        <Image style={styles.stretch} source={require('../../assets/veidt-home.png')} />
      </View>
      <View style={styles.contentInfo}>
        <Text style={styles.title}>Permítenos atenderte desde tu ubicación</Text>
        <Text style={styles.subTitle}>
          Con tu aplicación VEiDT podrás solicitar consultas médicas desde donde te encuentres
        </Text>
        <View style={styles.contentButton}>
          <Button
            raised={false}
            title='Empecemos'
            buttonStyle={{
              backgroundColor: '#0b445e',
              borderRadius: 30,
              height: 50,
            }}
            titleStyle={{
              fontFamily: 'Poppins-Bold',
              fontSize: 20,
            }}
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      </View>
    </View>
  );
}

export default Inicio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f8fe',
  },
  contentImg: {
    backgroundColor: '#f1f8fe',
    height: '60%',
  },
  contentInfo: {
    display: 'flex',
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: '40%',
    paddingHorizontal: 30,
  },
  contentButton: {
    width: '100%',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    color: '#1a1a1a',
    fontSize: 24,
    marginVertical: 10,
  },
  subTitle: {
    fontFamily: 'Poppins-Medium',
    color: '#7d7d7d',
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 20,
  },
  img: {
    width: '100%',
  },
  stretch: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

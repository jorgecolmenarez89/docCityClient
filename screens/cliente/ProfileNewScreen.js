import React, {useEffect, useState, useContext} from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar} from 'react-native';
import {Button, Icon, Image} from '@rneui/themed';
import CardGrey from '../../components/perfil/CardGrey';

import {AuthContext} from '../../context/AuthContext';
import {updateUserInfo} from '../../services/doctor/profile';

function ProfileNewScreen({navigation}) {
  const {logout} = useContext(AuthContext);
  const {changeUserLoged, userLoged} = useContext(AuthContext);

  const [fileData, setFileData] = useState(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [sex, setSex] = useState('');
  const [loading, setLoading] = useState(false);
  const [defaultSex, setDefaultSex] = useState('');

  useEffect(() => {
    setFullName(userLoged.fullName);
    setPhone(userLoged.phoneNumber);
    setSex(userLoged.sexo);
    setDefaultSex(userLoged.sexo);
  }, []);

  const getImage = () => {
    if (userLoged.url && userLoged.url != '') {
      return {uri: userLoged.url};
    } else {
      return require('../../assets/user-icon.png');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.titleContainer}>
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text style={styles.title}>Mi Perfil</Text>
          </View>
          <View
            style={{
              position: 'absolute',
              right: 0,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{fontFamily: 'Poppins-SemiBold', color: '#163539'}}>Salir</Text>
            <Icon
              name='log-out-outline'
              color='#163539'
              size={30}
              type='ionicon'
              onPress={() => {
                logout();
              }}
            />
          </View>
        </View>

        <View style={styles.spacer}></View>

        <View style={styles.namesContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={getImage()}
              style={{
                width: 60,
                height: 70,
                borderRadius: 6,
              }}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.titleCard}>{fullName}</Text>
            <View style={styles.botonContainer}>
              <Button
                raised={false}
                buttonStyle={{
                  backgroundColor: '#0caec6',
                  borderRadius: 6,
                  height: 30,
                  padding: 0,
                  width: 125,
                }}
                titleStyle={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 17,
                }}
                onPress={() => navigation.navigate('ProfileEditS')}>
                ACTUALIZAR
              </Button>
            </View>
          </View>
        </View>

        <View style={styles.spacer}></View>

        <View style={styles.subContainer}>
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}>
            <Text style={styles.title}>Informacion de Interes</Text>
          </View>
        </View>
        <View style={styles.spacer}></View>

        <CardGrey
          title='Mis Consultas'
          options={['Lorem Ipsum']}
          onPressEvent={() => navigation.navigate('ConsultasS')}
        />
        <View style={styles.spacer}></View>
        <CardGrey
          title='Mis Vacunas'
          options={['Lorem Ipsum']}
          onPressEvent={() => navigation.navigate('VacunasS')}
        />
        <View style={styles.spacer}></View>
        <CardGrey
          title='Mis Instumentos de Pago'
          options={['Lorem Ipsum']}
          onPressEvent={() => navigation.navigate('InstrumentosS')}
        />
        <View style={styles.spacer}></View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ProfileNewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fc',
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 20,
  },
  titleContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  subContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    color: '#1a1a1a',
    fontFamily: 'Poppins-SemiBold',
  },
  spacer: {
    marginVertical: 8,
  },
  namesContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#005d81',
    borderRadius: 10,
  },
  imageContainer: {
    marginRight: 10,
    backgroundColor: '#d8d8d8',
    padding: 5,
    borderRadius: 6,
  },
  textContainer: {
    display: 'flex',
  },
  botonContainer: {
    width: 'auto',
    marginTop: 10,
  },
  titleCard: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
});

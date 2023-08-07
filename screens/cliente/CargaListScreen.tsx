import React, {useEffect, useState, useRef, useContext, useMemo} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {View, Text, FlatList, Alert, StyleSheet} from 'react-native';
import {Button, Image, FAB} from '@rneui/themed';
import {RootStackParamList} from '../../config/Types';
import User from '../../models/User';
import {getCargas} from '../../services/user/carga';
import Relative from '../../components/home/Relative';
import {AuthContext} from '../../context/AuthContext';
import {useLocation} from '../../hooks/useLocation';
import {updateUserInfo} from '../../services/doctor/profile';

type CargaListScreenProps = NativeStackScreenProps<RootStackParamList>;

function CargaListScreen({navigation}: CargaListScreenProps) {
  const {userLoged, changeUserLoged, hasTriaje} = useContext(AuthContext);
  const {getCurrentLocation} = useLocation();
  const [relatives, setRelatives] = useState<User[]>([]);
  const listCargas = useRef<FlatList<User>>(null);
  const [busco, setBusco] = useState<boolean>(false);
  const [coordinantes, setCoordinates] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingOmitir, setLoadingOmitir] = useState<boolean>(false);

  const nav = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getRelatives();
    }
  }, [isFocused]);

  useEffect(() => {
    updatePosition();
    getRelatives();
  }, []);

  const getRelatives = async () => {
    try {
      const {data} = await getCargas(userLoged.id);
      setRelatives(data.userChildren);
      setBusco(true);
    } catch (error) {
      console.log(error);
    }
  };

  const updatePosition = async () => {
    const {latitude, longitude} = await getCurrentLocation();
    setCoordinates(`${latitude},${longitude}`);
  };

  const handleOmitir = () => {
    navigation.navigate('ConfirmTriaje');
    //setLoadingOmitir(true);
  };

  const onContinue = () => {
    setLoadingOmitir(true);
    updateData();
  };

  const updateData = async () => {
    try {
      const bodyUser = {
        id: userLoged.id,
        userName: userLoged.userName,
        email: userLoged.email,
        fullName: userLoged.fullName,
        colegioMedicoId: userLoged.colegioMedicoId,
        experienceYears: userLoged.experienceYears,
        medicalSpecialityId: userLoged.medicalSpecialityId,
        sexo: userLoged.sexo,
        isAuthorizedDoctor: false,
        phoneNumber: userLoged.phoneNumber,
        deviceToken: userLoged.deviceToken,
        geoLocation: coordinantes,
        url: '',
        urlCredential: '',
        isLocalizable: false,
        statusDoctor: '',
        statusDoctorDescription: '',
        isCompletedInfo: true,
        age: userLoged.age,
        birthDate: userLoged.userLoged,
      };
      await updateUserInfo(bodyUser);
      changeUserLoged({...userLoged, ...bodyUser});
      setLoadingOmitir(false);
      Alert.alert('Exito', 'Datos actualizados correctamente');
    } catch (error) {
      console.log('error', error);
      setLoadingOmitir(false);
      Alert.alert('Error', 'Ocurrio un error intente nuevamente');
    }
  };

  return (
    <View style={styles.container}>
      {busco && relatives.length == 0 && (
        <View style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
          <View style={styles.contentButton}>
            <View style={{width: '100%', display: 'flex', height: 'auto'}}>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Bienvenido a </Text>
                <Image style={{width: 140, height: 70}} source={require('../../assets/icon.png')} />
              </View>
              <View style={styles.header}>
                <Text style={styles.headerText}>Para comenzar puedes</Text>
              </View>
              <View style={styles.contentButtonItem}>
                <Button
                  raised={false}
                  title='Agregar familiar'
                  buttonStyle={{
                    backgroundColor: '#0b445e',
                    borderRadius: 30,
                    height: 50,
                  }}
                  titleStyle={{
                    fontFamily: 'Poppins-Bold',
                    fontSize: 17,
                  }}
                  onPress={() => navigation.navigate('CargaAdd')}
                />
              </View>
              {!hasTriaje && (
                <View style={styles.contentButtonItem}>
                  <Button
                    raised={false}
                    title='Completar triaje'
                    buttonStyle={{
                      backgroundColor: '#0b445e',
                      borderRadius: 30,
                      height: 50,
                    }}
                    titleStyle={{
                      fontFamily: 'Poppins-Bold',
                      fontSize: 18,
                    }}
                    onPress={() => handleOmitir()}
                    loading={loadingOmitir}
                  />
                </View>
              )}

              {hasTriaje && (
                <View style={styles.contentButtonItem2}>
                  <Text style={styles.headerMesasge}>Has completado el formulario de Triaje</Text>
                  <Button
                    raised={false}
                    title='Continuar'
                    containerStyle={{
                      width: '100%',
                    }}
                    buttonStyle={{
                      backgroundColor: '#0b445e',
                      borderRadius: 30,
                      height: 50,
                    }}
                    titleStyle={{
                      fontFamily: 'Poppins-Bold',
                      fontSize: 18,
                    }}
                    onPress={() => onContinue()}
                    loading={loadingOmitir}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {busco && relatives.length > 0 && (
        <View style={{flex: 1, display: 'flex', paddingHorizontal: 10, width: '100%'}}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Mis Familiares</Text>
          </View>

          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
            <View style={styles.contentButtonItem}>
              <Button
                raised={false}
                title='Agregar +'
                buttonStyle={{
                  backgroundColor: '#0b445e',
                  borderRadius: 30,
                  height: 50,
                  paddingHorizontal: 20,
                }}
                titleStyle={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 17,
                }}
                onPress={() => navigation.navigate('CargaAdd')}
              />
            </View>
            <View style={styles.contentButtonItem}>
              {!hasTriaje && (
                <Button
                  raised={false}
                  title='Mi triaje'
                  buttonStyle={{
                    backgroundColor: '#0b445e',
                    borderRadius: 30,
                    height: 50,
                    width: 130,
                  }}
                  titleStyle={{
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 18,
                  }}
                  onPress={() => handleOmitir()}
                  loading={loadingOmitir}
                />
              )}
              {hasTriaje && (
                <Button
                  raised={false}
                  title='Continuar'
                  buttonStyle={{
                    backgroundColor: '#0b445e',
                    borderRadius: 30,
                    height: 50,
                    width: 130,
                  }}
                  titleStyle={{
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 18,
                  }}
                  onPress={() => onContinue()}
                  loading={loadingOmitir}
                />
              )}
            </View>
          </View>

          <View style={{flex: 1, marginTop: 15}}>
            <FlatList
              ref={listCargas}
              data={relatives}
              extraData={relatives}
              renderItem={({item, index}: {item: any; index: number}) => {
                return (
                  <Relative
                    key={'ralative' + index}
                    name={item.fullName}
                    relation={item.parentesco}
                    age={item.age}
                    onClick={() => {
                      navigation.navigate('CargaDetail', {
                        id: item.id,
                      });
                    }}
                  />
                );
              }}
              ItemSeparatorComponent={() => <View style={{height: 5}}></View>}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#red',
  },
  header: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    color: '#15193f',
    fontFamily: 'Poppins-SemiBold',
  },
  headerText: {
    fontSize: 18,
    color: '#15193f',
    fontFamily: 'Poppins-SemiBold',
  },
  headerMesasge: {
    fontSize: 16,
    color: '#15193f',
    fontFamily: 'Poppins-SemiBold',
  },
  contentButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentButtonItem: {
    paddingHorizontal: 10,
    marginVertical: 7,
  },
  contentButtonItem2: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 7,
  },
});

export default CargaListScreen;

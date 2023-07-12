import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Linking,
  Modal,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SelectDropdown from 'react-native-select-dropdown';
import {Button, ButtonGroup, useTheme, Dialog, Image, ListItem, Avatar} from '@rneui/themed';
import {getEspecialities} from '../../services/doctor/medicine';
import MapCustom from '../../components/atoms/maps';
import {Card} from '@rneui/themed';
import {ASSETS} from '../../config/Constant';
import {mostrarUbicaciones} from '../../services/doctor/ubicaciones';
import Doctor from '../../models/Doctor';
import {Icon} from '@rneui/base';
import {sendNotificationRequest} from '../../services/doctor/notification';
import {AuthContext} from '../../context/AuthContext';
import {checkMoney} from '../../services/user/gitfcare';
import {getCargas} from '../../services/user/carga';

function SearchScreen({navigation}) {
  const isFocused = useIsFocused();
  const {theme} = useTheme();
  const {userLoged, token, getEspecialitiesAll, specialities} = useContext(AuthContext);
  const [locationUser, setLocationUser] = useState();
  const [especialidadId, setEspecialidadId] = useState();
  const [doctors, setDoctors] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(true);
  const [openDialog, setOpenDialog] = useState(true);
  const [messageDialog, setMessageDialog] = useState('');
  const [reesponseGC, setResponseGC] = useState({
    success: false,
    found: 0,
    message: '',
    todoOk: false,
  });
  const [gifCareData, setGifCareData] = useState(null);
  const url = 'https://play.google.com/store/apps/details?id=com.veidthealth.giftcareapp&pli=1';
  const [relatives, setRelatives] = useState([]);

  const [modalRelative, setModalRelative] = useState(false);

  useEffect(() => {
    console.log('isFocused');
    if (isFocused) {
      tryAgain();
    }
  }, [isFocused]);

  useEffect(() => {
    getEspecialitiesAll();
    getRelatives();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log('useCallback');
      getSaldo();
    }, []),
  );

  const getRelatives = async () => {
    try {
      const {data} = await getCargas(userLoged.id);
      //setRelatives(data.userChildren);
      setRelatives([
        {
          id: '351718e9-3d45-483b-862d-7324ae656f33',
          parentUserId: 'b7453b26-8189-44ab-a6ee-4f726c014dc3',
          userName: 'andresito',
          email: 'andresito@hotmail.com',
          fullName: 'Andrez nuñez',
          sexo: '',
          phoneNumber: null,
          deviceToken:
            'eDLxjG51SAGtMIkqzjj4Bu:APA91bH_NwfeVrOjxhCn9Hn7Eu2_QJkvKFDgur1lBn2ek1NVO9ZfW_lO_ESF-YEQY_YJFOvoRWJVE97ZI0htkUF504UYap2MYAE7cJkB8eICaEd1xMCtHGv_RyWmzVnRuCeqHTl3ItpX',
          geoLocation: null,
          url: null,
          urlCredential: null,
        },
        {
          id: 'eb33bef5-e61e-4eec-9e68-cc1002c7a487',
          parentUserId: 'b7453b26-8189-44ab-a6ee-4f726c014dc3',
          userName: 'test',
          email: 'test1@gmail.com',
          fullName: 'Test infante',
          sexo: '',
          phoneNumber: null,
          deviceToken:
            'eDLxjG51SAGtMIkqzjj4Bu:APA91bH_NwfeVrOjxhCn9Hn7Eu2_QJkvKFDgur1lBn2ek1NVO9ZfW_lO_ESF-YEQY_YJFOvoRWJVE97ZI0htkUF504UYap2MYAE7cJkB8eICaEd1xMCtHGv_RyWmzVnRuCeqHTl3ItpX',
          geoLocation: null,
          url: null,
          urlCredential: null,
        },
        {
          id: 'edaaa0ef-9067-47dd-979d-bd4d3f45d5b3',
          parentUserId: 'b7453b26-8189-44ab-a6ee-4f726c014dc3',
          userName: 'santiaguito',
          email: 'lamentem1@gmail.com',
          fullName: 'Santiago Rojas',
          sexo: '',
          phoneNumber: null,
          deviceToken:
            'eDLxjG51SAGtMIkqzjj4Bu:APA91bH_NwfeVrOjxhCn9Hn7Eu2_QJkvKFDgur1lBn2ek1NVO9ZfW_lO_ESF-YEQY_YJFOvoRWJVE97ZI0htkUF504UYap2MYAE7cJkB8eICaEd1xMCtHGv_RyWmzVnRuCeqHTl3ItpX',
          geoLocation: null,
          url: null,
          urlCredential: null,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const buildMesage = balance => {
    if (balance === 0) {
      return 'Detectamos tu tarjeta sin embargo no posee fondos, debereas recargar el mismo desde la app GiftCare';
    } else if (balance > 0 && balance < 10) {
      return 'Detectamos tu tarjeta sin embargo no posee monto minimo para una consulta, debereas recargar el mismo desde la app GiftCare';
    } else {
      return 'Fondos suficientes, presiona continuar para realizar la busqueda';
    }
  };

  const getSaldo = async () => {
    setLoadingCheck(true);
    setOpenDialog(true);
    try {
      const response = await checkMoney(userLoged.email);
      setGifCareData(response.data);
      setResponseGC({
        success: true,
        found: response.data.balance,
        message: buildMesage(response.data.balance),
        todoOk: response.data.balance < 10 ? false : true,
      });
      setLoadingCheck(false);
    } catch (error) {
      console.log('error dado', error);
      if (error.response.status === 404) {
        setResponseGC({
          success: false,
          found: -400,
          message: 'No posees tarjeta GiftCare con tu cuenta de Correo, puedes:',
          todoOk: false,
        });
        setLoadingCheck(false);
      } else {
        setResponseGC({
          success: false,
          found: -500,
          message: 'Ha Ocurrido un error intente nuevamente',
          todoOk: false,
        });
        setLoadingCheck(false);
      }
    }
  };

  const resetSearch = async () => {
    setEspecialidadId(undefined);
    setLocationUser(undefined);
    setDoctors(undefined);
  };

  const handleSearch = async () => {
    setLoading(true);
    const {status, data} = await mostrarUbicaciones({
      user: locationUser,
      especialidadId,
    });
    if (status === 200) {
      const newDoctors = data.map(doctor => new Doctor(Doctor.formatData(doctor)));
      setDoctors(newDoctors);
      const result = await sendNotificationRequest({
        doctors: newDoctors,
        user: {...userLoged, deviceToken: token},
      });
    } else {
      Alert.alert('Error', 'No fue posible enviar la información por el momento');
    }
    setLoading(false);
  };

  const validButton = () => {
    if (especialidadId !== undefined && locationUser !== undefined) {
      return false;
    }
    return true;
  };

  const tryAgain = () => {
    setLoadingCheck(true);
    getSaldo();
  };

  const handleContinue = () => {
    /*if(relatives.length > 0){
      setModalRelative(true)
    } else {
      setOpenDialog(false);
    }*/
    setModalRelative(true);
  };

  const selectedRelative = relative => {
    console.log(relative);
  };

  const forMe = () => {};

  return (
    <View style={styles.container}>
      <MapCustom
        isSearch={!doctors}
        markers={doctors && doctors.map(doctor => doctor.marker())}
        renderBottom={
          doctors && (
            <Button
              icon={<Icon type='ionicon' name='arrow-back-outline' color='white' />}
              onPress={() => resetSearch()}
              containerStyle={{
                height: 50,
                width: 50,
                borderRadius: 10,
                marginTop: 10,
                marginBottom: 10,
              }}
              buttonStyle={{
                height: '100%',
                width: '100%',
              }}
            />
          )
        }
        onChangeLocation={region =>
          setLocationUser({
            latitude: region.latitude,
            longitude: region.longitude,
          })
        }>
        {!doctors && (
          <View style={styles.overlaySearch}>
            <SelectDropdown
              data={specialities}
              onSelect={(selectedItem, index) => {
                setEspecialidadId(selectedItem.id);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.name;
              }}
              rowTextForSelection={(item, index) => {
                return item.name;
              }}
              buttonStyle={styles.dropdown1BtnStyle}
              buttonTextStyle={styles.dropdown1BtnTxtStyle}
              renderDropdownIcon={isOpened => {
                return (
                  <FontAwesome
                    name={isOpened ? 'chevron-up' : 'chevron-down'}
                    color={'#9fa0af'}
                    size={16}
                  />
                );
              }}
              dropdownIconPosition={'right'}
              dropdownStyle={styles.dropdown1DropdownStyle}
              rowStyle={styles.dropdown1RowStyle}
              rowTextStyle={styles.dropdown1RowTxtStyle}
              defaultButtonText={'Especialidad Médica'}
            />
          </View>
        )}
      </MapCustom>

      {!doctors && (
        <View style={styles.inputContent}>
          <Button
            title='Buscar'
            disabled={validButton()}
            onPress={() => handleSearch()}
            color={theme.colors.primary}
            buttonStyle={{
              borderRadius: 10,
              height: 50,
              marginTop: 10,
            }}
            titleStyle={{
              fontFamily: 'Poppins-SemiBold',
            }}
            loading={loading}
          />
        </View>
      )}

      <Dialog isVisible={openDialog} onBackdropPress={() => {}}>
        <Dialog.Title title='Verificando Saldo' />
        {loadingCheck && <Dialog.Loading />}
        {!loadingCheck && (
          <View style={{display: 'flex', width: '100%'}}>
            {!reesponseGC.success && reesponseGC.found === -400 && (
              <View style={styles.styleResponse}>
                <Text>{reesponseGC.message}</Text>
                <View style={{width: '100%', display: 'flex', alignItems: 'center', marginTop: 15}}>
                  <Image
                    source={require('../../assets/google-play.png')}
                    style={{
                      height: 70,
                      width: 70,
                    }}
                  />
                  <Button
                    title='Descargar desde Play Store'
                    type='clear'
                    onPress={async () => {
                      await Linking.openURL(url);
                    }}
                  />
                  <Dialog.Actions>
                    <Dialog.Button title='Cancelar' onPress={() => navigation.navigate('Home')} />
                    <Dialog.Button
                      title='Volver a intentar'
                      onPress={() => {
                        tryAgain();
                      }}
                    />
                  </Dialog.Actions>
                </View>
              </View>
            )}
            {!reesponseGC.success && reesponseGC.found === -500 && (
              <View style={styles.styleResponse}>
                <Text>{reesponseGC.message}</Text>
                <Dialog.Actions>
                  <Dialog.Button
                    title='Volver a intentar'
                    onPress={() => {
                      tryAgain();
                    }}
                  />
                </Dialog.Actions>
              </View>
            )}
            {reesponseGC.success && !reesponseGC.todoOk && (
              <View style={styles.styleResponse}>
                <Text>{reesponseGC.message}</Text>
                <Dialog.Actions>
                  <Dialog.Button
                    title='Salir de esta pantalla'
                    onPress={() => {
                      navigation.navigate('Home');
                    }}
                  />
                </Dialog.Actions>
              </View>
            )}
            {reesponseGC.success && reesponseGC.todoOk && (
              <View style={styles.styleResponse}>
                <Text>{reesponseGC.message}</Text>
                <Dialog.Actions>
                  <Dialog.Button
                    title='Continuar'
                    onPress={() => {
                      handleContinue();
                    }}
                  />
                </Dialog.Actions>
              </View>
            )}
          </View>
        )}
      </Dialog>

      <Modal
        animationType='slide'
        transparent={true}
        visible={modalRelative}
        onRequestClose={() => {
          setModalRelative(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{width: '100%', display: 'flex', alignItems: 'center', marginBottom: 7}}>
              <Text style={styles.modalTitle}>Para quien es la Consulta ?</Text>
            </View>
            <View style={{width: '100%', display: 'flex'}}>
              <Button
                title='Es para mi'
                type='clear'
                onPress={() => {
                  forMe();
                }}
              />
              <View>
                <Text style={styles.titleFamiliar}>Para un Familiar</Text>
              </View>

              {relatives.map((r, i) => (
                <ListItem
                  key={r.id}
                  Component={TouchableOpacity}
                  onPress={() => {
                    selectedRelative(r);
                  }}
                  bottomDivider
                  containerStyle={{
                    paddingVertical: 6,
                  }}>
                  <Avatar source={require('../../assets/user-icon.png')} />
                  <ListItem.Content>
                    <ListItem.Title>{r.fullName}</ListItem.Title>
                    <ListItem.Subtitle>Patentezco</ListItem.Subtitle>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    height: '100%',
    width: '100%',
  },
  wrapper: {
    paddingHorizontal: 30,
    marginTop: 50,
  },
  inputContent: {
    marginBottom: 12,
    marginHorizontal: 10,
  },
  dropdown1BtnStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  dropdown1BtnTxtStyle: {color: '#83859a', textAlign: 'left'},
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
  dropdownsearchInputStyleStyle: {
    backgroundColor: '#66bfc5',
    borderBottomWidth: 1,
    borderBottomColor: '#FFF',
  },
  title: {
    fontSize: 22,
    color: '#15193f',
    fontFamily: 'Poppins-SemiBold',
  },
  overlaySearch: {
    //backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  payContainer: {},
  payCard: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    elevation: 0,
  },
  styleResponse: {
    width: '100%',
    display: 'flex',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '85%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 2,
    paddingVertical: 15,
    paddingHorizontal: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    color: '#15193f',
    fontFamily: 'Poppins-Medium',
  },
  titleFamiliar: {
    fontSize: 16,
    color: '#15193f',
    fontFamily: 'Poppins-Regular',
  },
});

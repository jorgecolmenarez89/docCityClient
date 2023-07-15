import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Linking,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import {Popover, Button as Butt, Divider} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SelectDropdown from 'react-native-select-dropdown';
import {Button, ButtonGroup, useTheme, Dialog, Image, ListItem, Avatar} from '@rneui/themed';
import {getEspecialities} from '../../services/doctor/medicine';
import MapCustom from '../../components/atoms/maps';
import {NAME_ICON} from '../../config/Constant';
import {
  mostrarUbicaciones,
  mostrarUbicacionesByDescription,
  mostrarUbicacionesByRegion,
} from '../../services/doctor/ubicaciones';
import Doctor from '../../models/Doctor';
import {sendNotificationRequest} from '../../services/doctor/notification';
import {AuthContext} from '../../context/AuthContext';
import MapFilterComponet from '../../components/molecules/MapFilter';
import {onSaveSearch} from '../../services/doctor/request';
import {checkMoney} from '../../services/user/gitfcare';
import {getCargas} from '../../services/user/carga';
import {getTriaje} from '../../services/doctor/triaje';

function SearchScreen({navigation}) {
  const isFocused = useIsFocused();
  const {theme} = useTheme();
  const {userLoged, token, getEspecialitiesAll, specialities, userSelected, setUserSelected} =
    useContext(AuthContext);
  const [locationUser, setLocationUser] = useState();
  const [filterValues, setFilterValues] = useState({
    specialtyId: undefined,
    regionId: undefined,
    description: '',
  });
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
  const [loadingTriaje, setLoadingTriaje] = useState(false);
  const [modalTriaje, setModalTriaje] = useState(false);
  const [dataTriaje, setDataTriaje] = useState({
    success: false,
    message: '',
    expirate: false,
  });

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
      setRelatives(data.userChildren);
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
        found: 30, //response.data.balance,
        message: buildMesage(30), // buildMesage(response.data.balance),
        todoOk: true, //response.data.balance < 10 ? false : true,
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
    setFilterValues({
      specialtyId: undefined,
      regionId: undefined,
      description: '',
    });
    setLocationUser(undefined);
    setDoctors(undefined);
  };

  const handleSearch = async () => {
    setLoading(true);
    let status;
    let data;
    let typeSearch;

    try {
      if (filterValues.specialtyId) {
        const {status: sta, data: dat} = await mostrarUbicaciones({
          user: locationUser,
          especialidadId: filterValues.specialtyId,
        });
        status = sta;
        data = dat;
        typeSearch = 'specialty';
      } else if (filterValues.regionId) {
        const {status: sta, data: dat} = await mostrarUbicacionesByRegion({
          user: locationUser,
          regionId: filterValues.regionId,
        });
        status = sta;
        data = dat;
        typeSearch = 'region';
      } else if (filterValues.description) {
        const {status: sta, data: dat} = await mostrarUbicacionesByDescription({
          user: locationUser,
          description: filterValues.description,
        });
        status = sta;
        data = dat;
        typeSearch = 'description';
      }

      console.log('handleSearch() ==> ', {status, data});
      if (status === 200) {
        if (data && data.length > 0) {
          const newDoctors = data.map(doctor => new Doctor(Doctor.formatData(doctor)));
          setDoctors(newDoctors);
          const {status: statusOne, data: dataOne} = await onSaveSearch({
            status: 'green',
            user: userLoged,
            doctors: data,
            type: typeSearch,
            data: filterValues.description,
          });
          if (statusOne === 200) {
            //console.log('handleSearch() ==>', {dataOne});
            const result = await sendNotificationRequest({
              doctors: newDoctors,
              user: {...userLoged, deviceToken: token},
              idSearch: dataOne.data.id,
            });
          }
        } else {
          setDoctors(undefined);
          Alert.alert(
            'No hay resultados',
            'No se encontró ningún medico que coincida con tu búsqueda.',
          );
        }
      } else {
        Alert.alert('Error', 'No fue posible enviar la información por el momento');
      }
    } catch (err) {
      console.log('handleSearch() ==> err', {err});
    }

    setLoading(false);
  };

  const validButton = () => {
    if (
      (filterValues.specialtyId !== undefined ||
        filterValues.regionId !== undefined ||
        filterValues.description !== '') &&
      locationUser !== undefined
    ) {
      return false;
    }
    return true;
  };

  const tryAgain = () => {
    setLoadingCheck(true);
    getSaldo();
  };

  const handleContinue = () => {
    if (relatives.length > 0) {
      setModalRelative(true);
      setOpenDialog(false);
    } else {
      setUserSelected(userLoged);
      checkTriaje(userLoged);
      setOpenDialog(false);
    }
  };

  const selectedRelative = relative => {
    setUserSelected(relative);
    setModalRelative(false);
    checkTriaje(relative);
  };

  const forMe = () => {
    setUserSelected(userLoged);
    setModalRelative(false);
    checkTriaje(userLoged);
  };

  const checkTriaje = async user => {
    setModalTriaje(true);
    setLoadingTriaje(true);
    try {
      const {data} = await getTriaje(user.id);
      setDataTriaje({
        success: true,
        message: 'Se ha verificado el Triaje',
        expirate: false,
      });
      setLoadingTriaje(false);
    } catch (error) {
      console.log('error en triaje', error);
      setDataTriaje({
        success: false,
        message: 'No has llenado el Formulario de triaje',
        expirate: false,
      });
      setLoadingTriaje(false);
    }
  };

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
          <MapFilterComponet values={filterValues} onChangeValues={setFilterValues} onlyOneFilter />
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
                    title='Salir'
                    onPress={() => {
                      navigation.navigate('Home');
                    }}
                  />
                  <Dialog.Button
                    title='Reintentar'
                    onPress={() => {
                      tryAgain();
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

      <Modal
        animationType='slide'
        transparent={true}
        visible={modalTriaje}
        onRequestClose={() => {
          setModalTriaje(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {loadingTriaje && (
              <View style={{width: '100%', display: 'flex', alignItems: 'center'}}>
                <Text style={styles.modalTitle}>Verificando Triaje</Text>
                <ActivityIndicator size={50} color='black' />
              </View>
            )}

            {!loadingTriaje && (
              <>
                <View
                  style={{width: '100%', display: 'flex', alignItems: 'center', marginBottom: 7}}>
                  <Text style={styles.modalTitle}>{dataTriaje.message}</Text>
                </View>

                {dataTriaje.success && (
                  <View style={{width: '100%', display: 'flex'}}>
                    <Button
                      title='Aceptar'
                      type='clear'
                      onPress={() => {
                        setModalTriaje(false);
                      }}
                    />
                  </View>
                )}
                {!dataTriaje.success && (
                  <View
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}>
                    <Button
                      title='Reintentar'
                      type='clear'
                      onPress={() => {
                        tryAgain();
                      }}
                    />

                    <Button
                      title='Completar Triaje'
                      type='clear'
                      onPress={() => {
                        if (relatives.length > 0) {
                          navigation.navigate('Profile', {
                            screen: 'CargaDetailP',
                            params: {
                              id: userSelected.id,
                            },
                          });
                        } else {
                          navigation.navigate('TriajeSC');
                        }
                      }}
                    />
                  </View>
                )}
              </>
            )}
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
    marginTop: 10,
    marginBottom: 12,
    marginHorizontal: 10,
  },
  dropdown1BtnStyle: {
    //width: '100%',
    flex: 1,
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
    //backgroundColor: 'cyan',
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    position: 'relative',
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
    paddingHorizontal: 15,
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

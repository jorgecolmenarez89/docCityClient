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
import {Button, ButtonGroup, useTheme, Dialog, Image, ListItem, Avatar, Icon} from '@rneui/themed';
import {getEspecialities} from '../../services/doctor/medicine';
import MapCustom from '../../components/atoms/maps';
import {DEVELOPED, NAME_ICON} from '../../config/Constant';
import {
  mostrarUbicaciones,
  mostrarUbicacionesByDescription,
  mostrarUbicacionesByRegion,
  mostrarUbicacionesByRegionAndSpeciality,
} from '../../services/doctor/ubicaciones';
import Doctor from '../../models/Doctor';
import {sendNotificationRequest} from '../../services/doctor/notification';
import {AuthContext} from '../../context/AuthContext';
import MapFilterComponet from '../../components/molecules/MapFilter';
import {onSaveSearch} from '../../services/doctor/request';
import {checkMoney, checkSaldo} from '../../services/user/gitfcare';
import {getCargas} from '../../services/user/carga';
import {getTriaje} from '../../services/doctor/triaje';
import {getAllChatsByActives} from '../../services/user/chat';

function SearchScreen({navigation}) {
  const isFocused = useIsFocused();
  const {theme} = useTheme();
  const {
    userLoged,
    token,
    getEspecialitiesAll,
    specialities,
    userSelected,
    setUserSelected,
    giftCareDataContext,
    setGiftCareDataContext,
  } = useContext(AuthContext);
  const [locationUser, setLocationUser] = useState();
  const [filterValues, setFilterValues] = useState({
    specialtyId: undefined,
    regionId: undefined,
    description: '',
    extends: false,
  });

  const [extendida, setExtendida] = useState(false);
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
  const [isBusy, setIsBusy] = useState(false);

  const isChatsActives = async () => {
    const {status, data} = await getAllChatsByActives(userLoged.id);

    if (status) {
      if (data.length > 0) {
        setIsBusy(true);
      }
    } else {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      isChatsActives();
      //getSaldo();
    }
  }, [isFocused]);

  useEffect(() => {
    isChatsActives();
    getEspecialitiesAll();
    getRelatives();
  }, []);

  useEffect(() => {
    if (userLoged) {
      setUserSelected(userLoged);
      //checkTriaje(userLoged);
    }
  }, [userLoged]);

  /*useFocusEffect(
    React.useCallback(() => {
      getSaldo();
    }, []),
  );*/

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
      const dataResponse = response.data;
      setGifCareData(dataResponse);
      setGiftCareDataContext(dataResponse);
      const {data} = await checkSaldo(10, dataResponse.id);
      if (data.existeTarjetaConSaldo) {
        setResponseGC({
          success: true,
          found: response.data.balance,
          message: buildMesage(response.data.balance),
          todoOk: true,
        });
      } else {
        setResponseGC({
          success: true,
          found: 1,
          message: buildMesage(1),
          todoOk: false,
        });
      }
      setLoadingCheck(false);
    } catch (error) {
      console.log('error dado', error);
      if (error.response.status === 404) {
        if (!DEVELOPED) {
          setResponseGC({
            success: false,
            found: -400,
            message: 'No posees tarjeta GiftCare con tu cuenta de Correo, puedes:',
            todoOk: false,
          });
        } else {
          setResponseGC({
            success: true,
            found: 30,
            message: buildMesage(30),
            todoOk: true,
          });
        }
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
    console.log('handleSearch() ==> ', {filterValues, locationUser, extendida});

    try {
      // Determinar el tipo de búsqueda y función a llamar
      const searchConfig = getSearchConfig();
      if (!searchConfig) {
        setLoading(false);
        return;
      }

      const {status, data} = await searchConfig.searchFn();

      if (status !== 200) {
        Alert.alert('Error', 'No fue posible enviar la información por el momento');
        return;
      }

      // Procesar resultados
      if (!data || data.length === 0) {
        setDoctors(undefined);
        Alert.alert(
          'No hay resultados',
          'No se encontró ningún medico que coincida con tu búsqueda.',
        );
        return;
      }

      // Mapear doctores y guardar búsqueda
      const newDoctors = data.map(doctor => new Doctor(Doctor.formatData(doctor)));
      setDoctors(newDoctors);

      let saveSuccess = false;
      let notificationSuccess = false;
      // Intentar guardar la búsqueda
      try {
        const {status: saveStatus, data: saveData} = await onSaveSearch({
          status: 'green',
          user: userSelected,
          doctors: data,
          type: searchConfig.typeSearch,
          data: filterValues.description,
        });

        if (saveStatus === 200 && saveData?.data?.id) {
          saveSuccess = true;
          // Intentar enviar notificaciones
          try {
            const notificationResult = await sendNotificationRequest({
              doctors: newDoctors,
              user: {...userSelected, deviceToken: userSelected.deviceToken},
              idSearch: saveData.data.id,
            });

            if (notificationResult?.status === 200 || notificationResult?.success) {
              notificationSuccess = true;
              console.log('✅ Notificaciones enviadas exitosamente');
            } else {
              console.warn(
                '⚠️ Las notificaciones no se enviaron correctamente:',
                notificationResult,
              );
            }
          } catch (notificationError) {
            console.error(
              '❌ Error al enviar notificaciones:',
              notificationError.message || notificationError,
            );
          }
        } else {
          console.warn('⚠️ No se pudo guardar la búsqueda. Status:', saveStatus, 'Data:', saveData);
        }
      } catch (saveError) {
        console.error('❌ Error al guardar la búsqueda:', saveError.message || saveError);
      }

      // Log resumen de operaciones
      console.log('📊 Resumen de operaciones:', {
        busquedaCompletada: true,
        busquedaGuardada: saveSuccess,
        notificacionesEnviadas: notificationSuccess,
        doctoresEncontrados: newDoctors.length,
      });

      // Opcional: Mostrar una advertencia discreta si algo falló
      if (!saveSuccess || !notificationSuccess) {
        console.warn('⚠️ Algunas operaciones secundarias no se completaron correctamente');
      }
    } catch (err) {
      console.log('handleSearch() ==> err', {err});
      Alert.alert('Error', 'Ocurrió un error durante la búsqueda. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Función auxiliar para determinar la configuración de búsqueda
  const getSearchConfig = () => {
    if (filterValues.specialtyId) {
      if (extendida) {
        return {
          searchFn: () =>
            mostrarUbicacionesByRegionAndSpeciality({
              user: locationUser,
              regionId: filterValues.regionId,
              especialidadId: filterValues.specialtyId,
            }),
          typeSearch: 'specialty',
        };
      }
      return {
        searchFn: () =>
          mostrarUbicaciones({
            user: locationUser,
            especialidadId: filterValues.specialtyId,
          }),
        typeSearch: 'specialty',
      };
    }

    if (filterValues.description) {
      if (extendida) {
        return {
          searchFn: () =>
            mostrarUbicacionesByRegion({
              user: locationUser,
              regionId: filterValues.regionId,
            }),
          typeSearch: 'region',
        };
      }
      return {
        searchFn: () =>
          mostrarUbicacionesByDescription({
            user: locationUser,
            description: filterValues.description,
          }),
        typeSearch: 'description',
      };
    }

    return null;
  };

  const validButton = () => {
    // Validar que exista ubicación del usuario
    if (!locationUser) {
      return true;
    }

    // Validar que exista al menos un criterio de búsqueda
    const hasSearchCriteria =
      filterValues.specialtyId !== undefined || filterValues.description !== '';

    if (!hasSearchCriteria) {
      return true;
    }

    // Si es búsqueda extendida, validar que exista región
    if (extendida && !filterValues.regionId) {
      return true;
    }

    // Todas las validaciones pasaron
    return false;
  };

  const tryAgain = () => {
    setOpenDialog(true);
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
    setModalRelative(false);
    console.log(relative);
    if (!DEVELOPED) {
      setUserSelected(relative);
    }
    checkTriaje(relative);
  };

  const forMe = () => {
    setUserSelected(userLoged);
    setModalRelative(false);
    checkTriaje(userLoged);
    setModalRelative(false);
    setOpenDialog(false);
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
          <MapFilterComponet
            values={filterValues}
            onChangeValues={setFilterValues}
            onlyOneFilter
            onChangeExtendida={setExtendida}
          />
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

      {isBusy && (
        <Dialog isVisible={isBusy} onBackdropPress={() => {}}>
          <Dialog.Title title='Esta ocupado' />

          <Text>
            Estimado usuario, solo puedo realizar una consulta a la vez, por favor espere a que
            finalice la consulta actual.
          </Text>
        </Dialog>
      )}

      {/* Modal de verificacion de saldo
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
                      setOpenDialog(false);
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
      */}

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
                    <ListItem.Subtitle>{r.parentesco}</ListItem.Subtitle>
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

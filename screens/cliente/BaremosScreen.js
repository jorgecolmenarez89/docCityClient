import React, {ReactNode, useEffect, useRef, useState, useContext} from 'react';
import {StyleSheet, Text, Linking, View, Image, Dimensions, Modal, TextInput} from 'react-native';
import MapView, {Marker, MapMarkerProps, Region, LatLng, Callout} from 'react-native-maps';
import {Icon, useTheme, Button, Dialog} from '@rneui/themed';
import {useFocusEffect} from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useLocation} from '../../hooks/useLocation';
import {ASSETS, DEFAULT_REGION} from '../../config/Constant';
import {getCentersBaremos, getServices} from '../../services/doctor/centers';
import {checkMoney} from '../../services/user/gitfcare';
import {AuthContext} from '../../context/AuthContext';

const deviceHeight = Dimensions.get('window').height;
const widthHeight = Dimensions.get('window').width;
const url = 'https://play.google.com/store/apps/details?id=com.veidthealth.giftcareapp&pli=1';

function BaremosScreen({navigation}) {
  const {theme} = useTheme();
  const mapRef = useRef(null);
  const {hasLocation, initialPosition, getCurrentLocation, userLocation, errLocation} =
    useLocation();
  const {userLoged} = useContext(AuthContext);

  const [markers, setMarkers] = useState([]);
  const [initialRegion, setInitialRegion] = useState(null);
  const [services, setServices] = useState([]);
  const [examenId, setExamenId] = useState(-1);
  const [saldo, setSaldo] = useState('');
  const [cordinates, setCoordinates] = useState({
    latitude: '',
    longitude: '',
  });
  const [loading, setLoading] = useState(false);

  const [loadingCheck, setLoadingCheck] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [reesponseGC, setResponseGC] = useState({
    success: false,
    found: 0,
    message: '',
    todoOk: false,
  });
  const [openModalResult, setOpenModalResult] = useState(false);

  const getInitialRegion = () => {
    return {
      latitude: initialPosition.latitude,
      longitude: initialPosition.longitude,
      latitudeDelta: DEFAULT_REGION.latitudeDelta,
      longitudeDelta: DEFAULT_REGION.longitudeDelta,
    };
  };

  const centerPosition = async () => {
    //console.log('centerPosition()1 ==>', true);
    const {latitude, longitude} = await getCurrentLocation();
    setCoordinates({
      latitude,
      longitude,
    });
    //onRegionChange({latitude, longitude, ...DEFAULT_REGION});
    mapRef.current?.animateCamera({
      center: {latitude, longitude},
    });
  };

  const onRegionChange = async region => {
    console.log('onRegionChange() ==> region', {region});
  };

  useFocusEffect(
    React.useCallback(() => {
      listServices();
      centerPosition();
      return undefined;
    }, []),
  );

  useEffect(() => {
    if (hasLocation && !markers) {
      //centerPosition();
    }

    if (markers) {
      const coordinatesNew = markers.map(marker => ({
        ...marker.coordinate,
      }));
      if (coordinatesNew) {
        mapRef.current?.fitToCoordinates(coordinatesNew, {
          animated: true,
          edgePadding: {top: 20, left: 20, right: 20, bottom: 20},
        });
      }
    }
  }, [hasLocation, markers]);

  const onChangeValue = examen => {
    //getCenters(examen)
  };

  const getCenters = async () => {
    try {
      const body = {
        examenId,
        location: `${cordinates.latitude},${cordinates.longitude}`,
        balance: saldo,
      };
      const {data} = await getCentersBaremos(body);
      if (data.length === 0) {
        setOpenModalResult(true);
      } else {
        buildMarkers(data);
      }
    } catch (error) {
      console.log('error baremos', error);
    }
  };

  const buildMarkers = data => {
    let arrayMarkerts = [];
    data.forEach(location => {
      const arrayCoordinate = location.geolocalizacionCentroSalud.split(',');
      const latitude = parseFloat(arrayCoordinate[0]);
      const longitude = parseFloat(arrayCoordinate[1]);
      arrayMarkerts.push({
        image: require('../../assets/custom-marker.png'),
        coordinate: {
          latitude,
          longitude,
        },
        title: location.nombreCentroSalud,
        description: `${location.direccionCentroSalud} - ${location.telefonoCentroSalud}`,
      });
    });
    setMarkers(arrayMarkerts);
  };

  const listServices = async () => {
    try {
      const {data} = await getServices();
      setServices(data);
    } catch (error) {
      console.log('error services', error);
    }
  };

  const validButton = () => {
    if (!examenId || examenId == '' || examenId == -1) {
      return true;
    }
    if (saldo == '' || !saldo || saldo == '0') {
      return true;
    }
    return false;
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      //getSaldo();
      await getCenters();
      setLoading(false);
    } catch (error) {
      console.log('error handleSearch', error);
      setLoading(false);
    }
  };

  const getSaldo = async () => {
    setLoadingCheck(true);
    setOpenDialog(true);
    try {
      const response = await checkMoney(userLoged.email);
      setResponseGC({
        success: true,
        found: response.data.balance,
        message: buildMesage(response.data.balance),
        todoOk: response.data.balance < 10 ? false : true,
      });
      if (response.data.balance >= 10) {
        getCenters();
        setLoadingCheck(false);
        setOpenDialog(false);
      } else {
        setLoadingCheck(false);
      }
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

  const tryAgain = () => {
    setLoadingCheck(true);
    getSaldo();
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

  return (
    <View style={styles.container}>
      <View style={{position: 'relative', width: '100%', height: '100%', flex: 1}}>
        <MapView
          ref={el => (mapRef.current = el)}
          style={styles.map}
          onRegionChangeComplete={() => {}}
          initialRegion={initialRegion ? initialRegion : getInitialRegion()}>
          {markers &&
            markers.length > 0 &&
            markers.map((marker, index) => {
              return (
                <Marker
                  key={index}
                  coordinate={marker.coordinate}
                  title={marker.title}
                  description={marker.description}>
                  <Image
                    source={require('../../assets/custom-marker.png')}
                    style={{width: 50, height: 50}}
                  />
                </Marker>
              );
            })}
        </MapView>

        <View style={styles.overlay} pointerEvents='box-none'>
          <View style={styles.overlaySearch}>
            <View style={styles.containerFilter}>
              <SelectDropdown
                data={services}
                onSelect={(selectedItem, index) => {
                  setExamenId(selectedItem.id);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem.nombre;
                }}
                rowTextForSelection={(item, index) => {
                  return item.nombre;
                }}
                buttonStyle={styles.dropdown1BtnStyle}
                buttonTextStyle={styles.dropdown1BtnTxtStyle}
                search
                searchInputStyle={styles.dropdownsearchInputStyleStyle}
                searchPlaceHolder={'Buscar por nombre'}
                searchPlaceHolderColor={'#444'}
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
                defaultButtonText={'Elija un servicio'}
              />

              <View style={styles.inputContainer}>
                <TextInput
                  maxLength={24}
                  style={styles.input}
                  onChangeText={text => setSaldo(text)}
                  value={saldo}
                  placeholder='Presupuesto'
                  placeholderTextColor={'#83859a'}
                  keyboardType='numeric'
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.inputContent}>
        <Button
          title='Buscar'
          disabled={validButton()}
          onPress={() => {
            handleSearch();
          }}
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
                    <Dialog.Button title='Cancelar' onPress={() => setOpenDialog(false)} />
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
                  <Dialog.Button title='Cancelar' onPress={() => setOpenDialog(false)} />
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
                    title='Cancelar'
                    onPress={() => {
                      setOpenDialog(false);
                    }}
                  />
                  {/*<Dialog.Button
                    title='Reintentar'
                    onPress={() => {
                      tryAgain();
                    }}
                  />*/}
                </Dialog.Actions>
              </View>
            )}
            {/*reesponseGC.success && reesponseGC.todoOk && (
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
            )*/}
          </View>
        )}
      </Dialog>

      <Modal
        animationType='slide'
        transparent={true}
        visible={openModalResult}
        onRequestClose={() => {
          setOpenModalResult(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{width: '100%', display: 'flex', alignItems: 'center', marginBottom: 7}}>
              <Text style={styles.modalTitle}>
                Estimado usuario, no encontramos resultados para su búsqueda
              </Text>
            </View>
            <View style={{width: '100%', display: 'flex', alignItems: 'flex-end'}}>
              <Button
                title='Aceptar'
                type='clear'
                onPress={() => {
                  setOpenModalResult(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default BaremosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    height: '100%',
    width: '100%',
  },
  inputContent: {
    marginTop: 10,
    marginBottom: 12,
    marginHorizontal: 10,
  },
  containerMap: {
    ...StyleSheet.absoluteFillObject,
    height: deviceHeight,
    width: widthHeight,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  gps: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 10,
  },
  buttonMenu: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  overlaySearch: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    gap: 5,
    position: 'relative',
  },
  dropdown1BtnStyle: {
    width: '100%',
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
    marginBottom: 10,
  },
  dropdown1BtnTxtStyle: {color: '#83859a', textAlign: 'left'},
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
  dropdownsearchInputStyleStyle: {
    backgroundColor: '#EFEFEF',
    borderBottomWidth: 1,
    borderBottomColor: '#FFF',
  },
  containerFilter: {
    flex: 1,
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
  inputContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    color: '#000000',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    fontFamily: 'Poppins-Medium',
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
    fontSize: 16,
  },
  label: {
    fontSize: 17,
    color: '#06060a',
    fontFamily: 'Poppins-Medium',
  },
  contentLinks: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  inputIcon: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#f5f6fa',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#7d7d7d',
    paddingHorizontal: 10,
    height: 50,
  },
  inputStyle: {
    flex: 1,
    height: 50,
    fontFamily: 'Poppins-Medium',
    color: '#000000',
  },
});

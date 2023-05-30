import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SelectDropdown from 'react-native-select-dropdown';
import {Button, ButtonGroup, useTheme} from '@rneui/themed';
import {getEspecialities} from '../../services/doctor/medicine';
import MapCustom from '../../components/atoms/maps';
import {Card} from '@rneui/themed';
import {ASSETS} from '../../config/Constant';
import {mostrarUbicaciones} from '../../services/doctor/ubicaciones';
import Doctor from '../../models/Doctor';
import {Icon} from '@rneui/base';
import {sendNotificationRequest} from '../../services/doctor/notification';
import {AuthContext} from '../../context/AuthContext';

function SearchScreen({navigation}) {
  const {theme} = useTheme();
  const [especialidades, setEspecialidades] = useState([]);
  const {userLoged, token} = useContext(AuthContext);

  const [locationUser, setLocationUser] = useState();
  const [especialidadId, setEspecialidadId] = useState();
  const [doctors, setDoctors] = useState();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getEspecialitiesAll();
  }, []);

  const getEspecialitiesAll = async () => {
    try {
      const {data} = await getEspecialities();
      setEspecialidades(data);
    } catch (error) {
      console.log(error);
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
      console.log('handleSearch() ==>', {userLoged});
      const result = await sendNotificationRequest({
        doctors: newDoctors,
        user: {...userLoged, deviceToken: token},
      });
      console.log('handleSearch() ==> result', {result, userLoged});
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
              data={especialidades}
              onSelect={(selectedItem, index) => {
                console.log('onSelect() ==>', {selectedItem, index});
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
});

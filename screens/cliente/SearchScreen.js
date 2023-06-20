import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {Popover, Button as Butt, Divider} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SelectDropdown from 'react-native-select-dropdown';
import {Button, useTheme, Icon} from '@rneui/themed';
import MapCustom from '../../components/atoms/maps';
import {NAME_ICON} from '../../config/Constant';
import {mostrarUbicaciones} from '../../services/doctor/ubicaciones';
import Doctor from '../../models/Doctor';
import {sendNotificationRequest} from '../../services/doctor/notification';
import {AuthContext} from '../../context/AuthContext';
import MapFilterComponet from '../../components/molecules/MapFilter';

function SearchScreen({navigation}) {
  const {theme} = useTheme();
  const {userLoged, token, getEspecialitiesAll, specialities} = useContext(AuthContext);

  const [locationUser, setLocationUser] = useState();
  const [filterValues, setFilterValues] = useState({specialtyId: undefined});
  const [doctors, setDoctors] = useState();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getEspecialitiesAll();
  }, []);

  const resetSearch = async () => {
    setEspecialidadId(undefined);
    setLocationUser(undefined);
    setDoctors(undefined);
  };

  const handleSearch = async () => {
    setLoading(true);
    const {status, data} = await mostrarUbicaciones({
      user: locationUser,
      especialidadId: filterValues.especialidadId,
    });
    console.log('handleSearch() ==> ', {status, data});
    if (status === 200) {
      if (data && data.length > 0) {
        const newDoctors = data.map(doctor => new Doctor(Doctor.formatData(doctor)));
        setDoctors(newDoctors);
        console.log('handleSearch() ==>', {userLoged});
        const result = await sendNotificationRequest({
          doctors: newDoctors,
          user: {...userLoged, deviceToken: token},
        });
        console.log('handleSearch() ==> result', {result, userLoged});
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
    setLoading(false);
  };

  const validButton = () => {
    if (filterValues.especialidadId !== undefined && locationUser !== undefined) {
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
        {!doctors && <MapFilterComponet values={filterValues} onChangeValues={setFilterValues} />}
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
});

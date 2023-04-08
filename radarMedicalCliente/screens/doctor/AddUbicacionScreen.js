import React, {useState, useEffect, } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView, Modal, Dimensions } from 'react-native';
import SingleMap from '../../components/SingleMap';
import { useLocation } from '../../hooks/useLocation';
import { Button, Input,  Icon} from '@rneui/themed';
import CustomHeader from '../../components/CustomHeader';
import SelectDropdown from 'react-native-select-dropdown'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {getProivinces, getMunicipalitiesByProvinceId, getParroquiesByMinicipalyId} from '../../services/doctor/address'; 
import {addDoctorCenter, getCentersByEstado, getCentersByParroquia} from '../../services/doctor/centers'; 

const windowHeight = Dimensions.get('window').height;

function AddUbicacionScreen({ navigation, route }) {

	const { initialPosition, getCurrentLocation } = useLocation();
	const [coordinantes, setCoordinates] = useState({
		longitude: 0,
		latitude: 0
	})
	const [estado, setEstado] = useState(0)
	const [ciudad, setCiudad] = useState(-1)
	const [municipio, setMunicipio] = useState(-1)
	const [parroquia, setParroquia] = useState(-1)
	const [centerId, setCenterId] = useState(-1)
	const [markers, setMarkers] = useState([])
	const [initialRegion, setInitialRegion] = useState(null)
	const [isOpened, setIsOpened] = useState(false)

	const [provinces, setProvinces] = useState([])
	const [municipalities, setMunicipalities] = useState([])
	const [parroquies, setParroquies] = useState([])
	const [cities, setCities] = useState([])
	const [centers, setCenters] = useState([])
	const [busco, setBusco] = useState(false)
	const [isSearch, setIsSearch] = useState(false)

	useEffect(() =>{
    myCurrentPosition()
		listProvinces();
  }, [])


	const listProvinces = async () => {
		try {
      const {data} = await getProivinces();
      setProvinces(data)
    } catch (error) {
      console.log(error)
    } 
	}

	const listMunicipalities = async(id) => {
		try {
      const {data} = await getMunicipalitiesByProvinceId(id);
			setMunicipalities(data);
    } catch (error) {
      console.log(error)
    } 
	}

	const listParroquies = async(id) => {
		try {
      const {data} = await getParroquiesByMinicipalyId(id);
      setParroquies(data)
    } catch (error) {
      console.log(error)
    } 
	}

  const myCurrentPosition = async() => {
    const { latitude, longitude } = await getCurrentLocation()
		setCoordinates({
			latitude,
			longitude
		})
    setInitialRegion({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    })
    setMarkers([{
      image: require('../../assets/custom-marker.png'),
      coordinate: {
        latitude: latitude,
        longitude: longitude,
      },
      title: '',
      description: ''
    }])
  }

	const getLocation = (event) => {
    const coordenadas = event.nativeEvent.coordinate
    setCoordinates(event.nativeEvent.coordinate)
    setMarkers([{
      image: require('../../assets/custom-marker.png'),
      coordinate: {
        latitude: coordenadas.latitude,
        longitude: coordenadas.longitude,
      },
      title: '',
      description: ''
    }])
  }

	const changeDragEnd = (event) => {
		setCoordinates(event.nativeEvent.coordinate)
	}

	const guardar = async() => {
		let userToken = await AsyncStorage.getItem('userToken');
    const userData = JSON.parse(userToken);
		if(centerId == 0 || centerId == -1 || !centerId){
			Alert.alert('Atención','Debes seleccionar un centro de Salud');
		} else {
			try {
        const response = await addDoctorCenter(centerId, userData.userName)
        Alert.alert('Exito','Registro exitoso');
				navigation.goBack();
      } catch (error) {
        console.log('axios error', error)
        Alert.alert('Error','Error al intentar guardar los datos');
      }
		}
	}

	const buildMarkers = (ubication) => {
    const arrayCoordinate = ubication.geoLocation.split('/');
		setCoordinates({
			latitude: parseFloat(arrayCoordinate[0]),
			longitude: parseFloat(arrayCoordinate[1]) 
		})
    setMarkers([
      {
        image: require('../../assets/custom-marker.png'),
        coordinate: {
          latitude: parseFloat(arrayCoordinate[0]),
          longitude: parseFloat(arrayCoordinate[1]),
        },
        title: ubication.Name,
        description: ubication.Address
      }
    ])
  }

	const searchCenter = async() => {
		if(estado == 0 || estado == -1 || !estado){
			Alert.alert('Atención','Debe seleccionar un estado');
		} else if (municipio == 0 || municipio == -1 || !municipio) {
			setIsSearch(true);
			const {data} = await getCentersByEstado(estado);
			setCenters(data);
			setBusco(true);
			setIsSearch(false);
		} else {
			if(municipio != 0 || municipio != -1 || municipio){
				if(parroquia == 0 || parroquia == -1 || !parroquia){
					Alert.alert('Atención','Debe seleccionar una parroquia');
				} else {
					setIsSearch(true)
					const {data} = await getCentersByParroquia(parroquia);
					setCenters(data);
					setBusco(true);
					setIsSearch(false);
				}
			}
		}
	}

  return (
    <View style={{ flex: 1}}>
			<CustomHeader iconColor="black" iconName="arrow-back"
				onPressIcon={() => navigation.goBack()}
			/>
				<Modal
					statusBarTranslucent={true}
					animationType="fade"
					visible={isOpened}
				>
					<View style={{ flex: 1 }}>
						<View style={styles.modalHeader}>
							<Icon 
								name="close-outline"
								color="black"
								size={27}
								type="ionicon"
								style={{ marginTop: 5, marginRight: 20}}
								onPress={() => setIsOpened(false) }
							/>  
						</View>
						<View style={styles.contentMap}>
							<SingleMap 
								markers={markers}
								onPress={getLocation}
								onRegionChange={()=>{}}
								onDragEnd={changeDragEnd}
								initialRegion={initialRegion}
								draggableMarker={true}
							/>
						</View>
					</View>
				</Modal>

      <View style={{ paddingHorizontal: 10, marginTop: 5}}>
				<View style={styles.inputContent}>
					<SelectDropdown
						data={provinces}
						onSelect={(selectedItem, index) => {
							setEstado(selectedItem.id)
							listMunicipalities(selectedItem.id)
						}}
						buttonTextAfterSelection={(selectedItem, index) => {
							return selectedItem.name
						}}
						rowTextForSelection={(item, index) => {
							return item.name
						}}
						buttonStyle={styles.dropdown1BtnStyle}
            buttonTextStyle={styles.dropdown1BtnTxtStyle}
            renderDropdownIcon={isOpened => {
							return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18}  />
              //return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
            }}
            dropdownIconPosition={'right'}
            dropdownStyle={styles.dropdown1DropdownStyle}
            rowStyle={styles.dropdown1RowStyle}
            rowTextStyle={styles.dropdown1RowTxtStyle}
						defaultButtonText={'Estado'}
					/>
				</View>
				<View style={styles.inputContent}>
					<SelectDropdown
						data={municipalities}
						onSelect={(selectedItem, index) => {
							setMunicipio(selectedItem.id)
							listParroquies(selectedItem.id)
						}}
						buttonTextAfterSelection={(selectedItem, index) => {
							return selectedItem.name
						}}
						rowTextForSelection={(item, index) => {
							return item.name
						}}
						buttonStyle={styles.dropdown1BtnStyle}
            buttonTextStyle={styles.dropdown1BtnTxtStyle}
            renderDropdownIcon={isOpened => {
							return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18}  />
              //return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
            }}
            dropdownIconPosition={'right'}
            dropdownStyle={styles.dropdown1DropdownStyle}
            rowStyle={styles.dropdown1RowStyle}
            rowTextStyle={styles.dropdown1RowTxtStyle}
						defaultButtonText={'Municipio'}
						disabled={(estado === 0 || !estado) ? true : false}
					/>
				</View>
				<View style={styles.inputContent}>
					<SelectDropdown
						data={parroquies}
						onSelect={(selectedItem, index) => {
							setParroquia(selectedItem.id)
						}}
						buttonTextAfterSelection={(selectedItem, index) => {
							return selectedItem.name
						}}
						rowTextForSelection={(item, index) => {
							return item.name
						}}
						buttonStyle={styles.dropdown1BtnStyle}
            buttonTextStyle={styles.dropdown1BtnTxtStyle}
            renderDropdownIcon={isOpened => {
							return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18}  />
              //return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
            }}
            dropdownIconPosition={'right'}
            dropdownStyle={styles.dropdown1DropdownStyle}
            rowStyle={styles.dropdown1RowStyle}
            rowTextStyle={styles.dropdown1RowTxtStyle}
						defaultButtonText={'Parroquia'}
						disabled={(municipio === 0 || !municipio) ? true : false}
					/>
				</View>	
				<View style={styles.inputContent}>
					<Button radius={'sm'} type="solid"
						buttonStyle={{
              backgroundColor: '#66bfc5',
              borderRadius: 10,
              height: 50
            }}
						onPress={() => searchCenter()}
						loading={isSearch}
					>
						Buscar centro de Salud
						<Icon name="map-outline" color="white" type="ionicon" style={{ marginLeft: 5 }} />
					</Button>
				</View>

				{busco &&
					<View style={styles.inputContent}>
						<SelectDropdown
							data={centers}
							onSelect={(selectedItem, index) => {
								setCenterId(selectedItem.id)
							}}
							buttonTextAfterSelection={(selectedItem, index) => {
								return selectedItem.name
							}}
							rowTextForSelection={(item, index) => {
								return item.name
							}}
							buttonStyle={styles.dropdown1BtnStyle}
							buttonTextStyle={styles.dropdown1BtnTxtStyle}
							renderDropdownIcon={isOpened => {
								return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18}  />
								//return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
							}}
							dropdownIconPosition={'right'}
							dropdownStyle={styles.dropdown1DropdownStyle}
							rowStyle={styles.dropdown1RowStyle}
							rowTextStyle={styles.dropdown1RowTxtStyle}
							defaultButtonText={'Elija  centro de Salud'}
							disabled={(municipio === 0 || !municipio) ? true : false}
						/>
					</View>
				}

				<View style={styles.centerStyle}>
					<Button title="Guardar datos" 
						buttonStyle={{
              backgroundColor: '#66bfc5',
              borderRadius: 10,
              height: 50
            }}
						containerStyle={{
							width: '100%',
						}}
						onPress={guardar}
					/>
				</View>
			</View>
    </View>
  );
}

export default AddUbicacionScreen

const styles = StyleSheet.create({ 
	input: {
    height: 40,
    margin: 5,
    borderWidth: 1,
    padding: 10,
		borderRadius: 8
  },
  inputContent: {
    width: '100%',
		marginBottom: 10
  },
	contentMap:{
		height: windowHeight - 20,
	},
	contentTextMap: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		marginVertical: 5
	},
	centerStyle:{
		display: 'flex', alignItems: 'center', marginVertical: 5,
		width: '100%'
	},
	dropdown1BtnStyle: {
    width: '95%',
    height: 42,
    backgroundColor: '#F1F1F1',
    borderBottomWidth: 1,
    borderColor: '#444',
		marginHorizontal: 10
  },
  dropdown1BtnTxtStyle: {color: '#444', textAlign: 'left', },
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
	scrollView: {
    marginHorizontal: 0,
  },
	modalHeader:{
		height: 60,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center'
	}
})
import React, {useState, useRef, useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SingleMap from '../../components/SingleMap'; 
import Swiper from 'react-native-swiper';
import { Button} from '@rneui/themed';
import CardResult from '../../components/CardResult'; 

function ResultScreen() {

	const [results, setResults] = useState([
		{
			id: 1009,
			"rif": 'J324645654',
			"name": 'CLinica Atías',
			"description": 'CLinica de servicios medicos',
			"estadoId": 12,
			"municipioId": 146,
			"parroquiaId": 463,
			"ciudadId": -1,
			"postalCode": '3001',
			"address": 'Calle 31 con Av Vargas ',
			"geoLocation": `10.08031143886397/-69.31237902492285`,
			"users": [
				{
					Id: 'c31a9484-ed96-4b62-a51e-820cd304ef10',
					FullName: 'Roberto Guere 14',
					ColegioMedicoId: '233556',
					ExperienceYears: 7
				},
				{
					Id: 'fcced2cc-7ec1-4d8f-9830-305f0fa196e7',
					FullName: 'Jorge Colmenarez',
					ColegioMedicoId: '897984554',
					ExperienceYears: 5
				},
				{
					Id: 'fcced2cc-7ec1-4d8f-9830-305f0fa18990',
					FullName: 'Ramiro Vargas',
					ColegioMedicoId: '98989890',
					ExperienceYears: 5
				},
				{
					Id: 'fcced2cc-7ec1-4d8f-89890805f0fa18990',
					FullName: 'Erika Soza',
					ColegioMedicoId: '89798789',
					ExperienceYears: 5
				}
			]
		},
		{
			id: 1010,
			"rif": 'J908934453',
			"name": 'Centro medico esperanza',
			"description": 'Torre de especialidades medicas',
			"estadoId": 12,
			"municipioId": 146,
			"parroquiaId": 463,
			"ciudadId": -1,
			"postalCode": '3001',
			"address": 'Calle 31 con Av Vargas ',
			"geoLocation": `10.054206357441766/-69.38693270087242`,
			"users": [
				{
					Id: 'c31a9484-ed96-4b62-a51e-820cd304ef10',
					FullName: 'Ali Freitez',
					ColegioMedicoId: '67868678',
					ExperienceYears: 2
				},
				{
					Id: 'fcced2cc-7ec1-4d8f-9830-305f0fa196e7',
					FullName: 'Ester Salgado',
					ColegioMedicoId: '657688',
					ExperienceYears: 4
				}
			]
		},
		{
			id: 1011,
			"rif": 'J08098908',
			"name": 'CLinica Razeti',
			"description": 'Especialidades y ervicios medicos',
			"estadoId": 12,
			"municipioId": 146,
			"parroquiaId": 463,
			"ciudadId": -1,
			"postalCode": '3001',
			"address": 'Calle 31 con Av Vargas ',
			"geoLocation": `10.074187684510914/-69.30006433278322`,
			"users": [
				{
					Id: 'c31a9484-ed96-4b62-a51e-820cd304ef10',
					FullName: 'SAul Marcano',
					ColegioMedicoId: '6768678',
					ExperienceYears: 9
				},
				{
					Id: 'fcced2cc-7ec1-4d8f-9830-305f0fa196e7',
					FullName: 'Eder Peñaloza',
					ColegioMedicoId: '65787689',
					ExperienceYears: 12
				}
			]
		}
	])

	const [index, setIndex] = useState(1);
	const carouselRef = useRef(null)

	const [coordinantes, setCoordinates] = useState({
		longitude: 0,
		latitude: 0
	})
	const [markers, setMarkers] = useState([])
	const [initialRegion, setInitialRegion] = useState(null)

	useEffect(() => {
		buildMarkers(results[0])
	}, [])

	const buildMarkers = (ubication) => {
    const arrayCoordinate = ubication.geoLocation.split('/');
		const latitude = parseFloat(arrayCoordinate[0]);
		const longitude = parseFloat(arrayCoordinate[1]); 
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

	const changeIndex = (index) => {
		console.log(index)
		buildMarkers(results[index])
	}	

	const renderItem = ({item, index}) => {
		<CardResult healtCenter={item}  />
	}

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, width: '100%' }}>
				<SingleMap 
					initialRegion={initialRegion}
					markers={markers}
					onPress={() => {}}
					onRegionChange={()=>{}}
					onDragEnd={() => {}}
					draggableMarker={false}
				/>
			</View>
			<View style={{ position: 'absolute', display: 'flex', bottom: 0, left: 0, right: 0, height: 350, alignItems: 'center' }}>
				
				<Swiper style={styles.wrapper} showsButtons={true}
					showsPagination={false}
					onIndexChanged={(index) => changeIndex(index)}
					loop={false}
				>
					{results.map((item, index) => (
						<View style={styles.slide} key={'slide' + index} >
							<CardResult healtCenter={item}  />
						</View>
					))}
					</Swiper>
				{/*<View style={{ height: 60, display: 'flex', justifyContent: 'center' }}>
					<Button
            title="Contactar"
            onPress={() => {}}
            buttonStyle={{
              backgroundColor: '#66bfc5',
              borderRadius: 10,
              height: 40
            }}
            titleStyle={{
              fontFamily: 'Poppins-SemiBold'
            }}
            loading={false}
          />
						
				</View>*/}
			</View>
    </View>
  );
}

export default ResultScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex'
  },
	wrapper: {},
  slide: {
    width: '100%',
		display: 'flex',
		alignItems:'center',
		height: '100%'
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5'
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9'
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  }
})
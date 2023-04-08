/* eslint-disable no-undef */
import React, {useState} from 'react';
import {View, Text, Dimensions, StyleSheet } from 'react-native';
const {width, height} = Dimensions.get('window');
import SingleMap from '../../components/SingleMap';


export default EjemploMapa = () => {

	const [markers, setMarkers] = useState([
		{
			image: require('../../assets/hospital-marker.png'),
			coordinate: {
				latitude: 10.510363,
				longitude: -66.916892,
			},
			title: 'Centro Médico algo',
			description: 'Clinica de servicios'
		},
		{
			image: require('../../assets/hospital-marker.png'),
			coordinate: {
				latitude: 10.504413,
				longitude: -66.906628,
			},
			title: 'Centro Clinico algo',
			description: 'Clinica de servicios especiales'
		},
		{
			image: require('../../assets/hospital-marker.png'),
			coordinate: {
				latitude: 10.502219,
				longitude: -66.916548,
			},
			title: 'Centro de especialidades Médicas',
			description: 'Clinica de servicios necesarios'
		}
	]);

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

  return (
    <View style={{ flex: 1 }}>
			<View style={styles.contentMap}>
					<SingleMap 
						markers={markers}
						onPress={() => {}}
						onRegionChange={()=>{}}
						onDragEnd={()=>{}}
						draggableMarker={false}
				/>
			</View>
		</View>
  );
};

const styles = StyleSheet.create({
	contentMap:{
		width: width,
		height: height
	}
});

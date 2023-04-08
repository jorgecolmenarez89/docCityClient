import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import MenuButton from '../../components/MenuButton'; 
import { useLocation } from '../../hooks/useLocation';
import Fab from '../../components/Fab'; 

const deviceHeight = Dimensions.get("window").height
const widthHeight = Dimensions.get("window").width

function HomeScreen({navigation}) {

	const {
    hasLocation, 
    initialPosition, 
    getCurrentLocation, 
    followUserLocation,
    userLocation,
    stopFollowUserLocation
  } = useLocation();

  return (
    <View style={styles.container}>
			<View style={styles.containerMap}>
				<>
					<MenuButton 
						iconName="menu-outline"
						onPress={() => {navigation.toggleDrawer()}}
						style={styles.buttonMenu}
					/>

					<MapView
						style={styles.map}
						showsUserLocation
						region={{
							latitude: initialPosition.latitude,
							longitude: initialPosition.longitude,
							latitudeDelta: 0.015,
							longitudeDelta: 0.0121,
						}}
					>

					</MapView>

					<Fab 
						iconName="search-outline"
						onPress={() => navigation.navigate('Search')}
						style={{
							position: 'absolute',
							bottom: 20,
							right: 20
						}}
					/>

				</>

			</View>
    </View>
  );
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
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
	buttonMenu: {
		position: 'absolute',
		top: 20,
		left: 20,
		zIndex: 10
	}
})
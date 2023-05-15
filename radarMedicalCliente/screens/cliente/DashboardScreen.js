import React from 'react';
import {View, Text, StyleSheet,  SafeAreaView, ScrollView, StatusBar} from 'react-native';
import CardSolicitar from '../../components/home/CardSolicitar';
import CardBuscar from '../../components/home/CardBuscar';

function DashboardScreen({ navigation }) {
	return (
		<SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>

				<View style={styles.ubicationContainer}>
					<Text>DashboardScreen</Text>
				</View>

				<CardSolicitar />
				<View style={styles.spacer}></View>
				<CardBuscar />
			

			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({ 
	container: {
		flex: 1,
		backgroundColor: '#f6f7fc',
		paddingTop: StatusBar.currentHeight,
		paddingHorizontal: 20
	},
	ubicationContainer: {
		width: '100%',
		display: 'flex',
		alignItems: 'center'
	},
	spacer: {
		marginVertical: 8
	}
})

export default DashboardScreen
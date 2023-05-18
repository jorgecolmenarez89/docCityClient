import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

function CarGrey({ navigation, title, options, onPressEvent }) {
	return (
		<TouchableOpacity
			activeOpacity={0.9}
			onPress={() => onPressEvent() }
			style={styles.container}
		>
			<View style={styles.content}>
				<View style={styles.iconContent}>
				</View>
				<View style={styles.infoContent}>
					<Text style={styles.title}>{title}</Text>
					<View style={styles.optionsContent}>
						{options.map((opt, i) => (
							<Text style={styles.text} key={'opt-i'} >{opt}</Text>
						))}
					</View>
				</View>
			</View>
		</TouchableOpacity>
	)
}

export default CarGrey

const styles = StyleSheet.create({ 
	container: {
		backgroundColor: '#cdcdcd',
		padding: 10,
		borderRadius: 10,
		minHeight: 100,
	},
	content: {
		display: 'flex',
		flexDirection: 'row'
	},
	iconContent:{
		marginRight: 10,
		backgroundColor: '#828282',
		borderRadius: 6,
		width: 60,
		height: 80
	},
	infoContent: {
		display: 'flex',
	},
	title: {
		fontFamily: 'Poppins-SemiBold',
		fontSize: 17
	},
	optionsContent: {
		display: 'flex',
	},
	text:{
		fontFamily: 'PoppinsMedium',
		fontSize: 14
	}
})
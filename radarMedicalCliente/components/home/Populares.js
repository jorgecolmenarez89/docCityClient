import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Image} from '@rneui/themed';
import { Rating } from 'react-native-ratings';
const RATING_IMAGE = require('../../assets/rating.png')

function Populares({ title, speciality, stars}) {
	return (
		<View
			style={styles.container}
		>
			<View style={styles.content}>
				<View style={styles.iconContent}>
				</View>
				<View style={styles.infoContent}>
					<Text style={styles.title}>{title}</Text>
					<View style={styles.optionsContent}>
						<Text style={styles.text}>{speciality}</Text>
						<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
							<Image 
								source={RATING_IMAGE}
								style={{
									width: 20,
									height: 20,
								}}
							/>
							<Text style={styles.textRating} >
							 {stars}
							</Text>
						</View>
						
					</View>
				</View>
			</View>
		</View>
	)
}

export default Populares

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
		width: 80,
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
		fontFamily: 'Poppins-Medium',
		fontSize: 14
	},
	textRating:{
		fontFamily: 'Poppins-SemiBold',
		fontSize: 14,
		marginLeft: 5
	}
})
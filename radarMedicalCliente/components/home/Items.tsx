import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';

const Items = () => {

	const [items, setItems] = useState([
		{
			icon: '',
			name: 'Mis Consultas'
		},
		{
			icon: '',
			name: 'Historia médica'
		},
		{
			icon: '',
			name: 'Mis Vacunas'
		},
		{
			icon: '',
			name: 'Mi GiftCare'
		}
	]);

	return ( 
		<View style={styles.container}>
			{items.map((item, i) => (
				<View key={'item-w'+ i} style={styles.item} >
					<View style={styles.round}></View>
					<View style={styles.contenText}>
						<Text style={styles.textItem}>{item.name}</Text>
					</View>
				</View>
			))}
		</View>
	);
}
 
export default Items;

const styles = StyleSheet.create({
	container: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		padding: 10
	},
	item:{
		flex: 1,
		display: 'flex',
		alignItems: 'center'
	},
	round:{
		height: 70,
		width: 70,
		borderRadius: 50,
		backgroundColor: '#efeeff'
	},
	contenText: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 5
	},
	textItem: {
		textAlign: 'center',
		fontFamily: 'Poppins-Regular',
		fontSize: 13
	}
})

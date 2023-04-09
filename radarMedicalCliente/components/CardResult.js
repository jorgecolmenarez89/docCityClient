import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, ListItem, Avatar  } from '@rneui/themed';

const textArray = [
	'Traumatologo',
	'Dermatologo',
	'Cardiologo',
	'Internista',
	'Endocrino',
	'Diabetologo',
	'Gineologo',
	'Ginecostetra',
];

const randomNumber = Math.floor(Math.random()*textArray.length);

function CardResult({ healtCenter }) {
  return (
		<>
			{healtCenter &&
			<Card
				containerStyle={{ width: 300, height: 290 }}
			>
				<Card.Title>{healtCenter.name}</Card.Title>
				<ScrollView style={styles.scrollView}>
					{healtCenter.users.map((user, index) => (
						<ListItem bottomDivider key={user.Id}>
							<Avatar
								rounded
								source={{ uri: 'https://randomuser.me/api/portraits/men/36.jpg' }}
							/>
							<ListItem.Content>
								<ListItem.Title>{user.FullName}</ListItem.Title>
								<ListItem.Subtitle>{textArray[randomNumber] }</ListItem.Subtitle>
							</ListItem.Content>
						</ListItem>
					))}
				</ScrollView>
			</Card>
			}
		</>
  );
}

export default CardResult

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
	scrollView:{
		width: '100%'
	}
})
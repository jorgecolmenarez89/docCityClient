import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Image, Button, Icon} from '@rneui/themed';
import {Rating} from 'react-native-ratings';
const USER_IMAGE = require('../../assets/user-icon.png');

function Relative({name, relation, age, onClick}) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image style={styles.iconContent} source={require('../../assets/user-icon.png')} />
        <View style={{width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <View style={styles.infoContent}>
            <Text style={styles.title}>{name}</Text>
            <View style={styles.optionsContent}>
              <Text style={styles.text}>{relation}</Text>
              {/*<View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.text}>Edad:</Text>
                <Text style={styles.textRating}>{age}</Text>
              </View>*/}
            </View>
          </View>
          <View
            style={{
              width: '32%',
              height: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}>
            <Icon
              name='settings-outline'
              color='#0b445e'
              size={30}
              type='ionicon'
              onPress={() => onClick()}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

export default Relative;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#cdcdcd',
    padding: 10,
    borderRadius: 10,
    height: 90,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
  },
  iconContent: {
    marginRight: 10,
    borderRadius: 6,
    width: 70,
    height: 70,
  },
  infoContent: {
    display: 'flex',
    flex: 1,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 17,
  },
  optionsContent: {
    display: 'flex',
  },
  text: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  textRating: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    marginLeft: 5,
  },
  butonT: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#0b445e',
  },
});

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Image} from '@rneui/themed';
import {Rating} from 'react-native-ratings';
const USER_IMAGE = require('../../assets/user-icon.png');

function Relative({name, relation, age, onPress}) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <Image style={styles.iconContent} source={require('../../assets/user-icon.png')} />
        <View style={styles.infoContent}>
          <Text style={styles.title}>{name}</Text>
          <View style={styles.optionsContent}>
            <Text style={styles.text}>{relation}</Text>
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.text}>Edad:</Text>
              <Text style={styles.textRating}>{age}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default Relative;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#cdcdcd',
    padding: 10,
    borderRadius: 10,
    minHeight: 100,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
  },
  iconContent: {
    marginRight: 10,
    borderRadius: 6,
    width: 80,
    height: 80,
  },
  infoContent: {
    display: 'flex',
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
});

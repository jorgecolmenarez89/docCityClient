import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Image} from '@rneui/themed';
import {Rating} from 'react-native-ratings';
const RATING_IMAGE = require('../../assets/rating.png');

function PopularHome({title, speciality, stars, profile, onPress}) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.iconContent}>
          <Image
            source={{uri: profile}}
            style={{
              width: 70,
              height: 70,
              borderRadius: 6,
            }}
          />
        </View>
        <View style={styles.infoContent}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.optionsContent}>
            <Text style={styles.text}>{speciality}</Text>
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.textRating}>{stars}</Text>
              <Image
                source={RATING_IMAGE}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default PopularHome;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#d5d6d7',
    padding: 10,
    borderRadius: 10,
    minHeight: 80,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
  },
  iconContent: {
    marginRight: 10,
    backgroundColor: '#999a9b',
    borderRadius: 6,
    width: 70,
    height: 70,
  },
  infoContent: {
    display: 'flex',
  },
  title: {
    color: '#393738',
    fontFamily: 'Poppins-Medium',
    fontSize: 17,
  },
  optionsContent: {
    display: 'flex',
  },
  text: {
    color: '#979798',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  textRating: {
    color: '#979798',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
});

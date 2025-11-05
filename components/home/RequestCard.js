import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Image} from '@rneui/themed';
import {Rating} from 'react-native-ratings';
const RATING_IMAGE = require('../../assets/rating.png');
import {StatusRequest} from '../../config/Enum';

function RequestCard({request, specialityName, onPress}) {
  const getStatus = status => {
    if (status === StatusRequest.started) {
      return 'Pendiente de pago';
    }
    if (status === StatusRequest.inProgress) {
      return 'En proceso';
    }
    if (status === StatusRequest.finished) {
      return 'Finalizada';
    }
    return '';
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={styles.content}>
          <View style={styles.iconContent}>
            <Image
              source={{uri: request.doctorUser.url}}
              style={{
                width: 70,
                height: 70,
                borderRadius: 6,
              }}
            />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.title}>{request.doctorUser.fullName}</Text>
            <View style={styles.optionsContent}>
              <Text style={styles.text}>{specialityName}</Text>
              <View style={{display: 'flex'}}>
                <Text style={styles.textRating}>{getStatus(request.status)}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default RequestCard;

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

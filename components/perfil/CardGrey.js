import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Image} from '@rneui/themed';

function CarGrey({navigation, title, options, onPressEvent, image}) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={() => onPressEvent()} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContent}>
          <Image style={styles.stretch} source={image} />
        </View>
        <View style={styles.infoContent}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.optionsContent}>
            {options.map((opt, i) => (
              <Text style={styles.text} key={'opt-i'}>
                {opt}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default CarGrey;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#cdcdcd',
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
    borderRadius: 6,
    width: 70,
    height: 70,
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
    fontFamily: 'PoppinsMedium',
    fontSize: 14,
  },
  stretch: {
    width: 70,
    height: 70,
  },
});

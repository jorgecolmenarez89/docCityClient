import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const BotonBlack = ({ title, onPress, style = {} }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        ...style,
        ...styles.blackButton
      }}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  )
}

export default BotonBlack

const styles = StyleSheet.create({
  blackButton:{
    height: 50,
    width: 200,
    backgroundColor: 'black',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset:{
      width: 0,
      height: 3
    },
    shadowOpacity: 0.27,
    elevation: 6
  },
  buttonText:{
    color: 'white',
    fontSize: 18
  }
})


import React from 'react';

import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Icon} from '@rneui/themed';

export default Fab = ({iconName, onPress, style = {}}) => {
  return (
    <View style={{...style}}>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.blackButton}>
        <Icon
          name={iconName}
          color='black'
          size={30}
          type='ionicon'
          style={{
            left: 1,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  blackButton: {
    zIndex: 9999,
    height: 40,
    width: 40,
    backgroundColor: 'white',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
});

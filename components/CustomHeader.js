import React from 'react';
import {View} from 'react-native';
import {Icon} from '@rneui/themed';
import {StackActions} from '@react-navigation/native';
const popAction = StackActions.pop(1);

function CustomHeader({iconColor, iconName, onPressIcon}) {
  return (
    <View
      style={{
        height: 40,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
      }}>
      <Icon
        name={iconName}
        color={iconColor}
        size={27}
        type='ionicon'
        style={{marginTop: 5, marginLeft: 5}}
        onPress={() => onPressIcon()}
      />
    </View>
  );
}

export default CustomHeader;

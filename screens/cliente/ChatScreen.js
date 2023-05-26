import React, {useEffect, useState, useCallback, useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../../context/AuthContext';

function ChatScreen({navigation}) {
  const [chats, setChats] = useState([]);
  const {userLoged} = useContext(AuthContext);

  useFocusEffect(useCallback(() => {}, []));

  return (
    <View>
      <Text>ChatScreen</Text>
    </View>
  );
}

export default ChatScreen;

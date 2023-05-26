import React, {useEffect, useState, useCallback, useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../../context/AuthContext';

function ChatScreen({navigation}) {
  const [chats, setChats] = useState([]);
  const {userLoged} = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      let arrayChats = [];
      let objectChat = null;

      const unsubscribe = firestore()
        .collection('chats')
        .where('userId', '==', userLoged.id)
        .get()
        .then(querySnapshot => {
          console.log('Total chats: ', querySnapshot.size);

          querySnapshot.forEach(documentSnapshot => {
            console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
            objectChat = {...documentSnapshot.data(), id: documentSnapshot.id};
            arrayChats.push(objectChat);
          });
        });

      setChats(arrayChats);

      return () => unsubscribe();
    }, []),
  );

  return (
    <View>
      <Text>ChatScreen</Text>
    </View>
  );
}

export default ChatScreen;

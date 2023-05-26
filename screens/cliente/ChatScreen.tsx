import React, {useEffect, useState, useCallback, useContext} from 'react';
import {View, StyleSheet, FlatList, TouchableHighlight} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../../context/AuthContext';
import {getAllChats} from '../../services/user/chat';
import {Avatar, Text} from '@rneui/themed';
import {ASSETS, IS_ANDROID} from '../../config/Constant';
import Chat from '../../models/Chat';

function ChatScreen({navigation}) {
  const [chats, setChats] = useState<Chat[]>([]);
  const {userLoged} = useContext(AuthContext);

  const loadAllChats = async () => {
    const {status, data} = await getAllChats({user: userLoged});
    console.log('loadAllChats() ==> { status, data }', {status, data});
    if (status) {
      setChats(data);
    } else {
      setChats([]);
    }
  };

  useFocusEffect(useCallback(() => {}, []));

  useEffect(() => {
    loadAllChats();
  }, []);

  return (
    <View>
      <FlatList
        ItemSeparatorComponent={
          !IS_ANDROID &&
          (({highlighted}) => <View style={[style.separator, highlighted && {marginLeft: 0}]} />)
        }
        data={chats}
        extraData={chats}
        renderItem={({
          item,
          index,
          separators,
        }: {
          item: Chat;
          index: number;
          separators: {
            highlight: () => void;
            unhighlight: () => void;
            updateProps: (select: 'leading' | 'trailing', newProps: any) => void;
          };
        }) => {
          return (
            <TouchableHighlight
              key={item.data.id}
              onPress={() => console.log('item ==>', item)}
              onShowUnderlay={separators.highlight}
              onHideUnderlay={separators.unhighlight}>
              <View
                style={{
                  backgroundColor: 'white',
                  flexDirection: 'row',
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                  <Avatar
                    rounded
                    size={'medium'}
                    source={{uri: item.data.receiver?.photo || ASSETS.user}}
                  />
                  <Text style={{marginHorizontal: 10, textTransform: 'capitalize'}}>
                    {item.data.receiver?.fullName}
                  </Text>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Text>{item.data.updateAtDisplay}</Text>
                </View>
              </View>
            </TouchableHighlight>
          );
        }}
      />
    </View>
  );
}

export default ChatScreen;

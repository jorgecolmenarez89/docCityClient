import React, {useEffect, useState, useCallback, useContext} from 'react';
import {View, FlatList, TouchableHighlight, RefreshControl} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../../context/AuthContext';
import {getAllChats} from '../../services/user/chat';
import {Avatar, Text, useTheme} from '@rneui/themed';
import {ASSETS} from '../../config/Constant';
import Chat from '../../models/Chat';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../config/Types';
import {NavigationRoutes} from '../../config/Enum';

type ChatsScreenProps = NativeStackScreenProps<RootStackParamList, NavigationRoutes.chat>;

function ChatsScreen({navigation}: ChatsScreenProps) {
  const {theme} = useTheme();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {userLoged} = useContext(AuthContext);

  const loadAllChats = async () => {
    setIsLoading(true);
    const {status, data} = await getAllChats({user: userLoged});
    console.log('loadAllChats() ==> { status, data }', {status, data});
    if (status) {
      setChats(data);
    } else {
      setChats([]);
    }
    setIsLoading(false);
  };

  useFocusEffect(useCallback(() => {}, []));

  useEffect(() => {
    loadAllChats();
  }, []);

  return (
    <View style={{flex: 1, height: '100%'}}>
      <FlatList
        style={{flex: 1}}
        data={chats}
        extraData={chats}
        refreshing={isLoading}
        refreshControl={
          <RefreshControl
            colors={[theme.colors.primary]}
            refreshing={isLoading || false}
            onRefresh={() => loadAllChats()}
          />
        }
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
              style={{
                marginBottom: 1,
                borderBottomWidth: 0.5,
                borderBottomColor: theme.colors.grey1,
              }}
              key={item.data.id}
              onPress={() =>
                navigation.navigate(NavigationRoutes.chat, {
                  id: item.data.id || '',
                  receiver: item.data.receiver?.id || '',
                })
              }
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
                    source={{
                      uri:
                        (item.data.receiver?.url || 'null') !== 'null'
                          ? item.data.receiver?.url
                          : ASSETS.user,
                    }}
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

export default ChatsScreen;

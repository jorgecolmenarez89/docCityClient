import React, {useEffect, useState, useCallback, useContext} from 'react';
import {View, FlatList, TouchableHighlight, RefreshControl, StyleSheet} from 'react-native';
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

  const loadAllChats = useCallback(async () => {
    setIsLoading(true);
    const {status, data} = await getAllChats({user: userLoged});
    if (status) {
      // Ordenar chats: primero los activos, luego los finalizados
      const sortedChats = [...data].sort((a, b) => {
        const aIsActive = !a.data.requestFinish;
        const bIsActive = !b.data.requestFinish;
        if (aIsActive && !bIsActive) return -1;
        if (!aIsActive && bIsActive) return 1;
        return 0;
      });
      setChats(sortedChats);
    } else {
      setChats([]);
    }
    setIsLoading(false);
  }, [userLoged]);

  useFocusEffect(
    useCallback(() => {
      // Recargar chats cuando la pantalla recibe el foco
      loadAllChats();
    }, [loadAllChats]),
  );

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
          const isActive = !item.data.requestFinish;
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
                style={[
                  styles.chatItem,
                  {
                    backgroundColor: 'white',
                    opacity: isActive ? 1 : 0.7,
                  },
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                  }}>
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
                  <View style={{marginLeft: 10, flex: 1}}>
                    <Text style={{textTransform: 'capitalize', fontFamily: 'Poppins-SemiBold'}}>
                      {item.data.receiver?.fullName}
                    </Text>
                    <View style={styles.statusBadgeContainer}>
                      <View
                        style={[
                          styles.statusBadge,
                          isActive ? styles.statusBadgeActive : styles.statusBadgeFinished,
                        ]}>
                        <Text
                          style={[
                            styles.statusBadgeText,
                            isActive
                              ? styles.statusBadgeTextActive
                              : styles.statusBadgeTextFinished,
                          ]}>
                          {isActive ? 'Activo' : 'Finalizado'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'flex-end'}}>
                  <Text style={{fontSize: 12, color: '#666666', fontFamily: 'Poppins-Regular'}}>
                    {item.data.updateAtDisplay}
                  </Text>
                </View>
              </View>
            </TouchableHighlight>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadgeContainer: {
    marginTop: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusBadgeActive: {
    backgroundColor: '#d4edda',
  },
  statusBadgeFinished: {
    backgroundColor: '#f8d7da',
  },
  statusBadgeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
  },
  statusBadgeTextActive: {
    color: '#155724',
  },
  statusBadgeTextFinished: {
    color: '#721c24',
  },
});

export default ChatsScreen;

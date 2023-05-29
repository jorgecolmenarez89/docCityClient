import React, {useEffect, useState, useContext, useRef, LegacyRef} from 'react';
import {SvgXml} from 'react-native-svg';
import {View, StyleSheet, FlatList, TextInput, Keyboard} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthContext} from '../../context/AuthContext';
import {addMessage, getChatById} from '../../services/user/chat';
import {Avatar, Icon, Image, Input, Text, useTheme} from '@rneui/themed';
import {ASSETS, NAME_ICON} from '../../config/Constant';
import Chat from '../../models/Chat';
import {RootStackParamList} from '../../config/Types';
import {NavigationRoutes, TypeToast} from '../../config/Enum';
import ChatMessage, {ChatMessageStatus} from '../../models/ChatMessage';

import flatMessage from '../../assets/flat-message.svg';
import flatReceiverMessage from '../../assets/flat-message-receiver.svg';
import {dateMessage} from '../../helpers/Converts';

type ChatScreenProps = NativeStackScreenProps<RootStackParamList, NavigationRoutes.chat>;

const ChatScreen = ({navigation, route}: ChatScreenProps) => {
  const {theme} = useTheme();
  const {showToast} = useContext(AuthContext);
  const listMessages = useRef<FlatList<ChatMessage>>(null);

  const [chat, setChat] = useState<Chat>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>();
  const [numberOfLines, setNumberOfLines] = useState<number>(1);
  const {userLoged} = useContext(AuthContext);

  const loadChat = async (id: string) => {
    const {status, data} = await getChatById(id, userLoged);
    console.log('loadChat() ==> { status, data }', {status, data});
    if (status && data) {
      setChat(data);
      setMessages(data.data.messages || []);
      setTimeout(() => {
        listMessages?.current?.scrollToEnd();
      }, 500);
    } else {
      setChat(undefined);
    }
  };

  const onSendMessage = async () => {
    if (chat && newMessage !== '' && newMessage !== undefined) {
      const nextMessage = new ChatMessage({
        text: newMessage || '',
        autorId: userLoged.id,
        status: ChatMessageStatus.new,
        updateAt: new Date(),
        updateAtDisplay: dateMessage(new Date()),
        createAt: new Date(),
        createAtDisplay: dateMessage(new Date()),
      });
      const {status, data} = await addMessage({
        chat,
        message: nextMessage,
      });

      console.log('onSendMessage() ==> { status, data }', {status, data, nextMessage});
      if (status) {
        setMessages([...messages, nextMessage]);
        setNewMessage('');
        setNumberOfLines(1);
        listMessages?.current?.scrollToEnd();
      } else {
        showToast({
          title: 'Error',
          description: 'No fue posible enviar el mensaje.',
          type: TypeToast.error,
        });
      }
    } else {
      showToast({title: 'Completa los datos', type: TypeToast.error});
    }
  };

  useEffect(() => {
    const {id} = route.params;
    if (id) {
      loadChat(id);
    }

    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => {
        listMessages?.current?.scrollToEnd();
        console.log('showSubscription ==> ', true);
      }, 50);
    });
    //const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
    //});

    return () => {
      showSubscription.remove();
      //hideSubscription.remove();
    };
  }, [route]);

  return (
    <View style={{flex: 1}}>
      {/** header */}
      <View style={[styles.header, {backgroundColor: theme.colors.primary}]}>
        <Icon
          name={NAME_ICON.arrowLeft}
          type='ionicon'
          color='white'
          onPress={() => {
            navigation.goBack();
          }}
        />

        <Avatar rounded size={'small'} source={{uri: chat?.data.receiver?.photo || ASSETS.user}} />

        <Text style={styles.title}>{chat?.data.receiver?.fullName}</Text>
      </View>

      {/** listado de mensajes*/}

      {messages && messages.length === 0 && <View style={{flex: 1}} />}
      {messages && messages.length > 0 && (
        <FlatList
          ref={listMessages}
          style={{flex: 1}}
          data={messages}
          extraData={messages}
          renderItem={({item, index}: {item: ChatMessage; index: number}) => {
            return (
              <View
                style={[
                  styles.message,
                  {
                    marginBottom: 3,
                    width: '100%',
                    flex: 1,
                    paddingTop: index === 0 ? 10 : 0,
                    //paddingHorizontal: 10,
                    alignItems: item.data.autorId === userLoged.id ? 'flex-end' : 'flex-start',
                    //flexDirection: 'row',
                  },
                ]}>
                <View style={{flexDirection: 'row'}}>
                  {item.data.autorId !== userLoged.id && (
                    <SvgXml width='10' height='10' xml={flatReceiverMessage} />
                  )}

                  <View
                    style={{
                      padding: 10,
                      backgroundColor:
                        item.data.autorId !== userLoged.id
                          ? theme.colors.primary
                          : theme.colors.secondary,
                      borderTopStartRadius: item.data.autorId !== userLoged.id ? 0 : 10,
                      borderTopEndRadius: item.data.autorId === userLoged.id ? 0 : 10,
                      borderBottomEndRadius: 10,
                      borderBottomStartRadius: 10,
                      width: '80%',
                      flexDirection: 'row',
                      position: 'relative',
                    }}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textMessage}>{item.data.text}</Text>
                    </View>

                    <View style={{position: 'absolute', bottom: 5, right: 5}}>
                      <Text style={[styles.textMessage, {fontSize: 10}]}>
                        {item.data.createAtDisplay}
                      </Text>
                    </View>
                  </View>

                  {item.data.autorId === userLoged.id && (
                    <SvgXml width='10' height='10' xml={flatMessage} />
                  )}
                </View>
              </View>
            );
          }}
        />
      )}

      {/** input */}
      <View
        style={{
          //backgroundColor: 'blue',
          marginBottom: 0,
          paddingBottom: 0,
          paddingVertical: 2,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TextInput
            multiline
            numberOfLines={numberOfLines}
            style={{
              borderRadius: 8,
              marginBottom: 0,
              borderWidth: 2,
              backgroundColor: 'transparent',
              color: 'black',
              flex: 1,
            }}
            placeholderTextColor={'rgba(0,0,0,0.6)'}
            value={newMessage}
            placeholder={'Mensaje...'}
            onChangeText={value => {
              const lineBreaks = value.split(/\r\n|\r|\n/);
              if (lineBreaks.length >= 4) {
                setNumberOfLines(4);
              } else {
                setNumberOfLines(lineBreaks.length);
              }
              setNewMessage(value);
            }}
          />
          <Icon
            onPress={() => onSendMessage()}
            name={NAME_ICON.sendOutline}
            containerStyle={{margin: 0, marginLeft: 2}}
            color={theme.colors.primary}
            reverse
            disabled={newMessage === undefined || newMessage === ''}
            type='ionicon'
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginHorizontal: 10,
    color: 'white',
  },
  message: {
    marginBottom: 10,
  },
  textMessage: {
    color: 'white',
  },
});

export default ChatScreen;

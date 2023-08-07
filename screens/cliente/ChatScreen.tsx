import React, {useEffect, useState, useContext, useRef, useCallback} from 'react';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {Asset, launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {View, StyleSheet, FlatList, TextInput, Keyboard, Dimensions} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthContext} from '../../context/AuthContext';
import {PermisionsContext} from '../../context/PermisionsContext';
import {addMessage, getChatById} from '../../services/user/chat';
import {Avatar, Dialog, Icon, Image, Text, useTheme} from '@rneui/themed';
import {ASSETS, NAME_ICON} from '../../config/Constant';
import Chat, {ChatModel, ChatStatus} from '../../models/Chat';
import {RootStackParamList} from '../../config/Types';
import {NavigationRoutes, StateUserInUseApp, TypeToast} from '../../config/Enum';
import ChatMessage, {ChatMessageStatus} from '../../models/ChatMessage';

import {dateMessage} from '../../helpers/Converts';
import {sendNotificationChat} from '../../services/doctor/notification';
import {useIsFocused} from '@react-navigation/native';
import {Box, Center, HStack, IconButton, Stagger, useDisclose} from 'native-base';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import {TouchableOpacity} from 'react-native-gesture-handler';

type ChatScreenProps = NativeStackScreenProps<RootStackParamList, NavigationRoutes.chat>;

const {width, height} = Dimensions.get('window');

const ChatScreen = ({navigation, route}: ChatScreenProps) => {
  const {isOpen, onToggle} = useDisclose();
  const {theme} = useTheme();
  const {showToast, appState, userLoged} = useContext(AuthContext);
  const {checkCameraPermission} = useContext(PermisionsContext);
  const isFocused = useIsFocused();
  const listMessages = useRef<FlatList<ChatMessage>>(null);
  const [imgCurrent, setImgCurrent] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const [chat, setChat] = useState<Chat>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>();
  const [newAssets, setNewAssets] = useState<Asset[]>();
  const [numberOfLines, setNumberOfLines] = useState<number>(1);
  const [stateReceiver, setStateReceiver] = useState(StateUserInUseApp.outLine);

  const onLaunchLibrary = async () => {
    try {
      onToggle();
      const {assets} = await launchImageLibrary({mediaType: 'photo', selectionLimit: 1});
      console.log('onLaunchLibrary() ==>', {assets});
      if (assets) {
        setNewAssets(assets);
      }
    } catch (err) {
      showToast({title: 'No fue posible cargar la imagen', type: TypeToast.error});
    }
  };

  const onLaunchCamera = async () => {
    try {
      const result = await checkCameraPermission();
      if (result) {
        onToggle();
        const result = await launchCamera({mediaType: 'photo'});
        console.log('onLaunchCamera() ==>', {result});
        if (result.assets) {
          setNewAssets(result.assets);
        }
      } else {
        onToggle();
      }
    } catch (err) {
      showToast({title: 'No fue posible cargar la imagen', type: TypeToast.error});
    }
  };

  const loadChat = async (id: string) => {
    const {status, data} = await getChatById(id, userLoged);
    console.log('chat', data);
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

  const uploadAssets = async () => {
    try {
      if (newAssets) {
        let urls = [];
        for await (let newAsset of newAssets) {
          const reference = storage().ref(`/chats/${chat?.data.id}/${newAsset.fileName}`);
          const task = await reference.putFile(newAsset.uri);
          const url = await reference.getDownloadURL();
          urls.push(url);
        }
        return urls;
      } else {
        return undefined;
      }
    } catch (err) {
      console.log('uploadAssets() ==>', err);
      return undefined;
    }
  };

  const onSendMessage = async () => {
    setIsLoading(true);
    const msgNew = newMessage;
    const urls = await uploadAssets();
    console.log('onSendMessage() ==> urls', {urls});
    const nextMessage = new ChatMessage({
      text: msgNew,
      imgs: urls,
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

    if (status) {
      setMessages([...messages, nextMessage]);
      setNewMessage('');
      setNewAssets(undefined);
      setNumberOfLines(1);
      listMessages?.current?.scrollToEnd();
      sendNotificationChat({
        doctor: chat.data.doctor,
        user: userLoged,
        message: nextMessage,
        chat: chat,
      });
    } else {
      showToast({
        title: 'Error',
        description: 'No fue posible enviar el mensaje.',
        type: TypeToast.error,
      });
    }
    setIsLoading(false);
  };

  const handleSubmit = useCallback(
    (messages: ChatMessage[]) => {
      console.log('isFocused ==>', {isFocused, messages, appState});
    },
    [messages, isFocused, appState],
  );

  const handleDisabled = () => {
    let result = true;
    if (newMessage && newMessage !== '') {
      result = false;
    } else if (newAssets && newAssets.length > 0) {
      result = false;
    }
    return result;
  };

  useEffect(() => {
    const {id, receiver} = route.params;
    console.log('useEffect() ==> { id, receiver }', {id, receiver});
    if (id) {
      loadChat(id);
    }

    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => {
        listMessages?.current?.scrollToEnd();
        console.log('showSubscription ==> ', true);
      }, 50);
    });

    const subscriber = firestore()
      .collection('chats')
      .doc(id)
      .onSnapshot(documentsSnapshot => {
        const chatChange: ChatModel = {...documentsSnapshot.data(), id: documentsSnapshot.id};
        const updateChat = new Chat(Chat.formatData({data: chatChange, userLog: userLoged}));
        setMessages(updateChat.data.messages);
        listMessages?.current?.scrollToEnd();
        handleSubmit(updateChat.data.messages);
      });

    const subscriberUser = firestore()
      .collection('users')
      .doc(receiver)
      .onSnapshot(documentsSnapshot => {
        console.log('documentsSnapshot user =>', {
          data: documentsSnapshot,
          id: receiver,
          chat: chat,
        });
        if (documentsSnapshot.data()) {
          setStateReceiver(documentsSnapshot.data().state || StateUserInUseApp.outLine);
        }
      });

    return () => {
      showSubscription.remove();
      subscriber();
      subscriberUser();
    };
  }, [route]);

  useEffect(() => {
    console.log('appState =>', {appState});
  }, [appState]);

  return (
    <View style={{flex: 1, position: 'relative'}}>
      {/** header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.disabled,
            borderBottomEndRadius: 15,
            borderBottomStartRadius: 15,
          },
        ]}>
        <Icon
          name={NAME_ICON.arrowLeft}
          type='material'
          size={15}
          color={theme.colors.grey2}
          onPress={() => {
            navigation.navigate(NavigationRoutes.chats);
          }}
        />

        <Avatar
          rounded
          size={'small'}
          source={{
            uri:
              (chat?.data.receiver?.url || 'null') !== 'null'
                ? chat?.data.receiver?.url
                : ASSETS.user,
          }}
        />

        <View style={{flexDirection: 'column'}}>
          <Text style={[styles.title, {color: theme.colors.grey2}]}>
            {chat?.data.receiver?.fullName}
          </Text>
          {stateReceiver === StateUserInUseApp.onLine && (
            <Text style={[styles.title, {color: theme.colors.success}]}>{stateReceiver}</Text>
          )}
        </View>
      </View>

      {/** listado de mensajes*/}

      {messages && messages.length === 0 && <View style={{flex: 1}} />}
      {!newAssets && messages && messages.length > 0 && (
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
                    marginBottom: 10,
                    width: '100%',
                    flex: 1,
                    paddingTop: index === 0 ? 10 : 0,
                    paddingHorizontal: 10,
                    alignItems: item.data.autorId === userLoged.id ? 'flex-end' : 'flex-start',
                  },
                ]}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      padding: 10,
                      backgroundColor:
                        item.data.autorId !== userLoged.id
                          ? theme.colors.white
                          : theme.colors.primary,
                      borderTopStartRadius: item.data.autorId !== userLoged.id ? 0 : 15,
                      borderTopEndRadius: item.data.autorId === userLoged.id ? 0 : 15,
                      borderBottomEndRadius: 15,
                      borderBottomStartRadius: 15,
                      width: '80%',
                      flexDirection: 'column',
                      position: 'relative',
                    }}>
                    {item.data.imgs &&
                      item.data.imgs.map(img => {
                        return (
                          <Image
                            key={img}
                            source={{uri: img}}
                            style={{width: '100%', height: 200}}
                            onPress={() => setImgCurrent(img)}
                          />
                        );
                      })}

                    <View style={{flex: 1}}>
                      <Text
                        style={[
                          styles.textMessage,
                          {
                            color:
                              item.data.autorId !== userLoged.id
                                ? theme.colors.black
                                : theme.colors.white,
                          },
                        ]}>
                        {item.data.text}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{marginTop: 2}}>
                  <Text style={[styles.textMessage, {fontSize: 10, color: theme.colors.grey3}]}>
                    {item.data.createAtDisplay}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      )}

      {newAssets && (
        <View style={{flex: 1, width: '100%'}}>
          <SwiperFlatList
            index={0}
            showPagination
            paginationStyleItemActive={{backgroundColor: theme.colors.primary}}
            paginationStyleItemInactive={{backgroundColor: theme.colors.disabled}}
            data={newAssets}
            renderItem={({item, index}) => (
              <View style={[{width: width, height: '100%', position: 'relative'}]}>
                <View
                  style={{
                    top: 10,
                    right: 10,
                    position: 'absolute',
                    zIndex: 999,
                  }}>
                  <Icon
                    name={NAME_ICON.close}
                    type='ionicon'
                    size={35}
                    onPress={() => {
                      const resultt = newAssets.splice(index, 1);
                      console.log('resultt', {resultt, newAssets});
                      if (newAssets.length > 0) {
                        setNewAssets([...newAssets]);
                      } else {
                        setNewAssets(undefined);
                      }
                    }}
                  />
                </View>
                <Image
                  key={item.fileName}
                  source={{uri: item.uri}}
                  style={{width: width, height: '100%'}}
                  resizeMode='contain'
                />
              </View>
            )}
          />
        </View>
      )}

      {/** input */}
      {chat && chat.data.status === ChatStatus.ACTIVE && (
        <View
          style={{
            borderTopEndRadius: 15,
            borderTopStartRadius: 15,
            backgroundColor: theme.colors.disabled,
            paddingVertical: 15,
            paddingHorizontal: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: 30,
              backgroundColor: 'white',
            }}>
            <TextInput
              multiline
              numberOfLines={numberOfLines}
              style={{
                borderWidth: 0,
                backgroundColor: 'transparent',
                color: 'black',
                flex: 1,
                marginHorizontal: 10,
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

            <Center>
              <Box alignItems='center' position='absolute' bottom={10}>
                <Stagger
                  visible={isOpen}
                  initial={{
                    opacity: 0,
                    scale: 0,
                    translateY: 34,
                  }}
                  animate={{
                    translateY: 0,
                    scale: 1,
                    opacity: 1,
                    transition: {
                      type: 'spring',
                      duration: 50,
                      mass: 0.8,
                      stagger: {
                        offset: 30,
                        reverse: true,
                      },
                    },
                  }}
                  exit={{
                    translateY: 34,
                    scale: 0.5,
                    opacity: 0,
                    transition: {
                      duration: 100,
                      stagger: {
                        offset: 30,
                        reverse: true,
                      },
                    },
                  }}>
                  <Icon
                    onPress={() => onLaunchLibrary()}
                    name={NAME_ICON.photo}
                    size={15}
                    color={theme.colors.success}
                    reverse
                    type='material'
                  />
                  <Icon
                    onPress={() => onLaunchCamera()}
                    name={NAME_ICON.camera}
                    size={15}
                    color={theme.colors.warning}
                    reverse
                    type='material'
                  />
                </Stagger>
              </Box>
              <HStack alignItems='center'>
                <Icon
                  onPress={() => onToggle()}
                  name={NAME_ICON.attachment}
                  size={15}
                  color={theme.colors.primary}
                  reverse
                  type='material'
                />
              </HStack>
            </Center>

            <Icon
              onPress={() => onSendMessage()}
              name={NAME_ICON.sendOutline}
              size={15}
              color={theme.colors.primary}
              reverse
              disabled={handleDisabled()}
              type='ionicon'
            />
          </View>
        </View>
      )}

      {imgCurrent && (
        <View
          style={{
            flex: 1,
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: theme.colors.disabled,
          }}>
          <View
            style={{
              top: 10,
              right: 10,
              position: 'absolute',
              zIndex: 999,
            }}>
            <Icon
              name={NAME_ICON.close}
              type='ionicon'
              size={35}
              onPress={() => {
                setImgCurrent(undefined);
              }}
            />
          </View>
          <Image
            key={imgCurrent}
            source={{uri: imgCurrent}}
            style={{width: width, height: '100%'}}
            resizeMode='contain'
          />
        </View>
      )}

      <Dialog
        isVisible={isLoading}
        onBackdropPress={() => setIsLoading(false)}
        overlayStyle={{backgroundColor: 'transparent', borderWidth: 0, elevation: 0}}>
        <Dialog.Loading />
      </Dialog>
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

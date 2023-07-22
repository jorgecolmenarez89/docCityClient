import React, {useEffect, useState, useContext, useRef} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Image, Tab, TabView, useTheme} from '@rneui/themed';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AirbnbRating} from 'react-native-ratings';
import {NavigationRoutes} from '../../config/Enum';
import {RootStackParamList} from '../../config/Types';
import {requestById, getRatingDoctor} from '../../services/doctor/request';
import Chat from '../../models/Chat';
import {AuthContext} from '../../context/AuthContext';
import ChatMessage from '../../models/ChatMessage';
import {getChatById} from '../../services/user/chat';
import CustomHeader from '../../components/CustomHeader';

type DetailScreenProps = NativeStackScreenProps<RootStackParamList>;

function DetailConsultation({navigation, route}: DetailScreenProps) {
  const {theme} = useTheme();
  const {userLoged} = useContext(AuthContext);
  const [request, setRequest] = useState(null);
  const [index, setIndex] = useState(0);
  const [rankinkg, setRankinkg] = useState(0);
  const [chat, setChat] = useState<Chat>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const listMessages = useRef<FlatList<ChatMessage>>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (route.params?.id) {
      const idRequest = route.params?.id;
      getRequestData(idRequest);
      loadChat(idRequest.toString());
    }
  }, [route]);

  const getRequestData = async (id: any) => {
    try {
      const {data} = await requestById(id);
      setRequest(data.data);
      const {data: rango} = await getRatingDoctor(data.data.doctorUser.id);
      const stars = rango.data[0].avgRating;
      setRankinkg(stars);
    } catch (error) {
      console.log('error en getRequestData', error);
    }
  };

  const loadChat = async (id: string) => {
    const {status, data} = await getChatById(id, userLoged);
    if (status && data) {
      setChat(data);
      setMessages(data.data.messages || []);
    } else {
      setChat(undefined);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{marginTop: 10, marginLeft: 20}}>
        <CustomHeader
          iconColor='#0b445e'
          iconName='arrow-back'
          onPressIcon={() => navigation.goBack()}
        />
      </View>
      {request && (
        <View style={{flex: 1}}>
          <View style={styles.center}>
            <Image
              source={{
                uri: request.doctorUser.url,
              }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 50,
              }}
            />
          </View>

          <View style={styles.header}>
            <Text style={styles.titleHeader}>{request.doctorUser.fullName}</Text>
            <Text style={styles.textHeader}>{request.doctorUser.speciality.Name}</Text>
            <View
              style={{display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center'}}>
              <Text style={{...styles.textHeader, marginTop: 4}}>Ranking: </Text>
              <AirbnbRating
                showRating={false}
                count={5}
                defaultRating={rankinkg}
                size={20}
                isDisabled
                selectedColor='white'
                starContainerStyle={{
                  paddingRight: 10,
                }}
              />
            </View>
          </View>
          <View style={styles.body}>
            <Tab value={index} onChange={setIndex} dense>
              <Tab.Item>Diagnostico</Tab.Item>
              <Tab.Item>Historia Médica</Tab.Item>
            </Tab>
            <TabView value={index} onChange={setIndex} animationType='spring'>
              <TabView.Item style={styles.styleTabview}>
                <Text style={styles.textDiagnostic}>{request.description}</Text>
              </TabView.Item>
              <TabView.Item style={styles.styleTabview}>
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
                            alignItems:
                              item.data.autorId === userLoged.id ? 'flex-end' : 'flex-start',
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
                          <Text
                            style={[styles.textMessage, {fontSize: 10, color: theme.colors.grey3}]}>
                            {item.data.createAtDisplay}
                          </Text>
                        </View>
                      </View>
                    );
                  }}
                />
              </TabView.Item>
            </TabView>
          </View>
        </View>
      )}
    </View>
  );
}

export default DetailConsultation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 10,
    height: 130,
    backgroundColor: '#005d81',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    display: 'flex',
  },
  body: {
    marginTop: -30,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    padding: 10,
  },
  titleHeader: {
    fontFamily: 'Poppins-Bold',
    fontSize: 17,
    color: '#fff',
  },
  textHeader: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: '#fff',
  },
  textDiagnostic: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
  },
  styleTabview: {
    width: '100%',
    marginTop: 10,
  },
  message: {
    marginBottom: 10,
  },
  textMessage: {
    color: 'white',
  },
});

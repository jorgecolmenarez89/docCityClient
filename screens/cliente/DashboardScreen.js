import React, {useContext, useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {Button, Dialog} from '@rneui/themed';
import {View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar, Modal} from 'react-native';
import CardSolicitar from '../../components/home/CardSolicitar';
import CardBuscar from '../../components/home/CardBuscar';
import Items from '../../components/home/Items';
import Populares from '../../components/home/Populares';
import {AuthContext} from '../../context/AuthContext';
import {requestOpenedPacient, updateRequest} from '../../services/doctor/request';
import {Avatar, Icon} from '@rneui/themed';
import {ASSETS} from '../../config/Constant';
import {NavigationRoutes, StatusRequest} from '../../config/Enum';
import {Rating} from 'react-native-ratings';
import {getLocationDetails} from '../../services/doctor/address';
import {useLocation} from '../../hooks/useLocation';

function DashboardScreen({navigation}) {
  const {userLoged, specialities} = useContext(AuthContext);
  const {getCurrentLocation} = useLocation();

  const [requests, setRequests] = useState();
  const [request, setRequest] = useState();
  const [isRanking, setIsRanking] = useState(false);
  const [valRanking, setValRanking] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [populars, setPopulars] = useState([
    {
      name: 'Alexander Zambrano',
      especialidad: 'Traumatólogo',
      valoracion: 5,
    },
    {
      name: 'Maria Lugo',
      especialidad: 'Ginecotólogo',
      valoracion: 5,
    },
    {
      name: 'Jose Aldana',
      especialidad: 'Cardiólogo',
      valoracion: 5,
    },
  ]);
  const [details, setDetails] = useState(null);

  const onLoadLastRequest = async () => {
    try {
      const {status, data} = await requestOpenedPacient(userLoged.id);
      console.log('onLoadLastRequest() => {status, data}', {status, data});

      if (status === 200) {
        if (data.data.length > 0) {
          setRequests(data.data);
        } else {
          setRequests(undefined);
        }
      }
    } catch (err) {
      setRequests(undefined);
    }
  };

  useEffect(() => {
    onLoadLastRequest();

    const subscriberRequest = firestore()
      .collection('consultations')
      .where('userId', '==', userLoged.id)
      .onSnapshot(documentsSnapshot => {
        onLoadLastRequest();
      });
    console.log('useEffeect() 2 ==>', {requests, userLoged});
    return () => {
      subscriberRequest();
    };
  }, [userLoged]);

  useEffect(() => {
    getAdress();
  }, []);

  const getAdress = async () => {
    const {latitude, longitude} = await getCurrentLocation();
    const {data} = await getLocationDetails(latitude, longitude);
    setDetails(data);
  };

  const getFormatState = state => {
    if (state.includes('State')) {
      return state.split('State')[0];
    } else {
      return state;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {details && (
          <View style={styles.ubicationContainer}>
            <View style={styles.ubicationContainerTitleContent}>
              <Icon
                type='ionicon'
                color='#06060a'
                name='location-outline'
                style={{marginRight: 5}}
              />
              <Text style={styles.descriptionText}>Ubicación</Text>
            </View>
            <Text style={styles.descriptionText}>
              {details.countryRegion}, {getFormatState(details.adminDistrict)}
            </Text>
          </View>
        )}

        <CardSolicitar navigation={navigation} />
        <View style={styles.spacer} />

        <View style={styles.sectionSeparatpor}>
          <Text style={styles.sectionTitle}>Información de interes</Text>
        </View>

        <Items navigation={navigation} />

        {requests && (
          <View style={styles.sectionSeparatpor}>
            <Text style={styles.sectionTitle}>Solicitudes actuales</Text>
          </View>
        )}

        {requests &&
          requests.map((p, i) => (
            <View style={{marginBottom: 15}} key={'popular-' + i}>
              <Populares
                onPress={() => {
                  console.log('p ==>', p);
                  setRequest(p);
                }}
                title={p.doctorUser.fullName}
                stars={0}
                speciality={
                  specialities.find(spec => spec.id === p.doctorUser.medicalSpecialityId).name
                }
              />
            </View>
          ))}

        <View style={styles.spacer} />

        <View style={styles.sectionSeparatpor}>
          <Text style={styles.sectionTitle}>Médicos más populares</Text>
        </View>

        <View style={styles.spacer}></View>

        {populars.map((p, i) => (
          <View style={{marginBottom: 15}} key={'popular-' + i}>
            <Populares title={p.name} stars={p.valoracion} speciality={p.especialidad} />
          </View>
        ))}
      </ScrollView>

      <Dialog isVisible={request ? true : false}>
        {request && (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Avatar
              source={{uri: request.doctorUser.url || ASSETS.user}}
              containerStyle={{marginBottom: 10}}
              size='large'
            />
            <Text style={{textTransform: 'capitalize', fontWeight: 'bold'}}>
              {request.doctorUser.fullName}
            </Text>
            <Text style={{textTransform: 'capitalize', fontWeight: 'bold'}}>
              {specialities.find(spec => spec.id === request.doctorUser.medicalSpecialityId).name}
            </Text>

            <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
              <Button
                title={'Finalizar'}
                containerStyle={{flex: 1}}
                onPress={async () => {
                  setIsLoading(true);
                  const {status, data} = await updateRequest({
                    ...request,
                    userId: request.pacientUser.id,
                    user: request.pacientUser,
                    doctor: request.doctorUser,
                    status: StatusRequest.finished,
                  });
                  setIsLoading(false);
                  setIsRanking(true);
                }}
              />
              <Button
                title={'Ver chat'}
                type='outline'
                containerStyle={{flex: 1}}
                loading={isLoading}
                onPress={() => {
                  setRequest(undefined);
                  navigation.navigate('ChatsStack', {
                    screen: NavigationRoutes.chat,
                    params: {id: `${request.id}`, receiver: request.pacientUser.id},
                  });
                }}
              />
            </View>
          </View>
        )}
      </Dialog>

      {isRanking && (
        <Dialog isVisible={isRanking}>
          <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>
            Califica el servicio
          </Text>
          <Text>
            Como te fue con el doctor, calificalo con 5 extrellas si es exelente o 1 si es muy
            deficiente.
          </Text>
          <Rating
            onFinishRating={val => setValRanking(val)}
            minValue={0}
            startingValue={0}
            style={{paddingVertical: 10}}
          />
          <View>
            <Button
              disabled={valRanking === 0}
              loading={isLoading}
              onPress={async () => {
                setIsLoading(true);
                const {status, data} = await updateRequest({
                  ...request,
                  userId: request.pacientUser.id,
                  user: request.pacientUser,
                  doctor: request.doctorUser,
                  status: StatusRequest.finished,
                  serviceRating: `${valRanking}`,
                });
                console.log('press => ', {status, data, request});
                setIsLoading(false);
                setRequest(undefined);
                setIsRanking(false);
              }}>
              <Text style={{color: 'white'}}>Calificar</Text>
            </Button>
          </View>
        </Dialog>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fc',
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  ubicationContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 15,
  },
  ubicationContainerTitleContent: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionText: {
    fontFamily: 'Poppins-Medium',
    color: '#06060a',
  },
  spacer: {
    marginVertical: 8,
  },
  sectionSeparatpor: {},
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#06060a',
  },
});

export default DashboardScreen;

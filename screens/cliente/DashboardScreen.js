import React, {useContext, useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {AirbnbRating} from 'react-native-ratings';
import {Button, Dialog, Image} from '@rneui/themed';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Modal,
  Dimensions,
  TextInput,
} from 'react-native';
import CardSolicitar from '../../components/home/CardSolicitar';
import Items from '../../components/home/Items';
import Populares from '../../components/home/Populares';
import PopularHome from '../../components/home/PopularHome';
import {AuthContext} from '../../context/AuthContext';
import {requestOpenedPacient, updateRequest} from '../../services/doctor/request';
import {Avatar, Icon, useTheme} from '@rneui/themed';
import {ASSETS} from '../../config/Constant';
import {NavigationRoutes, StatusRequest} from '../../config/Enum';
import {Rating} from 'react-native-ratings';
import {getLocationDetails} from '../../services/doctor/address';
import {useLocation} from '../../hooks/useLocation';
import {getPopulars, getPopular} from '../../services/user/doctors';
import {sendNotificationDoctorFinish} from '../../services/doctor/notification';

function DashboardScreen({navigation}) {
  const {userLoged, specialities} = useContext(AuthContext);
  const {getCurrentLocation} = useLocation();
  const {theme} = useTheme();

  const [requests, setRequests] = useState();
  const [request, setRequest] = useState();
  const [isRanking, setIsRanking] = useState(false);
  const [valRanking, setValRanking] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [populars, setPopulars] = useState([]);
  const [details, setDetails] = useState(null);
  const [openModalPopular, setOpenModalPopular] = useState(false);
  const [popularDetail, setPopularDetail] = useState(null);
  const [medicalDetail, setMedicalDetail] = useState(null);
  const [comment, setComment] = useState('');

  const {width, height} = Dimensions.get('window');
  const ratio = width / 541; //541 is actual image width

  const onLoadLastRequest = async () => {
    try {
      const {status, data} = await requestOpenedPacient(userLoged.id);
      if (status === 200) {
        if (data.data.length > 0) {
          setRequests(data.data);
        } else {
          setRequests(undefined);
        }
      }
    } catch (err) {
      console.log('error onLoadLastRequest', onLoadLastRequest);
      setRequests(undefined);
    }
  };

  const onLoadRequestFinish = async () => {
    try {
      const result = await firestore()
        .collection('consultations')
        .where('userId', '==', userLoged.id)
        .where('status', '==', StatusRequest.finished)
        .get();
      setIsRanking(true);
      setRequest({...result.docs[0].data, id: result.docs[0].id});
    } catch (err) {}
  };

  useEffect(() => {
    onLoadLastRequest();
    onLoadRequestFinish();

    const subscriberRequest = firestore()
      .collection('consultations')
      .where('userId', '==', userLoged.id)
      .onSnapshot(documentsSnapshot => {
        onLoadLastRequest();
      });
    return () => {
      subscriberRequest();
    };
  }, [userLoged]);

  useEffect(() => {
    getAdress();
    getPopulares();
  }, []);

  const getAdress = async () => {
    try {
      const {latitude, longitude} = await getCurrentLocation();
      const {data} = await getLocationDetails(latitude, longitude);
      setDetails(data);
    } catch (error) {
      console.log('error  getAdress', error);
    }
  };

  const getFormatState = state => {
    if (state.includes('State')) {
      return state.split('State')[0];
    } else {
      return state;
    }
  };

  const getPopulares = async () => {
    try {
      const {data} = await getPopulars();
      setPopulars(data.data);
    } catch (error) {
      console.log('error  getPopulares', error);
    }
  };

  const viewDetail = async p => {
    setPopularDetail(p);
    try {
      const {data} = await getPopular(p.MedicoId);
      console.log('doctor', data.data);
      setMedicalDetail(data.data);
      setOpenModalPopular(true);
    } catch (error) {
      console.log('error en detalle de popular', error);
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
          <Text style={styles.sectionTitle}>Información de interés</Text>
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
                  setRequest(p);
                }}
                profile={p.doctorUser.url}
                title={p.doctorUser.fullName}
                stars={parseInt(p.serviceRating, 10)}
                speciality={
                  specialities.find(spec => spec.id === p.doctorUser.medicalSpecialityId).name || ''
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
            <PopularHome
              title={p.DoctorUser.FullName}
              stars={p.avgRating}
              speciality={p.DoctorUser.Speciality.Name}
              profile={p.DoctorUser.Url}
              onPress={() => viewDetail(p)}
            />
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
              {/**
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
              */}
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
            ratingCount={5}
            minValue={0}
            startingValue={0}
            style={{paddingVertical: 10}}
          />
          <TextInput
            value={comment}
            style={{backgroundColor: '#cfcfcf'}}
            onChangeText={val => setComment(val)}
            multiline={true}
            numberOfLines={6}
          />
          <View>
            <Button
              disabled={valRanking === 0 && comment === ''}
              loading={isLoading}
              onPress={async () => {
                setIsLoading(true);
                const {status, data} = await updateRequest({
                  ...request,
                  userId: request.user.id,
                  user: request.user,
                  doctor: request.doctor,
                  status: StatusRequest.finished,
                  serviceRating: `${valRanking}`,
                  comment: comment,
                });
                console.log('onPress() -> data', {dat, sta});
                setIsLoading(false);
                setRequest(undefined);
                setIsRanking(false);
              }}>
              <Text style={{color: 'white'}}>Calificar</Text>
            </Button>
          </View>
        </Dialog>
      )}

      <Modal
        animationType='slide'
        transparent={true}
        visible={openModalPopular}
        onRequestClose={() => {
          setOpenModalPopular(false);
        }}
        style={{margin: 0}}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{display: 'flex', alignItems: 'flex-end', width: '100%'}}>
              <Icon
                type='ionicon'
                name='close-outline'
                color='#0b445e'
                onPress={() => {
                  setOpenModalPopular(false);
                }}
                size={30}
              />
            </View>
            <View style={{width: '100%', display: 'flex', flex: 1}}>
              {medicalDetail && (
                <View style={{flex: 1}}>
                  <View style={styles.center}>
                    <Image
                      source={{
                        uri: medicalDetail.url,
                      }}
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 50,
                      }}
                    />
                  </View>

                  <View style={styles.header}>
                    <Text style={styles.titleHeader}>{medicalDetail.fullName}</Text>
                    <Text style={styles.textHeader}>
                      {popularDetail.DoctorUser.Speciality.Name}
                    </Text>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'center',
                      }}>
                      <Text style={{...styles.textHeader, marginTop: 4}}>Ranking: </Text>
                      <AirbnbRating
                        showRating={false}
                        count={5}
                        defaultRating={popularDetail.avgRating}
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
                    <View style={{width: '100%', marginTop: 20, display: 'flex'}}>
                      <Text style={styles.bodyText}>Credencial:</Text>
                      <Image
                        source={{
                          uri: medicalDetail.urlCredential,
                        }}
                        style={{
                          width: width - 40,
                          height: 362 * ratio,
                          borderRadius: 6,
                        }}
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '100%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 2,
    paddingVertical: 15,
    paddingHorizontal: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flex: 1,
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
  center: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: '#15193f',
  },
});

export default DashboardScreen;

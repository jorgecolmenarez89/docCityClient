import {useContext, useState} from 'react';
import {Alert, Modal, View, StyleSheet, Pressable} from 'react-native';
import {Text, Button, useTheme, Image, Avatar} from '@rneui/themed';

import {BACKGROUNG_COLOR_MODAL, ASSETS} from '../../config/Constant';
import {NavigationRoutes, StatusRequest, TypeToast} from '../../config/Enum';

import {AuthContext} from '@context/AuthContext';
import Notification, {TypeNotification} from '../../models/Notification';
import {sendNotificationRequest} from '../../services/doctor/notification';
import {generateRequest, updateRequest} from '@services/doctor/request';
import {createChat, getChatById} from '../../services/user/chat';
import {debitFound} from '../../services/user/gitfcare';

const ModalNotification = ({
  onClose,
  notification,
  specialities,
}: {
  onClose: () => void;
  notification: Notification;
  specialities: {id: number; name: string}[];
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [widthCard, setWidthCard] = useState(0);
  const {userLoged, showToast, navigation, token, giftCareDataContext} = useContext(AuthContext);

  const startRequest = async () => {
    setIsLoading(true);
    const body = {
      userId: notification.data.data.client.id,
      medicoId: notification.data.data.user.id,
      status: StatusRequest.started,
      serviceRating: '0',
      user: notification.data.data.client,
      doctor: notification.data.data.user,
      description: '',
      createdDate: new Date(),
    };

    try {
      const response: any = await generateRequest(body);
      const status = response?.status || response?.data?.status || 200;
      const responseData = response?.data || null;

      if (status === 200 && responseData) {
        setIsLoading(false);
        showToast({
          description: 'Consulta creada correctamente.',
          type: TypeToast.success,
        });
        onClose();
        // Navegar al stack de pagos después de generar la solicitud
        const requestId = responseData?.data?.id || responseData?.id || '';
        navigation.navigate('PaymentStack', {
          screen: NavigationRoutes.paymentMethods,
          params: {
            doctor: notification.data.data.user,
            requestId,
          },
        });
      } else {
        setIsLoading(false);
        showToast({
          description: 'Error al solicitar consulta.',
          type: TypeToast.error,
        });
      }
    } catch (error) {
      showToast({
        description: 'Error al solicitar consulta.',
        type: TypeToast.error,
      });
      setIsLoading(false);
    }
  };

  //Modal que indica que un doctor acepto la solicitud de consulta
  if (notification.data.type === TypeNotification.request) {
    return (
      <Modal
        animationType='slide'
        transparent={true}
        visible={true}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View>
              <Text style={[styles.modalText, styles.textBold]}>{notification.data.title}</Text>
              <Text style={styles.modalDescription}>{notification.data.description}</Text>
            </View>

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 20,
                marginBottom: 20,
                width: '100%',
              }}>
              {/**
               */}
              <View
                style={{width: '100%', height: 150}}
                onLayout={event => {
                  setWidthCard(event.nativeEvent.layout?.width || 0);
                }}>
                <Image
                  style={{width: widthCard, height: 150}}
                  resizeMode='contain'
                  source={
                    notification.data.data.user.urlCredential !== 'null'
                      ? {uri: notification.data.data.user.urlCredential}
                      : ASSETS.cardDefault
                  }
                />
              </View>

              {specialities && specialities.length > 0 && (
                <Text style={[styles.modalDescription, styles.textBold]}>
                  <Text style={[styles.modalDescription]}>
                    {
                      specialities.find(
                        speciality =>
                          speciality.id == notification.data.data.user.medicalSpecialityId,
                      )?.name
                    }
                  </Text>
                </Text>
              )}
            </View>

            <View style={styles.optionsModal}>
              <Button
                containerStyle={{flex: 1, marginRight: 10}}
                type='outline'
                loading={isLoading}
                onPress={async () => {
                  setIsLoading(true);
                  const body = {
                    userId: userLoged.id,
                    medicoId: notification.data.data.user.id,
                    status: StatusRequest.cancelada,
                    serviceRating: '0',
                    user: userLoged,
                    doctor: notification.data.data.user,
                    id: notification.data.data.idRequest,
                  };
                  const response: any = await updateRequest(body);
                  const status = response?.status || response?.data?.status || 200;

                  if (status === 200) {
                    showToast({
                      description: 'Consulta cancelada.',
                      type: TypeToast.success,
                    });
                    onClose();
                  } else {
                    showToast({
                      description: 'No fue posible cancelar la consulta.',
                      type: TypeToast.error,
                    });
                  }
                  setIsLoading(false);
                }}>
                <Text style={[styles.textStyle, {color: 'black'}]}>Rechazar</Text>
              </Button>

              <Button
                loading={isLoading}
                containerStyle={{flex: 1, marginLeft: 10}}
                onPress={async () => {
                  startRequest();
                }}>
                <Text style={[styles.textStyle]}>Aceptar</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  //Modal que indica que el médico ha verificado el pago
  if (notification.data.type === TypeNotification.paymentConfirmed) {
    return (
      <Modal
        animationType='slide'
        transparent={true}
        visible={true}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View>
              <Text style={[styles.modalText, styles.textBold]}>
                El Médico ha verificado el pago
              </Text>
              <Text style={styles.modalDescription}>
                Para continuar con la consulta presione continuar
              </Text>
            </View>

            <View style={styles.optionsModal}>
              <Button
                loading={isLoading}
                containerStyle={{flex: 1}}
                onPress={async () => {
                  setIsLoading(true);
                  try {
                    // Obtener el idRequest de la notificación
                    const idRequest =
                      notification.data.data.idRequest?.toString() ||
                      notification.data.data.idRequest;

                    // Primero verificar si el chat ya existe
                    const {status: chatExists, data: existingChat} = await getChatById(
                      idRequest,
                      userLoged,
                    );

                    if (chatExists && existingChat) {
                      // Si el chat existe, navegar al listado de chats
                      setIsLoading(false);
                      onClose();
                      navigation.navigate('ChatsStack', {
                        screen: NavigationRoutes.chats,
                      });
                    } else {
                      // Si no existe, crear el chat nuevo usando el idRequest de la notificación
                      const {status: statusChat, data: dataChat} = await createChat({
                        id: idRequest,
                        doctor: notification.data.data.user,
                        user: {...userLoged, deviceToken: token},
                      });

                      if (statusChat) {
                        setIsLoading(false);
                        onClose();
                        // Navegar al listado de chats para que se carguen todos los chats
                        navigation.navigate('ChatsStack', {
                          screen: NavigationRoutes.chats,
                        });
                      } else {
                        setIsLoading(false);
                        console.log('paso algo al crear el chat');
                        showToast({
                          description: 'Error al crear el chat.',
                          type: TypeToast.error,
                        });
                      }
                    }
                  } catch (error) {
                    setIsLoading(false);
                    showToast({
                      description: 'Error al crear el chat.',
                      type: TypeToast.error,
                    });
                  }
                }}>
                <Text style={[styles.textStyle]}>Continuar</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUNG_COLOR_MODAL,
  },
  modalView: {
    margin: 20,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    //borderRadius: 20,
    //padding: 10,
    //elevation: 2,
    //flex: 1,
    //width: '100%',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    //backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
    fontSize: 20,
  },
  modalDescription: {
    color: 'black',
    fontSize: 18,
  },
  textBold: {
    fontWeight: 'bold',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  optionsModal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '80%',
  },
  right: {
    marginRight: 10,
  },
  left: {
    marginLeft: 10,
  },
});

export default ModalNotification;

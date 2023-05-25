import {useContext} from 'react';
import {Alert, Modal, View, StyleSheet, Pressable} from 'react-native';
import {Text, Button, useTheme, Image, Avatar} from '@rneui/themed';

import {BACKGROUNG_COLOR_MODAL, ASSETS} from '../../config/Constant';
import {StatusRequest} from '../../config/Enum';

import {AuthContext} from '@context/AuthContext';
import Notification, {TypeNotification} from '../../models/Notification';
import {sendNotificationRequest} from '../../services/doctor/notification';
import {generateRequest, generateRequestNode} from '@services/doctor/request';

const ModalNotification = ({
  onClose,
  notification,
}: {
  onClose: () => void;
  notification: Notification;
}) => {
  const {userLoged} = useContext(AuthContext);

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

            <View style={{justifyContent: 'center', alignItems: 'center', marginHorizontal: 20}}>
              <Avatar
                containerStyle={{marginBottom: 20}}
                size={100}
                rounded
                source={{uri: notification.data.data.user.photo || ASSETS.user}}></Avatar>

              <Text style={[styles.modalDescription, styles.textBold]}>
                {notification.data.data.user.fullName}
              </Text>
            </View>

            <View style={styles.optionsModal}>
              <Button
                containerStyle={{flex: 1, marginRight: 10}}
                type='outline'
                onPress={() => onClose()}>
                <Text style={[styles.textStyle, {color: 'black'}]}>Rechazar</Text>
              </Button>

              <Button
                containerStyle={{flex: 1, marginLeft: 10}}
                onPress={async () => {
                  const body = {
                    userId: notification.data.data.user.id,
                    medicoId: userLoged.id,
                    status: StatusRequest.inProgress,
                    serviceRating: '0',
                    user: notification.data.data.user,
                    doctor: userLoged,
                  };
                  await generateRequest(body);
                  await generateRequestNode(body);
                  //sendNotificationRequest({client: notification.data.data.user, user: userLoged});
                  onClose();
                }}>
                <Text style={[styles.textStyle]}>Aceptar</Text>
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
    marginBottom: 20,
  },
  textBold: {
    fontWeight: 'bold',
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

import {useEffect, useState} from 'react';
import notifee, {
  AndroidCategory,
  AndroidColor,
  AndroidImportance,
  EventType,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import Notification, {TypeNotification} from '../models/Notification';
import {Alert, Linking} from 'react-native';
import {PREFIXES} from '../config/Constant';

interface OptionNotification {
  notification: {title?: string; body?: string};
  data?: {
    [key: string]: string | object | number;
  };
}

const showNotification = async ({notification, data}: OptionNotification) => {
  //const channelId = await notifee.createChannel({
  //id: 'default',
  //name: 'Default Channel',
  //});

  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Custom',
    lights: true,
    lightColor: AndroidColor.RED,
    vibration: true,
    vibrationPattern: [300, 500],
    importance: AndroidImportance.HIGH,
  });

  console.log('showNotification() => { notification, data }', {
    notification,
    data,
  });

  await notifee.displayNotification({
    title: notification.title,
    body: notification.body,
    data: data,
    android: {
      channelId,
      vibrationPattern: [300, 500],
      lights: [AndroidColor.RED, 300, 600],
      importance: AndroidImportance.HIGH,
      category: AndroidCategory.CALL,
      pressAction: {
        id: 'default',
      },
    },
  });
};

messaging().setBackgroundMessageHandler(async remoteMessage => {
  const {notification, data} = remoteMessage;
  console.log('onBackgroundEvent() ==>', {notification, data});
});

const useNotification = () => {
  const [token, setToken] = useState<string>();
  const [notification, setNotification] = useState<any>();
  const [updateVerfication, setUpdateVerfication] = useState<any>();

  const managerNotification = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    const {data} = remoteMessage;
    const user = {};
    const client = {};
    for (const [key, value] of Object.entries(data)) {
      if (key.indexOf('user_') !== -1) {
        const newKey = key.replace('user_', '');
        user[newKey] = value;
      }

      if (key.indexOf('client_') !== -1) {
        const newKey = key.replace('client_', '');
        client[newKey] = value;
      }
    }

    setNotification(
      new Notification({
        type: data?.type || TypeNotification.request,
        title: data?.title,
        description: data?.description,
        data: {user, idRequest: data?.idRequest, client},
      }),
    );

    if (data?.type === TypeNotification.chat) {
      const supported = await Linking.canOpenURL(`${PREFIXES.navigation}chat/${data.chatId}`);
      console.log('supported ==>', {supported});

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(`${PREFIXES.navigation}chat/${data.chatId}/${data.receiver}`);
      } else {
        Alert.alert(`Don't know how to open this URL: ${PREFIXES.navigation}chat/${data.chatId}`);
      }
    } else if (data?.type === TypeNotification.verificacion) {
      console.log('manager() ==>', {
        data,
        validate: data?.type === TypeNotification.verificacion,
        type: data?.type,
        enum: TypeNotification.verificacion,
      });
      await setUpdateVerfication(updateVerfication + 1);
    }

    await notifee.cancelNotification(remoteMessage.messageId || '');
  };

  const boostrap = async () => {
    await messaging().registerDeviceForRemoteMessages();
    const tokenNew = await messaging().getToken();
    console.log('token ==>', tokenNew);
    setToken(tokenNew);

    messaging().onNotificationOpenedApp(async remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage);
      await managerNotification(remoteMessage);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage);
          await managerNotification(remoteMessage);
        }
      });
  };

  const onDeleteNotification = () => {
    setNotification(undefined);
  };

  useEffect(() => {
    boostrap();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('onMessage() ==> unsubscribe', {remoteMessage});
      showNotification({
        data: remoteMessage.data,
        notification: {
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
        },
      });
    });

    const unsubscribeNotifee = notifee.onForegroundEvent(async ({type, detail}) => {
      console.log('onForegroundEvent() ==> unsubscribe', {type, detail});
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          if (detail.notification) {
            await managerNotification(detail.notification);
          }
          break;
      }
    });

    return () => {
      unsubscribe();
      unsubscribeNotifee();
    };
  }, []);

  return {token, showNotification, notification, onDeleteNotification, updateVerfication};
};

export default useNotification;

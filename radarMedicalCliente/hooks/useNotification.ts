import {useEffect, useState} from 'react';
import notifee, {
  AndroidCategory,
  AndroidColor,
  AndroidImportance,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

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

  const boostrap = async () => {
    await messaging().registerDeviceForRemoteMessages();
    setToken(await messaging().getToken());

    messaging().onNotificationOpenedApp(async remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage,
      );
      await notifee.cancelNotification(remoteMessage.messageId || '');
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
        }
      });
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

    return unsubscribe;
  }, []);

  return [token, showNotification];
};

export default useNotification;

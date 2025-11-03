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
  try {
    // Verificar permisos de notificación
    const settings = await notifee.getNotificationSettings();
    console.log('🔔 Configuración de notificaciones:', settings);

    if (settings.authorizationStatus === 0) {
      // 0 = DENIED
      console.log('❌ Permisos de notificación denegados');
      return;
    }

    // Crear canal de notificación con configuración mejorada
    const channelId = await notifee.createChannel({
      id: 'doccity_notifications',
      name: 'DocCity Notificaciones',
      description: 'Notificaciones de la aplicación DocCity',
      lights: true,
      lightColor: AndroidColor.BLUE,
      vibration: true,
      vibrationPattern: [300, 500, 300, 500],
      importance: AndroidImportance.HIGH,
      sound: 'default',
      bypassDnd: true,
    });

    console.log('✅ Canal de notificación creado:', channelId);
    console.log('📱 Mostrando notificación:', {
      title: notification.title,
      body: notification.body,
      data,
    });

    await notifee.displayNotification({
      title: notification.title || 'DocCity',
      body: notification.body || 'Nueva notificación',
      data: data,
      android: {
        channelId,
        vibrationPattern: [300, 500, 300, 500],
        lights: [AndroidColor.BLUE, 300, 600],
        importance: AndroidImportance.HIGH,
        category: AndroidCategory.MESSAGE,
        pressAction: {
          id: 'default',
          launchActivity: 'default',
        },
        smallIcon: 'ic_launcher',
        largeIcon: 'ic_launcher',
        showTimestamp: true,
        timestamp: Date.now(),
      },
    });

    console.log('✅ Notificación mostrada exitosamente');
  } catch (error) {
    console.error('❌ Error al mostrar notificación:', error);
  }
};

messaging().setBackgroundMessageHandler(async remoteMessage => {
  const {notification, data} = remoteMessage;
  console.log('onBackgroundEvent() ==>', {notification, data});
});

const useNotification = () => {
  const [token, setToken] = useState<string>();
  const [notification, setNotification] = useState<any>();
  const [updateVerfication, setUpdateVerfication] = useState<any>();

  const managerNotification = async (remoteMessage: any) => {
    const {data} = remoteMessage;
    const user: {[key: string]: any} = {};
    const client: {[key: string]: any} = {};
    for (const [key, value] of Object.entries(data || {})) {
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
    try {
      // Solicitar permisos de notificación
      const authStatus = await notifee.requestPermission();
      console.log('🔔 Estado de permisos de notificación:', authStatus);

      if (authStatus.authorizationStatus === 0) {
        console.log('❌ Permisos de notificación denegados por el usuario');
        return;
      }

      await messaging().registerDeviceForRemoteMessages();
      const tokenNew = await messaging().getToken();
      console.log('📱 Token FCM:', tokenNew);
      setToken(tokenNew);
    } catch (error) {
      console.error('❌ Error en bootstrap de notificaciones:', error);
    }

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

  // Función para probar notificaciones locales
  const testNotification = async () => {
    try {
      console.log('🧪 Probando notificación local...');
      await showNotification({
        notification: {
          title: '🧪 Prueba DocCity',
          body: 'Esta es una notificación de prueba para verificar el funcionamiento',
        },
        data: {
          type: 'test',
          timestamp: Date.now(),
        },
      });
    } catch (error) {
      console.error('❌ Error en notificación de prueba:', error);
    }
  };

  return {
    token,
    showNotification,
    notification,
    onDeleteNotification,
    updateVerfication,
    testNotification,
  };
};

export default useNotification;

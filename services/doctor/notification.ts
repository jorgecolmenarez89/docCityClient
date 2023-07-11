import axios from 'axios';
//import {axiosInstance} from '../../config/api';
import {URL_NODE} from '../../config/Constant';
import Chat, {ChatModel} from '../../models/Chat';
import ChatMessage from '../../models/ChatMessage';
import Doctor, {DoctorModel} from '../../models/Doctor';
import {TypeNotification} from '../../models/Notification';
import User from '../../models/User';

export const sendNotificationRequest = async ({
  doctors,
  user,
  idSearch,
}: {
  doctors: Doctor[];
  user: UserModel;
  idSearch?: string;
}) => {
  try {
    console.log('sendNotificationRequest() ==> user', {user});
    let userMap = {};
    for (const [key, value] of Object.entries(user)) {
      console.log(`${key}: ${value}`);
      //Object.defineProperty(userMap, `user.${key}`, {
      //value: value,
      //writable: false,
      //});
      const newKey = 'user_' + key;
      console.log('newKey', newKey);
      userMap[newKey] = `${value}`;
    }
    console.log('sendNotificationRequest() ==> userMap', {doctors, userMap, neess: {...userMap}});

    return await axios.create({baseURL: URL_NODE}).post(
      '/send-notifications',
      {
        registrationTokens: doctors.map(doctor => doctor.getTokenNotification()),
        data: {
          type: 'request',
          title: 'Solicitud de servició',
          description: 'El siguiente usuario solicita una consulta:',
          idSearch: idSearch,
          ...userMap,
        },
        notification: {
          title: 'Solicitud de servició',
          body: `${user.fullName} solicita tus servicios`,
        },
      },
      {
        headers: {'Content-Type': 'application/json; charset=utf-8'},
      },
    );
  } catch (err: any) {
    console.log('sendNotificationRequest() ==> err', {err});
    return {status: false, msg: `err: ${err.message}`};
  }
};

export const sendNotificationChat = async ({
  doctor,
  user,
  chat,
  message,
}: {
  doctor: DoctorModel;
  user: UserModel;
  chat: Chat;
  message: ChatMessage;
}) => {
  try {
    console.log('sendNotificationRequest() ==> user', {user});
    let userMap = {};
    for (const [key, value] of Object.entries(user)) {
      console.log(`${key}: ${value}`);
      //Object.defineProperty(userMap, `user.${key}`, {
      //value: value,
      //writable: false,
      //});
      const newKey = 'user_' + key;
      console.log('newKey', newKey);
      userMap[newKey] = `${value}`;
    }
    console.log('sendNotificationRequest() ==> userMap', {userMap, neess: {...userMap}});

    return await axios.create({baseURL: URL_NODE}).post(
      '/send-notifications',
      {
        registrationTokens: doctor.deviceToken,
        data: {
          type: TypeNotification.chat,
          title: 'Mensaje nuevo',
          description: message.data.text,
          chatId: chat.data.id,
          receiver: user.id,
          ...userMap,
        },
        notification: {
          title: 'Mensaje nuevo',
          body: `${message.data.text}`,
        },
      },
      {
        headers: {'Content-Type': 'application/json; charset=utf-8'},
      },
    );
  } catch (err: any) {
    console.log('sendNotificationRequest() ==> err', {err});
    return {status: false, msg: `err: ${err.message}`};
  }
};

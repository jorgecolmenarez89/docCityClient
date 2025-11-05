import axios from 'axios';
//import {axiosInstance} from '../../config/api';
import {URL_NODE} from '../../config/Constant';
import Chat, {ChatModel} from '../../models/Chat';
import ChatMessage from '../../models/ChatMessage';
import Doctor, {DoctorModel} from '../../models/Doctor';
import {TypeNotification} from '../../models/Notification';
import User, {UserModel} from '../../models/User';

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
    let userMap: {[key: string]: any} = {};
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

    const body = {
      registrationTokens: doctors.map(doctor => doctor.getTokenNotification()),
      data: {
        type: 'request',
        title: 'Solicitud de servicio',
        description: 'El siguiente usuario solicita una consulta:',
        idSearch: idSearch,
        ...userMap,
      },
      notification: {
        title: 'Solicitud de servicio',
        body: `solicitan tus servicios`,
      },
    };

    console.log('sendNotificationRequest() ==> body', {body});
    console.log('URL_NODE', URL_NODE);

    return await axios.create({baseURL: URL_NODE}).post('/send-notifications', body, {
      headers: {'Content-Type': 'application/json; charset=utf-8'},
    });
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
    let userMap: {[key: string]: any} = {};
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

    return await axios.create({baseURL: URL_NODE}).post(
      '/send-notifications',
      {
        registrationTokens: [doctor.deviceToken],
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

export const sendNotificationDoctorFinish = async ({
  doctor,
  user,
  idRequest,
}: {
  doctor: DoctorModel;
  user: UserModel;
  idRequest: string;
}) => {
  try {
    console.log('sendNotificationDoctorFinish() ==> user', {user});
    let userMap: {[key: string]: any} = {};
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
    console.log('sendNotificationDoctorFinish() ==> userMap', {
      userMap,
      neess: {...userMap},
      idRequest,
    });

    return await axios.create({baseURL: URL_NODE}).post(
      '/send-notifications',
      {
        registrationTokens: [doctor.deviceToken],
        data: {
          type: TypeNotification.finishRequest,
          title: 'Consulta finalizada',
          description: 'Realiza el resumen de la consulta',
          idRequest: `${idRequest}`,
          ...userMap,
        },
        notification: {
          title: 'Consulta finalizada',
          body: `Realiza el resumen de la consulta`,
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

export const sendNotificationPaymentSender = async ({
  doctor,
  user,
  idRequest,
  amount,
}: {
  doctor: DoctorModel;
  user: UserModel;
  idRequest: string;
  paymentId?: string;
  amount?: number;
}) => {
  try {
    console.log('sendNotificationPaymentSender() ==> user', {user});
    let userMap: {[key: string]: any} = {};
    for (const [key, value] of Object.entries(user)) {
      console.log(`${key}: ${value}`);
      const newKey = 'user_' + key;
      console.log('newKey', newKey);
      userMap[newKey] = `${value}`;
    }
    console.log('sendNotificationPaymentSender() ==> userMap', {
      userMap,
      idRequest,
      amount,
    });

    const body = {
      registrationTokens: [doctor.deviceToken],
      data: {
        type: TypeNotification.paymentSender,
        title: 'Pago registrado',
        description: `El paciente ha registrado un pago de ${
          amount ? `Bs. ${amount.toFixed(2)}` : 'la consulta'
        }`,
        idRequest: `${idRequest}`,
        amount: amount?.toString() || '',
        ...userMap,
      },
      notification: {
        title: 'Pago registrado',
        body: `El paciente ha registrado un pago ${
          amount ? `de Bs. ${amount.toFixed(2)}` : 'para la consulta'
        }`,
      },
    };
    console.log('sendNotificationPaymentSender() ==> body', {body});
    console.log('__________________________________________________');

    return await axios.create({baseURL: URL_NODE}).post('/send-notifications', body, {
      headers: {'Content-Type': 'application/json; charset=utf-8'},
    });
    console.log('sendNotificationPaymentSender() ==> Ok');
  } catch (err: any) {
    console.log('sendNotificationPaymentSender() ==> err', {err});
    return {status: false, msg: `err: ${err.message}`};
  }
};

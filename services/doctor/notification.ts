import axios from 'axios';
//import {axiosInstance} from '../../config/api';
import {URL_NODE} from '../../config/Constant';
import Doctor from '../../models/Doctor';
import User from '../../models/User';

export const sendNotificationRequest = async ({
  doctors,
  user,
}: {
  doctors: Doctor[];
  user: UserModel;
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
        registrationTokens: doctors.map(doctor => doctor.getTokenNotification()),
        data: {
          type: 'request',
          title: 'Solicitud de servició',
          description: 'El siguiente usuario solicita una consulta:',
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

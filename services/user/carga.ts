import {axiosInstance} from '../../config/api';
import Carga from '../../models/Carga';
import User from '../../models/User';

let relatives: User[] = [];

/*new Carga({
  id: 1,
  name: 'Isabella',
  relationship: 'Hija',
  age: 4,
  sex: 'Femenino',
}),
new Carga({
  id: 1,
  name: 'Leida',
  relationship: 'Abuela',
  age: 78,
  sex: 'Femenino',
}),*/

export const getCargas = (userId: string) => {
  return axiosInstance({isNode: false}).get(`/users/GetUserChildrenByUserId/${userId}`);
};

export const agregarCarga = (body: Carga) => {
  return axiosInstance({isNode: false}).post(`/relatives/AddRelative`, body, {
    headers: {'Content-Type': 'application/json'},
  });
};

export const updateCarga = (body: Carga) => {
  return axiosInstance({isNode: false}).put(`/relatives/UpdateRelative`, body, {
    headers: {'Content-Type': 'application/json'},
  });
};

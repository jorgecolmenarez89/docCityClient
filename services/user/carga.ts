import {axiosInstance} from '../../config/api';
import Carga from '../../models/Carga';

let relatives: Carga[] = [
  new Carga({
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
  }),
];

export const getCargas = () => {
  //return axiosInstance({isNode: false}).get(`/relatives/getRelatives`);
  return relatives;
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

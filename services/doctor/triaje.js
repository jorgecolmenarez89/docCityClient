import {axiosInstance} from '../../config/api';

export const insertTriaje = body => {
  return axiosInstance({isNode: false}).post(`/triaje/InsertTriaje`, body, {
    headers: {'Content-Type': 'application/json'},
  });
};

export const getTriaje = userId => {
  return axiosInstance({isNode: false}).get(`/triaje/GetTriajesByUserId/${userId}`);
};

export const updateTriaje = body => {
  return axiosInstance({isNode: false}).put(`/triaje/UpdateTriaje`, body, {
    headers: {'Content-Type': 'application/json'},
  });
};

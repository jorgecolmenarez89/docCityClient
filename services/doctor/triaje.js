import {axiosInstance} from '../../config/api';

export const insertTriaje = body => {
  return axiosInstance({isNode: false}).post(`/triaje/InsertTriaje`, body, {
    headers: {'Content-Type': 'application/json'},
  });
};

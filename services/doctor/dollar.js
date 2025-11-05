import {axiosInstance} from '../../config/api';

export const getDollarOficial = () => {
  return axiosInstance({isNode: true}).get(`/dolar-oficial`);
};

export const getDollarAll = () => {
  return axiosInstance({isNode: true}).get(`/dolar-all`);
};

export const getDollarParelelo = () => {
  return axiosInstance({isNode: true}).get(`/dolar-paralelo`);
};

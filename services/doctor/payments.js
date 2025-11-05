import {axiosInstance} from '../../config/api';

export const getPayments = doctorId => {
  return axiosInstance({isNode: true}).get(`/paymentMethods/${doctorId}`);
};

export const createPayment = data => {
  return axiosInstance({isNode: true}).post('/payments', data);
};

export const createPaymentSender = data => {
  return axiosInstance({isNode: true}).post('/saveUserPayment', data);
};

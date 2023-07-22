import {axiosInstance} from '../../config/api';

export const getMyGiftCare = userData => {
  return [];
};

export const addGifcare = body => {
  return axiosInstance({isNode: false}).put(`/relatives/UpdateRelative`, body, {
    headers: {'Content-Type': 'application/json'},
  });
};

export const checkMoney = email => {
  return axiosInstance({isNode: false}).get(`GiftCareInfo/GetGiftCareUserByEmail/${email}`);
};

export const debitFound = body => {
  return axiosInstance({isNode: false}).post(`/GiftCareInfo/RegisterMedicalConsultation`, body, {
    headers: {'Content-Type': 'application/json'},
  });
};

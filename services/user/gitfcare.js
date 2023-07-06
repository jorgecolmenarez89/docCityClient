import {axiosInstance} from '../../config/api';

export const getMyGiftCare = userData => {
  return [];
};

export const addGifcare = body => {
  return axiosInstance({isNode: false}).put(`/relatives/UpdateRelative`, body, {
    headers: {'Content-Type': 'application/json'},
  });
};

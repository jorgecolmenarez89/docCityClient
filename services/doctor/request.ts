import {axiosInstance} from '../../config/api';

export const updateRequest = async (data: any) => {
  try {
    return await axiosInstance({isNode: true}).put(`consultations/${data.id}`, data);
  } catch (err: any) {
    return {status: false, msg: err.message};
  }
};

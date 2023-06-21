import {axiosInstance} from '../../config/api';
import {URL_MOCK} from '../../config/Constant';

export const updateRequest = async (data: any) => {
  try {
    return await axiosInstance({isNode: true}).put(`consultations/${data.id}`, data);
  } catch (err: any) {
    console.log('updateRequest() ==> err', {err});
    return {status: false, msg: err.message};
  }
};

export const requestOpenedPacient = async (id: string) => {
  try {
    return await axiosInstance({isNode: true}).get(`request-opened-pacient/${id}`);
  } catch (err: any) {
    console.log('requestOpenedDoctor() ==> err', {err});
    return {status: false, msg: err.message};
  }
};

export const onSaveSearch = async (data: any) => {
  try {
    return await axiosInstance({isNode: true}).post(`search-consultations`, data);
  } catch (err: any) {
    console.log('onSaveSearch() ==> err', {err});
    return {status: false, message: `err: ${err?.message}`};
  }
};

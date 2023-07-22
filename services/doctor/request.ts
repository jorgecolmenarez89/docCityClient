import {axiosInstance} from '../../config/api';
import {URL_MOCK} from '../../config/Constant';

export const generateRequest = async (data: any) => {
  try {
    return await axiosInstance({isNode: true}).post('consultations', data);
  } catch (err: any) {
    console.log('genereateRequest() ==> err', {err});
    return {status: false, msg: err.message};
  }
};

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

export const requestFinish = async (id: string) => {
  try {
    return await axiosInstance({isNode: true}).get(`request-finish-pacient/${id}`);
  } catch (err: any) {
    console.log('requestFinish() ==> err', {err});
    return {status: false, msg: err.message};
  }
};

export const requestById = async (id: string) => {
  try {
    return await axiosInstance({isNode: false}).get(`users/GetRequestByRequestId/${id}`);
  } catch (err: any) {
    console.log('requestFinish() ==> err', {err});
    return {status: false, msg: err.message};
  }
};

export const getRatingDoctor = async (id: string) => {
  try {
    return await axiosInstance({isNode: true}).get(`getRatingDoctor/${id}`);
  } catch (err: any) {
    console.log('getRatingDoctor() ==> err', {err});
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

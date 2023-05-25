import axios from 'axios';
import {API_URL_NODE, API_URL} from '../../config/Constant';

export const generateRequest = async (data: any) => {
  try {
    return await axios.create({baseURL: API_URL}).post('users/InsertRequest', data);
  } catch (err: any) {
    return {status: false, msg: err.message};
  }
};

export const generateRequestNode = async (data: any) => {
  try {
    return await axios.create({baseURL: API_URL_NODE}).post('consultations', data);
  } catch (err: any) {
    return {status: false, msg: err.message};
  }
};

import {API_URL} from '../../config/Constant';
import axios from 'axios';

export const getEspecialities = () => {
  return axios.get(`${API_URL}/Speciality/GetSpecialities`);
};

export const getMedicinalBranch = () => {};

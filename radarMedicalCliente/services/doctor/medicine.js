import {API_URL} from '../../config/api';
import axios from 'axios';

export const getEspecialities = () => {
    return axios.get(`${API_URL}/Speciality/GetSpecialities`);
}

export const getMedicinalBranch = () => {

}
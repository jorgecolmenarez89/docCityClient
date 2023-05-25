import axios from 'axios';
import {API_URL} from './Constant';

export const axiosInstance = axios.create(
  {baseURL: API_URL},
  {
    headers: {'Content-Type': 'application/json; charset=utf-8'},
  },
);

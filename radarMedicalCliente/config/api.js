import axios from 'axios'
export const API_URL = 'http://209.145.57.238:8080/api';


export const axiosInstance = axios.create({ baseURL: API_URL })
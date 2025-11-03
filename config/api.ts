import axios from 'axios';
import {API_URL, API_URL_NODE} from './Constant';

export const axiosInstance = ({isNode, url}: {isNode?: boolean; url?: string}) => {
  const axiosConfig = {
    baseURL: isNode ? API_URL_NODE : url ? url : API_URL,
    headers: {'Content-Type': 'application/json; charset=utf-8'},
    // Configuración para ignorar certificados SSL inválidos
    httpsAgent: {
      rejectUnauthorized: false,
    },
    // Timeout para evitar que se cuelgue
    timeout: 10000,
  };

  return axios.create(axiosConfig);
};

import axios from 'axios';
import {API_URL, API_URL_NODE} from './Constant';

export const axiosInstance = ({isNode, url}: {isNode?: boolean; url?: string}) => {
  console.log('🚀 ~ axiosInstance ~ isNode:', isNode);
  console.log('🚀 ~ axiosInstance ~ url:', url);
  console.log('🚀 ~ axiosInstance ~ API_URL:', API_URL);
  console.log('🚀 ~ axiosInstance ~ API_URL_NODE:', API_URL_NODE);

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

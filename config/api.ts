import axios from 'axios';
import {API_URL, API_URL_NODE} from './Constant';

export const axiosInstance = ({isNode, url}: {isNode?: boolean; url?: string}) => {
  console.log(API_URL_NODE);
  if (isNode) {
    return axios.create(
      {baseURL: API_URL_NODE},
      {
        headers: {'Content-Type': 'application/json; charset=utf-8'},
      },
    );
  } else {
    return axios.create(
      {baseURL: url || API_URL},
      {
        headers: {'Content-Type': 'application/json; charset=utf-8'},
      },
    );
  }
};

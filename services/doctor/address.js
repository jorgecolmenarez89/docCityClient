import {axiosInstance} from '../../config/api';
import {URL_MOCK} from '../../config/Constant';

export const getProivinces = () => {
  return axiosInstance({isNode: false}).get(`/address/GetEstados`);
};

export const getProivincesById = id => {
  return axiosInstance({isNode: false}).get(`/address/GetEstadosById/${id}`);
};

export const getMunicipalities = () => {
  return axiosInstance({isNode: false}).get(`/address/GetMunicipios`);
};

export const getMunicipalitiesByProvinceId = id => {
  return axiosInstance({isNode: false}).get(`/address/GetMunicipiosByEstadoId/${id}`);
};

export const getParroquies = () => {
  return axiosInstance({isNode: false}).get(`/address/GetParroquias`);
};

export const getParroquiesByMinicipalyId = id => {
  return axiosInstance({isNode: false}).get(`/address/GetParroquiasByMunicipioId/${id}`);
};

export const getCities = () => {
  return axiosInstance({isNode: false}).get(`/address/GetCiudades`);
};

export const getCitiesByParroquieId = id => {
  return axiosInstance({isNode: false}).get(`/address/GetCiudadesByParroquiaId/${id}`);
};

export const getLocationDetails = (latitude, longitude) => {
  return axiosInstance({isNode: false}).get(`/address/getLocationDetails/${latitude}/${longitude}`);
};

export const getRegions = () => {
  return axiosInstance({}).get(`address/GetRegiones`);
};
